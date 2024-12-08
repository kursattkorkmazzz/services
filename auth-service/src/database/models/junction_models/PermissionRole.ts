import { SEQUELIZE_DATABASE } from "@/database/Database";
import { DataTypes, Model } from "sequelize";

export default class PermissionRole extends Model {}

PermissionRole.init(
  {
    permission_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: false,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: false,
      allowNull: false,
    },
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    paranoid: false,
    timestamps: false,
    tableName: "PermissionRoleTable",
    schema: "authentication",
  }
);
