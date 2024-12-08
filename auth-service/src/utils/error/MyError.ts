import Logger from "../logger";
import MyErrorTypes from "./MyErrorTypes";

export default class MyError extends Error {
  public errorType: MyErrorTypes;
  public message: any;

  constructor(errorType?: MyErrorTypes, message?: string) {
    super(message);
    this.message = message || "";
    this.errorType = errorType || MyErrorTypes.UNKNOWN;
    Error.captureStackTrace(this, this.constructor);
  }

  private static createErrorWithMessage(
    message?: string,
    errorType?: MyErrorTypes
  ): MyError {
    return new MyError(errorType, message);
  }

  private static createErrorWithErrorObject(
    error: Error,
    errorType?: MyErrorTypes
  ): MyError {
    return new MyError(errorType || MyErrorTypes.UNKNOWN, error.message);
  }

  static createError(errorType: MyErrorTypes, error?: Error | string): MyError {
    if (typeof error === "string") {
      return this.createErrorWithMessage(error, errorType);
    } else if (error instanceof Error) {
      return this.createErrorWithErrorObject(error, errorType);
    } else if (errorType) {
      return this.createErrorWithMessage(errorType.toString(), errorType);
    }

    return this.createErrorWithMessage("Unknown error", MyErrorTypes.UNKNOWN);
  }

  public toString() {
    return this.errorType.toString() || this.message;
  }
  log() {
    Logger.error(this.message);
  }
}
