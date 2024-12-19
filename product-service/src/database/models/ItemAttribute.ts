import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";

export default class ItemAttribute extends Model<
  InferAttributes<ItemAttribute>,
  InferCreationAttributes<ItemAttribute>
> {
  declare item_id: string;
  declare attribute_id: string;
}

ItemAttribute.init(
  {
    item_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    attribute_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "ItemAttributeTable",
  }
);
