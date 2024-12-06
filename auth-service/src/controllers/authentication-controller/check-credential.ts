import PasswordBasedAuth from "@/database/models/authentication_types/PasswordBasedAuth";
import User from "@/database/models/User";
import PasswordHash from "@/utils/encryption";
import MyError from "@/utils/error/MyError";

export default async function CheckCredential(
  username: string,
  password: string
): Promise<PasswordBasedAuth> {
  try {
    const passwordBasedAuth: PasswordBasedAuth | null =
      await PasswordBasedAuth.findOne({
        where: {
          username: username,
          password: PasswordHash(password),
        },
      });
    if (!passwordBasedAuth) {
      throw MyError.createError("Username or password is incorrect");
    }
    return passwordBasedAuth;
  } catch (e) {
    throw e;
  }
}
