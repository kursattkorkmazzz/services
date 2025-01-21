import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import Product from "../models/Product";
import Category from "../models/Category";
import Attribute from "../models/Attribute";

export default class CategoryAttribute extends Model<
  InferAttributes<CategoryAttribute>,
  InferCreationAttributes<CategoryAttribute>
> {
  declare category_id: string;
  declare attribute_id: string;
}

CategoryAttribute.init(
  {
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      references: {
        key: "id",
        model: Category,
      },
    },
    attribute_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      references: {
        key: "id",
        model: Attribute,
      },
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "CategoryAttributeTable",
  }
);
