import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";

export default class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  declare id: string;
  declare name: string | null;
  declare description: string | null;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    paranoid: false,
    timestamps: false,
    tableName: "RoleTable",
    schema: "authentication",
  }
);
