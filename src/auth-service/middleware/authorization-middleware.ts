import MyError from "@/commons/utils/error/MyError";
import AuthenticationController from "../controllers/AuthenticationController";
import AuthorizationController from "../controllers/AuthorizationController";

import MyResponse from "@/commons/utils/response/MyResponse";
import { NextFunction, Request, Response } from "express";
import CreateError from "../utils/auth-error-types";

export default function authorizationMiddleware(permission_code: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers["authorization"]?.split(" ")[1];
      if (!access_token) {
        MyError.sendMyError(CreateError("ACCESS_TOKEN_NOT_FOUND"), res, 401);
        return;
      }
      // If user is not logged in, return 401 - Not Authorized
      const isLogged =
        AuthenticationController.CheckIsTokenExistAndValid(access_token);
      if (!isLogged) {
        MyError.sendMyError(CreateError("USER_NOT_LOGGED_IN"), res, 401);
        return;
      }
      // Check if user has permission to access the route
      const user_id = await AuthenticationController.GetUserIdFromToken(
        access_token
      );
      const isAuth = await AuthorizationController.CheckPermission(
        user_id,
        permission_code
      );

      // If user does not have permission, return 401 - Not Authorized
      if (!isAuth) {
        MyError.sendMyError(CreateError("PERMISSION_DENIED"), res, 401);
        return;
      }

      // If user has permission, call next()
      next();
    } catch (e) {
      next(e);
    }
  };
}
