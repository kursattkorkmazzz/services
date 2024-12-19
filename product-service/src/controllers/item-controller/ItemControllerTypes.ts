import Item from "@/database/models/Item";
import { InferAttributes } from "sequelize";

export type ItemCreateOptions = Pick<InferAttributes<Item>, "name"> &
  Partial<
    Pick<InferAttributes<Item>, "description" | "base_price" | "image_urls">
  >;

export type ItemUpdateOptions = Partial<
  Pick<
    InferAttributes<Item>,
    "name" | "description" | "base_price" | "image_urls"
  >
>;
