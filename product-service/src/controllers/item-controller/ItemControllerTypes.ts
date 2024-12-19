import Attribute from "@/database/models/Attribute";
import AttributeValue from "@/database/models/AttributeValueTable";
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

export type AttributeAndValueReturnType = InferAttributes<Attribute> & {
  values: AttributeValue[];
};
export type ItemAttributeAndValueReturnType = InferAttributes<Item> & {
  attributes: AttributeAndValueReturnType[];
};

export type AttributeCreateOptions = Pick<InferAttributes<Attribute>, "name">;

export type AttributeValueCreateOptions = Pick<
  InferAttributes<AttributeValue>,
  "attribute_id" | "value"
> &
  Partial<Pick<InferAttributes<AttributeValue>, "priceEffect">>;

export type AttributeUpdateOptions = Partial<
  Pick<InferAttributes<Attribute>, "name">
>;

export type AttributeValueUpdateOptions = Partial<
  Pick<InferAttributes<AttributeValue>, "priceEffect" | "value">
>;
