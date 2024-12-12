enum MyErrorTypes {
  // Default
  UNKNOWN,

  // Authentication Errors
  WRONG_CREDENTIALS = "Username or password is wrong.",
  ACCESS_TOKEN_NOT_FOUND = "Access token not found.",
  REFRESH_TOKEN_NOT_FOUND = "Refresh token not found.",
  USER_NOT_LOGGED_IN = "User is not logged in.",

  // User Errors
  USER_ALREADY_EXISTS = "User already exists.",
  USER_ID_NOT_FOUND = "User id not found.",

  // Permission Errors
  OPERATION_CODE_NOT_FOUND = "Operation code not found.",
  PERMISSION_DENIED = "Permission denied.",
  PERMISSION_ID_REQURIED = "Permission id is required.",
  PERMISSION_NOT_FOUND = "Permission with given id not found.",

  // Role Errors
  ROLE_NAME_REQUIRED = "Role name is required.",
  ROLE_NAME_MUST_BE_UNIQE = "Role name must be unique.",
  ROLE_NOT_FOUND = "Role not found.",
  ROLE_ID_REQURIED = "Role id is required.",
  // Syntax Errors
  BAD_JSON = "Bad JSON",
  UUID_SYNTAX_ERROR = "Invalid id syntax.",

  //General Errors
  ID_IS_REQUIRED = "Id is required.",
}

export default MyErrorTypes;
