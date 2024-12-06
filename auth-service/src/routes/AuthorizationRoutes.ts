import CheckPermission from "@/controllers/authorization-controller/CheckPermission";
import Token from "@/database/models/Token";
import { jwtDecode } from "@/utils/jwt";
import MyResponse from "@/utils/response/MyResponse";
import express, { NextFunction, Request, Response } from "express";

const AuthorizationRoute = express.Router();

AuthorizationRoute.post(
  "/checkPermission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, operation_code } = req.body;

      if (!user_id) {
        res.status(401).json(MyResponse.createResponse("User id is required"));
        return;
      }
      if (!operation_code) {
        res
          .status(401)
          .json(MyResponse.createResponse("Operation code is required"));
        return;
      }

      const isGranted: boolean = await CheckPermission(user_id, operation_code);

      if (isGranted) {
        res.json(MyResponse.createResponse({ access: "granted" }));
        return;
      }
      res.json(MyResponse.createResponse({ access: "denied" }));
    } catch (e) {
      next(e);
    }
  }
);

AuthorizationRoute.post(
  "/checkSession",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.headers["authorization"]?.split(" ")[1];

      if (!access_token) {
        res.sendStatus(401);
        return;
      }

      const { user_id, token_type } = jwtDecode(access_token);

      if (token_type !== "access") {
        res.sendStatus(401);
        return;
      }

      const Access_Token = await Token.findOne({
        where: {
          user_id: user_id,
          token_type: token_type,
        },
      });
      if (!Access_Token) {
        res.sendStatus(401);
        return;
      }

      const isoExpireString = Access_Token.expires_at;
      const expireDate = new Date(isoExpireString);

      if (expireDate.getTime() - Date.now() < 0) {
        await Access_Token.destroy({ force: true });
        res.sendStatus(401);
        return;
      }
      next();
    } catch (e) {
      next(e);
    }
  }
);

export default AuthorizationRoute;
