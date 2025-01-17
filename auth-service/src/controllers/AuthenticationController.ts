import PasswordBasedAuth from "@/database/models/authentication_types/PasswordBasedAuth";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyError from "@/utils/error/MyError";
import User from "@/database/models/User";
import { UniqueConstraintError, ValidationError } from "sequelize";
import Token from "@/database/models/Token";
import { jwtDecode, jwtSign } from "@/utils/jwt";
import PasswordHash from "@/utils/encryption";
import Logger from "@/utils/logger";

const REFESH_TOKEN_EXP_TIME: number = Number(
  process.env.REFRESH_TOKEN_EXP_TIME_IN_MS
);
const ACCESS_TOKEN_EXP_TIME: number = Number(
  process.env.ACCESS_TOKEN_EXP_TIME_IN_MS
);

export default class AuthenticationController {
  /**
   * Authenticates a user using a username and password.
   *
   * @param username - The username of the user attempting to log in.
   * @param password - The password of the user attempting to log in.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   * @throws {MyError} Throws an error if the credentials are incorrect.
   */
  public static async PasswordBasedLogin(
    username: string,
    password: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const passwordBasedAuth: PasswordBasedAuth | null =
        await this.CheckCredential(username, password);

      if (!passwordBasedAuth) {
        throw MyError.createError(MyErrorTypes.WRONG_CREDENTIALS);
      }

      const access_token = await this.CreateAccessToken(
        passwordBasedAuth.user_id
      );
      const refresh_token = await this.CreateRefreshToken(
        passwordBasedAuth.user_id
      );

      await passwordBasedAuth.update({
        last_login: new Date(Date.now()),
      });

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * Registers a new user with the provided data.
   *
   * @param data - The registration data.
   * @param data.username - The username for the new user.
   * @param data.password - The password for the new user.
   * @param data.firstname - The first name of the new user.
   * @param data.lastname - The last name of the new user.
   * @param data.email - The email address of the new user.
   * @returns A promise that resolves to the newly created user.
   * @throws {MyError} If the user already exists or if there is a validation error.
   */
  public static async Register(data: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
  }): Promise<User> {
    let newUser: User;
    let passwordAuth: PasswordBasedAuth;

    try {
      newUser = await User.create({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        is_email_verified: false,
        is_system_user: false,
      });

      try {
        passwordAuth = await PasswordBasedAuth.create({
          username: data.username!,
          password: data.password!,
          user_id: newUser.id,
        });
      } catch (e: any) {
        await newUser.destroy({ force: true });
        if (e instanceof ValidationError) {
          throw MyError.createError(
            MyErrorTypes.USER_ALREADY_EXISTS,
            e.errors[0].message
          );
        }
        throw e;
      }

      return newUser;
    } catch (e: any) {
      if (e instanceof UniqueConstraintError) {
        throw MyError.createError(
          MyErrorTypes.USER_ALREADY_EXISTS,
          e.errors[0].message
        );
      }
      throw e;
    }
  }

