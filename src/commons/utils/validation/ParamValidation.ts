import Z, { ZodError } from "Zod";
import { NextFunction, Request, Response } from "express";
import MyResponse from "../response/MyResponse";
import MyError from "../error/MyError";
import CreateError from "@/product-service/utils/product-error-types";

export default function ParamValidation(schema: Z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${(
            issue.message as String
          ).toLowerCase()}`,
        }));
        MyError.sendError(
          {
            error_code: "PARAM_MISSING_FIELD_ERROR",
            description: errorMessages[0].message,
          },
          res,
          400
        );
        return;
      }

      next(error);
    }
  };
}
