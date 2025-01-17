import { SEQUELIZE_DATABASE } from "@/database/Database";
import { DataTypes, Model } from "sequelize";

export default class UserRole extends Model {
  declare role_id?: string;
  declare user_id?: string;
}

UserRole.init(
  {
    user_id: {
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
    tableName: "UserRoleTable",
  }
);
