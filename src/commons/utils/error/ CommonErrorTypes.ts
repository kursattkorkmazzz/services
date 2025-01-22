import Logger from "../logger";
import { MyErrorProps } from "./MyError";

enum CommonErrorTypes {
  UNKNOWN = "Unknown error.",
  ID_IS_REQUIRED = "Id is required.",

  // Syntax Errors
  BAD_JSON = "Bad JSON",
  UUID_SYNTAX_ERROR = "Invalid id syntax.",
}

export default CommonErrorTypes;