  /**
   * Logs out the user by deleting all tokens associated with the given user ID.
   *
   * @param user_id - The ID of the user to log out.
   * @returns A promise that resolves when the logout process is complete.
   * @throws Will throw an error if there is an issue during the token deletion process.
   */
  public static async Logout(user_id: string): Promise<void> {
    try {
      const access_token_list = await Token.findAll({
        where: {
          user_id: user_id,
        },
      });

      Promise.all(
        access_token_list.map(async (token) => {
          await token.destroy({ force: true });
        })
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * Refreshes the access token using the provided refresh token.
   *
   * @param {string} refresh_token - The refresh token used to generate a new access token.
   * @returns {Promise<string>} - A promise that resolves to the new access token.
   * @throws {MyError} - Throws an error if the token type is not "refresh" or if the refresh token is not found or invalid.
   */
  public static async RefreshAccessToken(
    refresh_token: string
  ): Promise<string> {
    try {
      const decoded_token = jwtDecode(refresh_token);
      const { user_id, token_type } = JSON.parse(JSON.stringify(decoded_token));

      if (token_type !== "refresh") {
        throw MyError.createError(MyErrorTypes.REFRESH_TOKEN_NOT_FOUND);
      }
      const isTokenExist = await this.CheckIsTokenExistAndValid(refresh_token);
      if (!isTokenExist) {
        this.DeleteTokenPairsByUserId(user_id);
        throw MyError.createError(MyErrorTypes.REFRESH_TOKEN_NOT_FOUND);
      }
      const new_access_token = await this.CreateAccessToken(user_id);
      return new_access_token;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Creates a new access token for the specified user.
   *
   * This method first destroys any existing access tokens for the user,
   * then generates a new access token, saves it to the database, and returns it.
   *
   * @param user_id - The ID of the user for whom the access token is being created.
   * @returns A promise that resolves to the newly created access token.
   * @throws Will throw an error if token creation or database operations fail.
   */
  public static async CreateAccessToken(user_id: string): Promise<string> {
    try {
      await Token.destroy({
        where: {
          user_id: user_id,
          token_type: "access",
        },
        force: true,
      });

      const access_token = jwtSign({
        user_id: user_id,
        token_type: "access",
      });

      await Token.create({
        token: access_token,
        token_type: "access",
        expires_at: new Date(Date.now() + ACCESS_TOKEN_EXP_TIME), // 1 saat geçerli refresh token.
        user_id: user_id,
      });

      return access_token;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Creates a new refresh token for the specified user.
   *
   * This method first destroys any existing refresh tokens for the user,
   * then generates a new refresh token, saves it to the database, and returns it.
   *
   * @param user_id - The ID of the user for whom the refresh token is being created.
   * @returns A promise that resolves to the newly created refresh token.
   * @throws Will throw an error if the token creation process fails.
   */
  public static async CreateRefreshToken(user_id: string): Promise<string> {
    try {
      await Token.destroy({
        where: {
          user_id: user_id,
          token_type: "refresh",
        },
        force: true,
      });

      const refresh_token = jwtSign({
        user_id: user_id,
        token_type: "refresh",
      });

      await Token.create({
        token: refresh_token,
        token_type: "refresh",
        expires_at: new Date(Date.now() + REFESH_TOKEN_EXP_TIME), // 24 saat geçerli refresh token.
        user_id: user_id,
      });

      return refresh_token;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Checks the provided credentials against the stored credentials.
   *
   * @param username - The username to check.
   * @param password - The password to check.
   */
  public static async CheckCredential(
    username: string,
    password: string
  ): Promise<PasswordBasedAuth | null> {
    try {
      const passwordBasedAuth: PasswordBasedAuth | null =
        await PasswordBasedAuth.findOne({
          where: {
            username: username,
            password: PasswordHash(password),
          },
        });

      return passwordBasedAuth;
    } catch (e) {
      throw MyError.createError(MyErrorTypes.UNKNOWN);
    }
  }

  /**
   * Checks if a token exists and is valid.
   *
   * This method queries the database to find a token that matches the provided token string.
   * If the token is found, it checks if the token has expired by comparing the current date
   * with the token's expiration date.
   *
   * @param token - The token string to be checked.
   * @returns A promise that resolves to `true` if the token exists and is valid, otherwise `false`.
   * @throws Will throw an error if there is an issue with the database query.
   */
  public static async CheckIsTokenExistAndValid(
    token: string
  ): Promise<boolean> {
    try {
      const tokenData: Token | null = await Token.findOne({
        where: {
          token: token,
        },
      });
      if (!tokenData) {
        return false;
      }

      const expiresAtDate = new Date(tokenData.expires_at);

      if (expiresAtDate < new Date(Date.now())) {
        return false;
      }

      return true;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Deletes all token pairs associated with a given user ID.
   *
   * This method permanently removes all token pairs from the database
   * for the specified user by their user ID.
   *
   * @param user_id - The ID of the user whose token pairs are to be deleted.
   * @throws Will throw an error if the deletion process fails.
   */
  public static async DeleteTokenPairsByUserId(user_id: string) {
    try {
      await Token.destroy({
        where: {
          user_id: user_id,
        },
        force: true,
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Extracts the user ID from a given Access token.
   *
   * @param token - The JWT token from which to extract the user ID.
   * @returns A promise that resolves to an object containing the user ID.
   * @throws Will throw an error if the token cannot be decoded.
   */
  public static GetUserIdFromToken(access_token: string): string {
    try {
      const decoded_token = jwtDecode(access_token);
      const { user_id } = JSON.parse(JSON.stringify(decoded_token));
      return user_id;
    } catch (e) {
      throw e;
    }
  }
}
