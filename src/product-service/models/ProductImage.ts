import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";

export default class ProductImage extends Model<
  InferAttributes<ProductImage>,
  InferCreationAttributes<ProductImage>
> {
  declare id: CreationOptional<string>;
  declare product_id: CreationOptional<string>;
  declare image_url: string;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    paranoid: false,
    timestamps: false,
    tableName: "ProductImageTable",
    schema: "product",
  }
);
