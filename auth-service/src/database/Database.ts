import Logger from "@/utils/logger";
import { Sequelize } from "sequelize";

export const SEQUELIZE_DATABASE = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(String(process.env.DB_PORT)) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  schema: process.env.DB_SCHEMA,
  logging: false,
  define: {
    paranoid: true,
    timestamps: true,
    createdAt: "created_at",
    deletedAt: "deleted_at",
    updatedAt: "updated_at",
    underscored: true,
    charset: "utf8",
  },
});
