import { Response } from "express";
import MyError from "./error/MyError";
import MyResponse from "./response/MyResponse";
import MyErrorTypes from "./error/MyErrorTypes";

export default function sendError(
  errorType: MyErrorTypes,
  res: Response,
  statusCode: number
) {
  res
    .status(statusCode)
    .send(
      MyResponse.createResponse(null, MyError.createError(errorType).toString())
    );
}
