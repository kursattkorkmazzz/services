import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import Product from "../models/Product";
import Category from "../models/Category";

export default class ProductCategory extends Model<
  InferAttributes<ProductCategory>,
  InferCreationAttributes<ProductCategory>
> {
  declare category_id: string;
  declare product_id: string;
}

ProductCategory.init(
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
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      references: {
        key: "id",
        model: Product,
      },
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "ProductCategoryTable",
  }
);
