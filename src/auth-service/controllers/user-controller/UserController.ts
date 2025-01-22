import User from "@/auth-service/models/User";
import { ValidationError } from "sequelize";
import {
  UserCreateOptions,
  UserPasswordUpdateOptions,
  UserUpdateOptions,
} from "./UserControllerTypes";
import Role from "@/auth-service/models/Role";
import PasswordBasedAuth from "@/auth-service/models/authentication_types/PasswordBasedAuth";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import RoleController from "../role-controller/RoleController";
import CreateError from "@/auth-service/utils/auth-error-types";

export default class UserController {
  public static staticUserIdList: string[] = [
    "cd0acd8e-228a-4a43-938f-858980eba621", // Yönetici
  ];

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user object if found.
   * @throws {MyError} If the user is not found.
   */
  public static async GetUserById(id: string): Promise<User> {
    try {
      const user = await User.findByPk(id, {
        include: [Role, PasswordBasedAuth],
      });
      if (!user) {
        throw CreateError("USER_NOT_FOUND");
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Creates a new user with the provided information.
   *
   * @param {UserCreateOptions} userInfo - The information of the user to be created.
   * @returns {Promise<User>} A promise that resolves to the created user.
   * @throws Will throw an error if the user creation fails.
   */
  public static async CreateUser(userInfo: UserCreateOptions): Promise<User> {
    const t = await SEQUELIZE_DATABASE.transaction();
    try {
      const { username, password, ...otherUserInfo } = userInfo;
      const user = await User.create(
        {
          ...otherUserInfo,
        },
        { transaction: t }
      );
      await PasswordBasedAuth.create(
        {
          username,
          password,
          user_id: user.id,
        },
        { transaction: t }
      );

      await t.commit();
      await RoleController.AddRoleToUser(
        user.id,
        "b3cf85b7-4995-43fc-9790-58c032b27ab6"
      );
      return user;
    } catch (e) {
      await t.rollback();
      if (e instanceof ValidationError) {
        if (e.errors[0].type == "unique violation") {
          switch (e.errors[0].path) {
            case "username":
              throw CreateError("USERNAME_ALREADY_EXIST");
            case "email":
              throw CreateError("EMAIL_ALREADY_EXIST");
          }
        }
      }
      throw e;
    }
  }

  /**
   * Deletes multiple users by their IDs.
   *
   * @param ids - An array of user IDs to be deleted.
   * @returns A promise that resolves when all users have been deleted.
   * @throws Will throw an error if the deletion process fails.
   */
  public static async DeleteUsersById(id: string): Promise<void> {
    if (this.staticUserIdList.includes(id)) {
      throw CreateError("CANNOT_DELETE_ADMIN_USER");
    }
    const t = await SEQUELIZE_DATABASE.transaction();
    try {
      await PasswordBasedAuth.destroy({
        where: {
          user_id: id,
        },
        transaction: t,
      });

      await User.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });

      t.commit();
    } catch (e) {
      t.rollback();
      throw e;
    }
  }

  /**
   * Updates the user information with the provided new information.
   *
   * @param user_id - The ID of the user to be updated.
   * @param new_info - An object containing the new information for the user.
   * @returns The updated user object.
   * @throws Will throw an error if the user cannot be found or the update fails.
   */
  public static async UpdateUser(user_id: string, new_info: UserUpdateOptions) {
    try {
      const user = await this.GetUserById(user_id);
      await user.update(new_info);
      return user;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates the password-based authentication information for a user.
   *
   * @param user_id - The ID of the user whose password-based authentication information is to be updated.
   * @param new_info - An object containing the new password-based authentication information.
   * @throws Will throw an error if the user cannot be found or if the update operation fails.
   */
  public static async SetPasswordBaseAuth(
    user_id: string,
    new_info: UserPasswordUpdateOptions
  ) {
    try {
      const user = await this.GetUserById(user_id);
      const userPasswordBaseAuth = await user.getPasswordBasedAuth();
      await userPasswordBaseAuth.update(new_info);
      return;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves a paginated list of users from the database.
   *
   * @param {number} [page] - The page number to retrieve. If not provided, pagination is not applied.
   * @param {number} [limit] - The number of users to retrieve per page. If not provided, pagination is not applied.
   * @returns {Promise<{ userList: User[]; totalCount: number }>} A promise that resolves to an object containing the list of users and the total count of users.
   * @throws Will throw an error if the database query fails.
   */
  public static async GetUsers(
    page?: number,
    limit?: number
  ): Promise<{ userList: User[]; totalCount: number }> {
    try {
      const Paginagiton: any = {};

      if (limit && page) {
        Paginagiton["offset"] = (page - 1) * limit;
        Paginagiton["limit"] = limit;
      }

      const users = await User.findAll({
        ...Paginagiton,
        include: Role,
      });

      const totalUserCount = await User.count();
      return {
        userList: users,
        totalCount: totalUserCount,
      };
    } catch (e) {
      throw e;
    }
  }
}
