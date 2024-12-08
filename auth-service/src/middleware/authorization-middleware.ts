import AuthenticationController from "@/controllers/AuthenticationController";
import AuthorizationController from "@/controllers/AuthorizationController";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyResponse from "@/utils/response/MyResponse";
import { NextFunction, Request, Response } from "express";

export default function authorizationMiddleware(permission_code: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers["authorization"]?.split(" ")[1];
      if (!access_token) {
        res
          .status(401)
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
      // If user is not logged in, return 401 - Not Authorized
      const isLogged =
        AuthenticationController.CheckIsTokenExistAndValid(access_token);
      if (!isLogged) {
        res
          .status(401)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.USER_NOT_LOGGED_IN).toString()
            )
          );
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
        res
          .status(401)
          .send(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.PERMISSION_DENIED).toString()
            )
          );
        return;
      }

      // If user has permission, call next()
      next();
    } catch (e) {
      next(e);
    }
  };
}
