import PasswordBasedAuth from "@/database/models/authentication_types/PasswordBasedAuth";
import User from "@/database/models/User";
import { InferAttributes } from "sequelize";

type UserDefaultAttributes =
  | "firstname"
  | "lastname"
  | "email"
  | "birth_date"
  | "gender"
  | "photo_url";

export type UserCreateOptions = Pick<
  InferAttributes<User>,
  UserDefaultAttributes
>;

export type UserUpdateOptions = Partial<
  Pick<InferAttributes<User>, UserDefaultAttributes>
>;

export type UserPasswordUpdateOptions = Partial<
  Pick<InferAttributes<PasswordBasedAuth>, "username" | "password">
>;
