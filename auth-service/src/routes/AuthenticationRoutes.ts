import AuthenticationController from "@/controllers/AuthenticationController";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import { jwtDecode } from "@/utils/jwt";
import Logger from "@/utils/logger";
import MyResponse from "@/utils/response/MyResponse";
import express, { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { ForeignKeyConstraintError } from "sequelize";

const AuthenticationRoute = express.Router();

AuthenticationRoute.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;

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
      await AuthenticationController.Register({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        username: data.username,
        password: data.password,
      });
      res.status(200).send(MyResponse.createResponse("User is created.", null));
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

      res
        .status(400)
        .json(MyResponse.createResponse(null, "Auth type is not supported."));
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
        res
          .status(400)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(
                MyErrorTypes.ACCESS_TOKEN_NOT_FOUND
              ).toString()
            )
          );
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
      res
        .status(400)
        .send(
          MyResponse.createResponse(
            null,
            MyError.createError(MyErrorTypes.REFRESH_TOKEN_NOT_FOUND).toString()
          )
        );
      return;
    }
    try {
      const new_access_token =
        await AuthenticationController.RefreshAccessToken(refresh_token);
      res
        .status(200)
        .send(MyResponse.createResponse({ access_token: new_access_token }));
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        if (e.message === "jwt malformed") {
          next(MyError.createError(MyErrorTypes.BAD_JSON));
          return;
        }
      } else if (e instanceof ForeignKeyConstraintError) {
        next(MyError.createError(MyErrorTypes.USER_ID_NOT_FOUND));
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
