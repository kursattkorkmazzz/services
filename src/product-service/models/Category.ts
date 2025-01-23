import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import Attribute from "./Attribute";

export default class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare parent_category_id: CreationOptional<string>;

  declare addAttribute: BelongsToManyAddAssociationMixin<Attribute, string>;
  declare getAttributes: BelongsToManyGetAssociationsMixin<Attribute>;
  declare removeAttribute: BelongsToManyRemoveAssociationMixin<
    Attribute,
    string
  >;
  declare removeAttributes: BelongsToManyRemoveAssociationsMixin<
    Attribute,
    string
  >;
  declare child_categories: NonAttribute<Category[]>;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parent_category_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "CategoryTable",
    schema: "product",
    paranoid: false,
    timestamps: false,
  }
);
