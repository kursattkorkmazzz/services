import jwt from "jsonwebtoken";
import MyError from "./error/MyError";
import Logger from "./logger";

export function jwtSign(payload: object): string {
  if (!process.env.JWT_SECRET_KEY) {
    Logger.error("JWT_SECRET_KEY is not defined in environment file");
    throw MyError.createError("Server error. Please contact the administrator");
  }
  if (!process.env.JWT_ALGORITHM) {
    Logger.error("JWT_ALGORITHM is not defined in environment file");
    throw MyError.createError("Server error. Please contact the administrator");
  }

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
    });

    return token;
  } catch (e) {
    throw e;
  }
}

export function jwtDecode(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    return JSON.parse(JSON.stringify(decoded));
  } catch (e) {
    throw e;
  }
}
