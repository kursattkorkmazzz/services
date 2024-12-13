import AuthorizationController from "@/controllers/AuthorizationController";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyResponse from "@/utils/response/MyResponse";
import express, { NextFunction, Request, Response } from "express";

const AuthorizationRoute = express.Router();

AuthorizationRoute.post(
  "/check-permission",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, operation_code } = req.body;

      if (!user_id) {
        res
          .status(400)
          .json(
            MyResponse.createResponse(
              null,
              MyError.createError(MyErrorTypes.USER_ID_NOT_FOUND).toString()
            )
          );
        return;
      }
      if (!operation_code) {
        res
          .status(400)
          .json(
            MyResponse.createResponse(
              null,
              MyError.createError(
                MyErrorTypes.OPERATION_CODE_NOT_FOUND
              ).toString()
            )
          );
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
