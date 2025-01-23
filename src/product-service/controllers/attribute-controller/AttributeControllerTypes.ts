import Attribute from "@/product-service/models/Attribute";
import { InferAttributes } from "sequelize";

export type AttributeCreateOptions = Omit<InferAttributes<Attribute>, "id">;
export type AttributeUpdateOptions = Partial<
  Omit<InferAttributes<Attribute>, "id">
>;
