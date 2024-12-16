import { SEQUELIZE_DATABASE } from "@db/database";
import Logger from "../logger";

export const InitializeDatabase = async () => {
  try {
    await SEQUELIZE_DATABASE.authenticate();
    Logger.info("Database connection has been established successfully.");
  } catch (db_error) {
    Logger.error("Database error happened: ", db_error);
    process.exit(1);
  }
};
