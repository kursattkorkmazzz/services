import Category from "@/product-service/models/Category";
import { InferAttributes } from "sequelize";

export type CategoryCreateOptions = Omit<InferAttributes<Category>, "id">;
export type CategoryUpdateOptions = Partial<
  Omit<InferAttributes<Category>, "id">
>;
