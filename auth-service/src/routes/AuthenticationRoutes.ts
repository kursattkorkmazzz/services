import CheckCredential from "@/controllers/authentication-controller/check-credential";
import CreateToken from "@/controllers/authentication-controller/create-token";
import CreateUser, {
  CreateUserDataType,
} from "@/controllers/authentication-controller/create-user";
import GetNewAccessToken from "@/controllers/authentication-controller/get-access-token";
import Logout from "@/controllers/authentication-controller/logout";
import PasswordBasedAuth from "@/database/models/authentication_types/PasswordBasedAuth";

import MyError from "@/utils/error/MyError";
import { jwtDecode } from "@/utils/jwt";
import Logger from "@/utils/logger";
import MyResponse from "@/utils/response/MyResponse";
import express, { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

const AuthenticationRoute = express.Router();

AuthenticationRoute.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const data: CreateUserDataType = req.body;

    if (!data.username) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Username is required"));
      return;
    }
    if (!data.password) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Password is required"));
      return;
    }

    if (!data.firstname) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Firstname is required"));
      return;
    }
    if (!data.lastname) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Lastname is required"));
      return;
    }
    if (!data.email) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Email is required"));
      return;
    }

    try {
      await CreateUser(data);
      res
        .status(200)
        .send(MyResponse.createResponse("user is created, successfully", null));
    } catch (e: any) {
      Logger.error(e);
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!password) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Password is required"));
      return;
    }
    if (!username) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "Username is required"));
      return;
    }

    try {
      const passwordBasedAuth: PasswordBasedAuth = await CheckCredential(
        username,
        password
      );

      const { access_token, refresh_token } = await CreateToken(
        passwordBasedAuth.user_id
      );

      res.setHeader("Set-Cookie", [
        `refresh_token=${refresh_token}; HttpOnly`,
        `access_token=${access_token}; HttpOnly`,
      ]);

      res.json({ refresh_token, access_token });
    } catch (e) {
      Logger.error(e);
      if (e instanceof MyError) {
        res.status(400).send(MyResponse.createResponse(null, e.message));
        return;
      }
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers.authorization?.split(" ")[1];
      if (!access_token) {
        res
          .status(400)
          .send(MyResponse.createResponse(null, "Access token is required"));
        return;
      }

      const payload = jwtDecode(access_token);
      const user_id = payload.user_id;
      Logout(user_id);
      res.sendStatus(200);
    } catch (e) {
      Logger.error(e);
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/get-access-token",
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res
        .status(400)
        .send(MyResponse.createResponse(null, "refresh_token is required."));
      return;
    }

    try {
      const access_token = await GetNewAccessToken(refresh_token);

      res.status(200).send(MyResponse.createResponse({ access_token }));
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        if (e.message === "jwt malformed") {
          res
            .status(400)
            .send(
              MyResponse.createResponse(
                null,
                "You have to give refresh token as correct format."
              )
            );

          next();
          return;
        }
      }

      if (e instanceof MyError) {
        res.status(400).send(MyResponse.createResponse(null, e.message));
        next();
        return;
      }

      next(e);
    }
  }
);

export default AuthenticationRoute;
