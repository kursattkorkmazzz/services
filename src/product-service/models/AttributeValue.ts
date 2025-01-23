import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";

import Attribute from "./Attribute";
import Product from "./Product";

export default class AttributeValue extends Model<
  InferAttributes<AttributeValue>,
  InferCreationAttributes<AttributeValue>
> {
  declare id: CreationOptional<string>;
  declare attribute_id: string;
  declare product_id: string;
  declare value: string;
  declare price_effect: number | null;
}

AttributeValue.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    attribute_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Attribute,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price_effect: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "AttributeValueTable",
    schema: "product",
    paranoid: false,
    timestamps: false,
  }
);
