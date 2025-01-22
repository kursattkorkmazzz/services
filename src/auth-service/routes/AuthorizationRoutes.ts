import MyError from "@/commons/utils/error/MyError";
import AuthenticationController from "../controllers/AuthenticationController";
import AuthorizationController from "../controllers/AuthorizationController";

import MyResponse from "@/commons/utils/response/MyResponse";
import express, { NextFunction, Request, Response } from "express";
import CreateError from "../utils/auth-error-types";

const AuthorizationRoute = express.Router();

AuthorizationRoute.post(
  "/check-permission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers["authorization"]?.split(" ")[1];
      if (!access_token) {
        MyError.sendMyError(CreateError("ACCESS_TOKEN_NOT_FOUND"), res, 401);
        return;
      }

      const user_id = AuthenticationController.GetUserIdFromToken(access_token);

      const { operation_code } = req.body;

      if (!user_id) {
        MyError.sendMyError(CreateError("USER_ID_NOT_FOUND"), res, 400);
        return;
      }
      if (!operation_code) {
        MyError.sendMyError(CreateError("OPERATION_CODE_NOT_FOUND"), res, 400);
        return;
      }

      if (operation_code instanceof Array) {
        const granted: boolean[] = await Promise.all(
          operation_code.map(async (code: string) => {
            return await AuthorizationController.CheckPermission(user_id, code);
          })
        );

        const access = [...granted.map((g) => (g ? "granted" : "denied"))];

        res.json(MyResponse.createResponse({ access }));
        return;
      } else {
        const isGranted: boolean =
          await AuthorizationController.CheckPermission(
            user_id,
            operation_code
          );
        if (isGranted) {
          res.json(MyResponse.createResponse({ access: "granted" }));
          return;
        }
      }
      res.json(MyResponse.createResponse({ access: "denied" }));
    } catch (e) {
      next(e);
    }
  }
);
export default AuthorizationRoute;
