import Logger from "../logger";

export default class MyError extends Error {
  public message: any;
  public name: string;
  public sendWithResponse: boolean = true;
  constructor(message: string, name?: string) {
    super(message);
    this.message = message;
    this.name = name || this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  private static createErrorWithMessage(
    message: string,
    name?: string
  ): MyError {
    return new MyError(message, name);
  }

  private static createErrorWithErrorObject(error: Error): MyError {
    return new MyError(error.message, error.name);
  }

  static createError(error: Error | string, name?: string): MyError {
    if (typeof error === "string") {
      return this.createErrorWithMessage(error, name);
    } else {
      return this.createErrorWithErrorObject(error);
    }
  }

  log() {
    Logger.error(this.message);
  }
}
