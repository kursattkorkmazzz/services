import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { SEQUELIZE_DATABASE } from "../Database";

export default class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare token: string;
  declare token_type: "access" | "refresh";
  declare expires_at: Date;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Token.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token_type: {
      type: DataTypes.ENUM("access", "refresh"),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize: SEQUELIZE_DATABASE,
    paranoid: false,
    tableName: "TokenTable",
  }
);
