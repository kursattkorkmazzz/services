import PasswordBasedAuth from "@/database/models/authentication_types/PasswordBasedAuth";
import User from "@/database/models/User";
import MyError from "@/utils/error/MyError";
import { UniqueConstraintError, ValidationError } from "sequelize";

export type CreateUserDataType = {
  firstname: string;
  lastname: string;
  email: string;
  birth_date?: Date;
  gender: "male" | "female" | "unknown";
  photo_url?: string;

  username: string;
  password: string;
};

export default async function CreateUser(
  data: Partial<CreateUserDataType>
): Promise<User> {
  let newUser: User;
  let passwordAuth: PasswordBasedAuth;

  try {
    newUser = await User.create({
      firstname: data.firstname!,
      lastname: data.lastname!,
      email: data.email!,
      birth_date: data.birth_date,
      gender: data.gender || "unknown",
      photo_url: data.photo_url,
      is_email_verified: false,
      is_system_user: false,
    });

    try {
      passwordAuth = await PasswordBasedAuth.create({
        username: data.username!,
        password: data.password!,
        user_id: newUser.id,
      });
    } catch (e: any) {
      await newUser.destroy({ force: true });
      if (e instanceof ValidationError) {
        throw MyError.createError(e.errors[0].message);
      }
      throw e;
    }

    return newUser;
  } catch (e: any) {
    if (e instanceof UniqueConstraintError) {
      throw MyError.createError(e.errors[0].message);
    }
    throw e;
  }
}
