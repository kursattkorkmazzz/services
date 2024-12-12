import Role from "@/database/models/Role";
import { InferAttributes } from "sequelize";

export type RoleUpdateOptions = Partial<
  Pick<InferAttributes<Role>, "name" | "description">
>;
