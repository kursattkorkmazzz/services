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
              "You have to provide access token in authorization header with bearer."
            )
          );
        return;
      }
      // Checking the permission.
      next();
    } catch (e) {
      next(e);
    }
  };
}
