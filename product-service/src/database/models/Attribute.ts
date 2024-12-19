import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import AttributeValue from "./AttributeValueTable";

export default class Attribute extends Model<
  InferAttributes<Attribute>,
  InferCreationAttributes<Attribute>
> {
  declare id: string | null;
  declare name: string;

  declare getAttributeValues: HasManyGetAssociationsMixin<AttributeValue>;
  declare createAttributeValue: HasManyCreateAssociationMixin<AttributeValue>;
}

Attribute.init(
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
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "AttributeTable",
  }
);
