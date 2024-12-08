import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import Role from "./Role";

export default class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  declare id: string;
  declare code: string;
  declare name: string | null;
  declare description: string | null;

  declare getRoles: BelongsToManyGetAssociationsMixin<Role>;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "PermissionTable",
    schema: "authentication",
  }
);
