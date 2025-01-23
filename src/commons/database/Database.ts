import Logger from "../utils/logger";
import { ConnectionError, Sequelize } from "sequelize";

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
    underscored: true,
    charset: "utf8",
  },
});

export const InitializeDatabase = async () => {
  try {
    await SEQUELIZE_DATABASE.authenticate();
    Logger.info("Database connection has been established successfully.");
  } catch (db_error) {
    if (db_error instanceof ConnectionError) {
      Logger.error("Database connection failed.");
      Logger.error(db_error);
      process.exit(1);
    }
    Logger.error("Database error happened: ", db_error);
    process.exit(1);
  }
};

// Check connection after initialized...
SEQUELIZE_DATABASE.addHook(
  "afterInit",
  "check-connection",
  async (seq: Sequelize) => {
    Logger.info("Database connection is establishing...");
    await InitializeDatabase();
  }
);
