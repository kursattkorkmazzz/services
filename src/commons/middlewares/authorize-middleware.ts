import Logger from "../utils/logger";
import MyResponse from "../utils/response/MyResponse";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import http from "http";
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

      const result = await axios.post(
        "http://localhost:3000/authz/check-permission",
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
        res
          .status(403)
          .send(
            MyResponse.createResponse(
              null,
              "You don't have permission to access this resource."
            )
          );
        return;
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
