enum MyErrorTypes {
  UNKNOWN,
  WRONG_CREDENTIALS = "Username or password is wrong.",
  USER_ALREADY_EXISTS = "User already exists.",
  ACCESS_TOKEN_NOT_FOUND = "Access token not found.",
  REFRESH_TOKEN_NOT_FOUND = "Refresh token not found.",

  BAD_JSON = "Bad JSON",

  USER_ID_NOT_FOUND = "User id not found.",
  OPERATION_CODE_NOT_FOUND = "Operation code not found.",
}

export default MyErrorTypes;
