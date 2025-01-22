import AuthenticationController from "../controllers/AuthenticationController";

import { jwtDecode } from "../utils/jwt";

import MyResponse from "@/commons/utils/response/MyResponse";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ForeignKeyConstraintError } from "sequelize";
import CreateError from "../utils/auth-error-types";
import MyError from "@/commons/utils/error/MyError";

const AuthenticationRoute = express.Router();

AuthenticationRoute.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

    if (!data.username) {
      MyError.sendMyError(CreateError("USERNAME_REQUIRED"), res, 400);

      return;
    }
    if (!data.password) {
      MyError.sendMyError(CreateError("PASSWORD_REQUIRED"), res, 400);
      return;
    }
    if (!data.firstname) {
      MyError.sendMyError(CreateError("FIRSTNAME_REQUIRED"), res, 400);

      return;
    }
    if (!data.lastname) {
      MyError.sendMyError(CreateError("LASTNAME_REQUIRED"), res, 400);
      return;
    }
    if (!data.email) {
      MyError.sendMyError(CreateError("EMAIL_REQUIRED"), res, 400);
      return;
    }

    try {
      await AuthenticationController.Register({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        username: data.username,
        password: data.password,
      });
      res.status(200).send(MyResponse.createResponse("User is created."));
    } catch (e: any) {
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth_type = req.headers["auth-type"];

      if (auth_type == "password") {
        const { username, password } = req.body;

        if (!password) {
          MyError.sendMyError(CreateError("PASSWORD_REQUIRED"), res, 400);

          return;
        }
        if (!username) {
          MyError.sendMyError(CreateError("USERNAME_REQUIRED"), res, 400);
          return;
        }

        const tokens = await AuthenticationController.PasswordBasedLogin(
          username,
          password
        );

        res.setHeader("Set-Cookie", [
          `refresh_token=${tokens.refresh_token}; Path=/; HttpOnly`,
          `access_token=${tokens.access_token}; Path=/; HttpOnly`,
        ]);
        res.status(200).send(MyResponse.createResponse(tokens));
        return;
      }

      MyError.sendMyError(CreateError("AUTH_TYPE_NOT_SUPPORTED"), res, 400);
    } catch (e) {
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    try {
      const access_token = req.headers.authorization?.split(" ")[1];
      if (!access_token) {
        MyError.sendMyError(CreateError("ACCESS_TOKEN_NOT_FOUND"), res, 400);
        return;
      }

      const payload = jwtDecode(access_token);
      const user_id = payload.user_id;
      await AuthenticationController.Logout(user_id);
      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/get-access-token",
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      MyError.sendMyError(CreateError("REFRESH_TOKEN_NOT_FOUND"), res, 400);
      return;
    }
    try {
      const new_access_token =
        await AuthenticationController.RefreshAccessToken(refresh_token);
      res
        .status(200)
        .send(MyResponse.createResponse({ access_token: new_access_token }));
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        if (e.message === "jwt malformed") {
          next(CreateError("BAD_JSON"));
          return;
        }
      } else if (e instanceof ForeignKeyConstraintError) {
        next(CreateError("USER_ID_NOT_FOUND"));
        return;
      }
      next(e);
    }
  }
);

AuthenticationRoute.post(
  "/check-session",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers["authorization"]?.split(" ")[1];

      if (!access_token) {
        res.sendStatus(401);
        return;
      }

      const status = await AuthenticationController.CheckIsTokenExistAndValid(
        access_token
      );
      if (status.valid) {
        res.status(200).json(MyResponse.createResponse({ status: "valid" }));
      } else if (status.expired) {
        res.status(401).json(MyResponse.createResponse({ status: "expired" }));
      } else if (status.notFound) {
        res.status(401).json(MyResponse.createResponse({ status: "invalid" }));
      }
    } catch (e) {
      next(e);
    }
  }
);

export default AuthenticationRoute;
