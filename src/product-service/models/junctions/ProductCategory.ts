import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import Product from "../Product";
import Category from "../Category";

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
    schema: "product",
    paranoid: false,
    timestamps: false,
  }
);
