import { SEQUELIZE_DATABASE } from "@/database/Database";
import Logger from "../logger";
import { ConnectionError } from "sequelize";

export const InitializeDatabase = async () => {
  try {
    await SEQUELIZE_DATABASE.authenticate();
    Logger.info("Database connection has been established successfully.");
  } catch (db_error) {
    if (db_error instanceof ConnectionError) {
      Logger.error("Database connection failed.");
      console.log(db_error);

      process.exit(1);
    }
    Logger.error("Database error happened: ", db_error);
    process.exit(1);
  }
};
