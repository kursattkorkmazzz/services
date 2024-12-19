import Attribute from "@/database/models/Attribute";
import AttributeValue from "@/database/models/AttributeValueTable";
import { InferAttributes } from "sequelize";

export type AttributeValueCreateOptions = Pick<
  InferAttributes<AttributeValue>,
  "attribute_id" | "value"
> &
  Partial<Pick<InferAttributes<AttributeValue>, "priceEffect">>; // Optional

export type AttributeValueUpdateOptions = Partial<
  Pick<InferAttributes<AttributeValue>, "priceEffect" | "value">
>;

export type AttributeAndAttributeValuesReturnType = Pick<
  Attribute,
  "id" | "name"
> & {
  attributeValues: AttributeValue[];
};
