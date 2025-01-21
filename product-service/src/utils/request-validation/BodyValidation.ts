import Z, { ZodError } from "Zod";
import { NextFunction, Request, Response } from "express";
import MyResponse from "../response/MyResponse";
export default function BodyValidation(schema: Z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${(
            issue.message as String
          ).toLowerCase()}`,
        }));
        res
          .status(400)
          .send(MyResponse.createResponse(null, errorMessages[0].message));
        return;
      }

      next(error);
    }
  };
}
