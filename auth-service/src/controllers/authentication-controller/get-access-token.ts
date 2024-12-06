import MyError from "@/utils/error/MyError";
import { jwtDecode } from "@/utils/jwt";
import Logger from "@/utils/logger";
import { CreateAccessToken } from "./create-token";

export default async function GetNewAccessToken(
  refresh_token: string
): Promise<string> {
  try {
    const decoded_token = jwtDecode(refresh_token);

    const { user_id, token_type } = JSON.parse(JSON.stringify(decoded_token));

    if (token_type !== "refresh") {
      throw MyError.createError("You must provide refresh token.");
    }

    const new_access_token = await CreateAccessToken(user_id);

    return new_access_token;
  } catch (e) {
    throw e;
  }
}
