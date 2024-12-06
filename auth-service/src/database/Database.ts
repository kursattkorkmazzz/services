import { Sequelize } from "sequelize";

export const SEQUELIZE_DATABASE = new Sequelize({
  dialect: "sqlite",
  storage: "./sqlite_db/db.sqlite",
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
