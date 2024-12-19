import Attribute from "@/database/models/Attribute";
import AttributeValue from "@/database/models/AttributeValueTable";
import { InferAttributes } from "sequelize";

// Attribute Create Options
export type AttributeCreateOptions = Pick<
  InferAttributes<Attribute>,
  "name"
> & { value: string; priceEffect: number | null };

// Attribute Update Options
export type AttributeUpdateOptions = Partial<
  Pick<InferAttributes<Attribute>, "name">
>;
