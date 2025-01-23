import Product from "@/product-service/models/Product";
import { InferAttributes } from "sequelize";

export type ProductCreateOptions = Omit<InferAttributes<Product>, "id">;

export type ProductUpdateOptions = Partial<
  Omit<InferAttributes<Product>, "id">
>;
