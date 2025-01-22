import { Response } from "express";
import Logger from "../logger";
import MyResponse from "../response/MyResponse";

export type MyErrorProps = {
  error_code: string;
  description: string;
};

export default class MyError extends Error {
  public error_code: string;
  public description: string;

  constructor(props: MyErrorProps) {
    super(props.description);
    this.description = props.description;
    this.error_code = props.error_code;
    Error.captureStackTrace(this, this.constructor);
  }

  public static createError(props: MyErrorProps): MyError {
    return new MyError(props);
  }

  public static sendError(
    props: MyErrorProps,
    res: Response,
    status_code?: number
  ) {
    res
      .status(status_code || 400)
      .send(MyResponse.createResponse(null, MyError.createError(props)));
  }
  public static sendMyError(
    error: MyError,
    res: Response,
    status_code?: number
  ) {
    res.status(status_code || 400).send(MyResponse.createResponse(null, error));
  }

  public toString() {
    return JSON.stringify(
      {
        error_code: this.error_code,
        description: this.description,
      },
      null,
      3
    );
  }
  public log() {
    Logger.error(
      JSON.stringify(
        {
          error_code: this.error_code,
          description: this.description,
        },
        null,
        3
      )
    );
  }
}
