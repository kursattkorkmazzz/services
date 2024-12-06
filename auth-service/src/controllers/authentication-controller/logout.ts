import Token from "@/database/models/Token";

export default async function Logout(user_id: string) {
  try {
    const access_token_list = await Token.findAll({
      where: {
        user_id: user_id,
      },
    });

    Promise.all(
      access_token_list.map(async (token) => {
        await token.destroy({ force: true });
      })
    );
  } catch (e) {
    throw e;
  }
}
