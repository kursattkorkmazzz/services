import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  CreationOptional,
  HasOneGetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";
import PasswordBasedAuth from "./authentication_types/PasswordBasedAuth";
import Token from "./Token";
import Role from "./Role";

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare birth_date: Date | null;
  declare gender: "male" | "female" | "unknown" | null;
  declare photo_url: string | null;
  declare is_email_verified: boolean | null;
  declare is_system_user: boolean | null;
  declare created_at: Date | null;
  declare updated_at: Date | null;
  declare deleted_at: Date | null;

  declare getPasswordBasedAuth: HasOneGetAssociationMixin<PasswordBasedAuth>;
  declare getToken: HasOneGetAssociationMixin<Token>;
  declare getRoles: BelongsToManyGetAssociationsMixin<Role>;
  declare hasRole: BelongsToManyHasAssociationMixin<Role, string>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "unknown"),
      allowNull: false,
      defaultValue: "unknown",
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_system_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    paranoid: true,
    tableName: "UserTable",
    schema: "authentication",
  }
);
