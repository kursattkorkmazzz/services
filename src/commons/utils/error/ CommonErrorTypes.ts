import MyError from "./MyError";

enum CommonErrorTypes {
  UNKNOWN = "Unknown error.",
  ID_IS_REQUIRED = "Id is required.",

  // Syntax Errors
  BAD_JSON = "Bad JSON",
  UUID_SYNTAX_ERROR = "Invalid id syntax.",

  // Parameter Errors
  BODY_MISSING_FIELD_ERROR = "Some fields at body are missing.",
  PARAM_MISSING_FIELD_ERROR = "Some fields at params are missing.",

  ACCESS_TOKEN_NOT_FOUND = "You have to provide access token in authorization header with bearer.",
  PERMISSON_DENIED = "You don't have permission to access this resource.",
}

export default CommonErrorTypes;

export function CreateError(errorType: keyof typeof CommonErrorTypes): MyError {
  return new MyError({
    error_code: CommonErrorTypes[errorType],
    description: errorType,
  });
}
