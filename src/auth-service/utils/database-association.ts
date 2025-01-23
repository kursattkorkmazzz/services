import PasswordBasedAuth from "../models/authentication_types/PasswordBasedAuth";
import Permission from "../models/Permission";
import Role from "../models/Role";
import Token from "../models/Token";
import User from "../models/User";
import Logger from "@/commons/utils/logger";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import PermissionRole from "../models/junction_models/PermissionRole";
import UserRole from "../models/junction_models/UserRole";

export default async function AuthenticationServiceDefineAssociation() {
  try {
    // User has one PasswordBasedAuth
    // PasswordBasedAuth belongs to User
    User.hasOne(PasswordBasedAuth);
    PasswordBasedAuth.belongsTo(User, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // User has many Token.
    // Token belongs to one User
    User.hasOne(Token);
    Token.belongsTo(User, {
      foreignKey: {
        field: "user_id",
        allowNull: false,
      },
    });

    // Role has many User
    // Permission has many Role
    Permission.belongsToMany(Role, {
      through: PermissionRole,
      foreignKey: "permission_id",
      timestamps: false,
    });
    Role.belongsToMany(Permission, {
      through: PermissionRole,
      foreignKey: "role_id",
      timestamps: false,
    });

    // User has many Role
    // Role has many User
    User.belongsToMany(Role, {
      through: UserRole,
      foreignKey: "user_id",
      timestamps: false,
    });
    Role.belongsToMany(User, {
      through: UserRole,
      foreignKey: "role_id",
      timestamps: false,
    });

    await DatabaseSync();
  } catch (e: any) {
    Logger.warn(
      "Error happened while model associationing and database synchronizing."
    );
    Logger.error(e.message);
  }
}

async function DatabaseSync() {
  await SEQUELIZE_DATABASE.sync({ alter: true });
  Logger.info("Authentication service models syncronized successfully.");
}
