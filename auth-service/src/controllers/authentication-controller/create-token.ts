import Token from "@/database/models/Token";
import { jwtSign } from "@/utils/jwt";
import Logger from "@/utils/logger";

const REFESH_TOKEN_EXP_TIME: number = Number(
  process.env.REFRESH_TOKEN_EXP_TIME_IN_MS
);
const ACCESS_TOKEN_EXP_TIME: number = Number(
  process.env.ACCESS_TOKEN_EXP_TIME_IN_MS
);

export default async function CreateToken(
  user_id: string
): Promise<{ access_token: string; refresh_token: string }> {
  try {
    const access_token = await CreateAccessToken(user_id);
    const refresh_token = await CreateRefreshToken(user_id);
    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  } catch (e) {
    throw e;
  }
}

export async function CreateAccessToken(user_id: string): Promise<string> {
  await Token.destroy({
    where: {
      user_id: user_id,
      token_type: "access",
    },
    force: true,
  });

  const access_token = jwtSign({
    user_id: user_id,
    token_type: "access",
  });

  await Token.create({
    token: access_token,
    token_type: "access",
    expires_at: new Date(Date.now() + ACCESS_TOKEN_EXP_TIME), // 1 saat geçerli refresh token.
    user_id: user_id,
  });

  return access_token;
}

export async function CreateRefreshToken(user_id: string): Promise<string> {
  await Token.destroy({
    where: {
      user_id: user_id,
      token_type: "refresh",
    },
    force: true,
  });

  const refresh_token = jwtSign({
    user_id: user_id,
    token_type: "refresh",
  });

  await Token.create({
    token: refresh_token,
    token_type: "refresh",
    expires_at: new Date(Date.now() + REFESH_TOKEN_EXP_TIME), // 24 saat geçerli refresh token.
    user_id: user_id,
  });

  return refresh_token;
}
