enum MyErrorTypes {
  // Default
  UNKNOWN,

  // Authentication Errors
  WRONG_CREDENTIALS = "Username or password is wrong.",
  ACCESS_TOKEN_NOT_FOUND = "Access token not found.",
  REFRESH_TOKEN_NOT_FOUND = "Refresh token not found.",
  USER_NOT_LOGGED_IN = "User is not logged in.",
  TOKEN_EXPIRED = "Token expired.",

  // User Errors
  USER_ALREADY_EXISTS = "User already exists.",
  USER_ID_NOT_FOUND = "User id not found.",
  USER_NOT_FOUND = "User not found.",
  FIRSTNAME_REQUIRED = "Firstname is required.",
  LASTNAME_REQUIRED = "Lastname is required.",
  EMAIL_REQUIRED = "Email is required.",
  EMAIL_ALREADY_EXIST = "Email already exist.",
  USERNAME_REQUIRED = "Username is required.",
  PASSWORD_REQUIRED = "Password is required.",
  USERNAME_LENGTH = "Username must be between 5 and 20 characters.",
  USERNAME_ALPHANUMERIC = "Username can be just alpanumeric.",
  USERNAME_ALREADY_EXIST = "Username already exist.",
  CANNOT_DELETE_ADMIN_USER = "Admin user cannot be deletable.",

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
  ROLE_DELETE_RESTRICTION = "This role cannot be delete. It is restricted.",
  ROLE_OF_ADMIN_NOT_CHANGEABLE = "Role of admin user cannot be changed.",

  // Syntax Errors
  BAD_JSON = "Bad JSON",
  UUID_SYNTAX_ERROR = "Invalid id syntax.",

  //General Errors
  ID_IS_REQUIRED = "Id is required.",
}

export default MyErrorTypes;
