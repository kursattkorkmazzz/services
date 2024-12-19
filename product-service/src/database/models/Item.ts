import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";

export default class Item extends Model<
  InferAttributes<Item>,
  InferCreationAttributes<Item>
> {
  declare id: string | null;
  declare name: string;
  declare base_price: number | null;
  declare description: string | null;
  declare image_urls: string[] | null;
}

Item.init(
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
    tableName: "ItemTable",
  }
);
