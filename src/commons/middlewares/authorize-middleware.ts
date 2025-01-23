import MyResponse from "../utils/response/MyResponse";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import MyError from "../utils/error/MyError";
import { CreateError } from "../utils/error/ CommonErrorTypes";

const AUTH_SERVICE_URI = "http://localhost";
const AUTH_SERVICE_PORT = "4000";

export default function authorizationMiddleware(permission_code: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers["authorization"]?.split(" ")[1];

      if (!access_token) {
        MyError.sendMyError(CreateError("ACCESS_TOKEN_NOT_FOUND"), res, 400);
        return;
      }

      // Checking the permission.

      const result = await axios.post(
        `${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/authz/check-permission`,
        {
          operation_code: permission_code, // veya  tek elemanlı kontrol: "user:create"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      if (result.data.data.access !== "granted") {
        MyError.sendMyError(CreateError("PERMISSON_DENIED"), res, 403);
        return;
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
