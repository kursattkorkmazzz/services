import MyError from "../error/MyError";

export default class MyResponse {
  private error: MyError | null;
  private data: any | null;

  constructor(data?: any | null, error?: MyError | null) {
    this.error = error ? error : null;
    this.data = data ? data : null;
  }

  public static createResponse(data?: any, error?: MyError): MyResponse {
    if (error) {
      return new MyResponse(null, error);
    }
    return new MyResponse(data, null);
  }

  public static createSuccessResponse(): MyResponse {
    return MyResponse.createResponse("Success");
  }
  public static createFailResponse(): MyResponse {
    return MyResponse.createResponse(
      undefined,
      MyError.createError({
        error_code: "UNKOWN",
        description: "Failed",
      })
    );
  }
}
