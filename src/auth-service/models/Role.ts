import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import Permission from "./Permission";

export default class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  declare id: string | null;
  declare name: string;
  declare description: string | null;

  declare getPermissions: BelongsToManyGetAssociationsMixin<Permission>;
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
      allowNull: false,
      unique: true,
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
