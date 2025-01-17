import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  CreationOptional,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import Category from "./Category";

export default class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare base_price: number;
  declare description: string | null;
  declare image_urls: string[] | null;
  declare addCategory: BelongsToManyAddAssociationMixin<Category, string>;
  declare getCategories: BelongsToManyGetAssociationsMixin<Category>;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    base_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: null,
      allowNull: true,
    },
    image_urls: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    paranoid: false,
    tableName: "ProductTable",
  }
);
