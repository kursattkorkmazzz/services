import Attribute from "@/database/models/Attribute";
import Category from "@/database/models/Category";
import { InferAttributes } from "sequelize";

export type CategoryCreateOptions = Omit<InferAttributes<Category>, "id">;
export type CategoryUpdateOptions = Partial<
  Omit<InferAttributes<Category>, "id">
>;
