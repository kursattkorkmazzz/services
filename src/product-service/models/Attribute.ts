import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";

export default class Attribute extends Model<
  InferAttributes<Attribute>,
  InferCreationAttributes<Attribute>
> {
  declare id: CreationOptional<string>;
  declare name: string;
}

Attribute.init(
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
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "AttributeTable",
    schema: "product",
    paranoid: false,
    timestamps: false,
  }
);
