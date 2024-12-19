import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  BelongsToGetAssociationMixin,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import Attribute from "./Attribute";

export default class AttributeValue extends Model<
  InferAttributes<AttributeValue>,
  InferCreationAttributes<AttributeValue>
> {
  declare id: string | null;
  declare attribute_id: string;
  declare value: string;
  declare priceEffect: number | 0;

  declare getAttribute: BelongsToGetAssociationMixin<Attribute>;
}

AttributeValue.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    attribute_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priceEffect: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "AttributeValueTable",
  }
);
