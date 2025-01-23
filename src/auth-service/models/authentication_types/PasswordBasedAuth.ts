import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  BelongsToGetAssociationMixin,
  CreationOptional,
} from "sequelize";
import User from "../User";
import PasswordHash from "@/auth-service/utils/encryption";

export default class PasswordBasedAuth extends Model<
  InferAttributes<PasswordBasedAuth>,
  InferCreationAttributes<PasswordBasedAuth>
> {
  declare id: CreationOptional<string>;
  declare user_id: CreationOptional<string>;
  declare username: string;
  declare password: string;
  declare last_login: CreationOptional<Date>;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare getUser: BelongsToGetAssociationMixin<User>;
}

PasswordBasedAuth.init(
  {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [5, 20],
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true,
      },
      set(value: string) {
        this.setDataValue("password", PasswordHash(value));
      },
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    tableName: "PasswordBasedAuthTable",
    paranoid: false,
    schema: "authentication",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: false,
  }
);
