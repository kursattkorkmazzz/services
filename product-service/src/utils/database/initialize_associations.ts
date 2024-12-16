import { SEQUELIZE_DATABASE } from "@db/database";
import Logger from "@utils/logger";

export default async function DefineAssociation() {
  try {
    // Create Association
    await DatabaseSync();
  } catch (e) {
    Logger.warn(
      "Error happened while model associationing and database synchronizing."
    );
  }
}

async function DatabaseSync() {
  SEQUELIZE_DATABASE.sync({ alter: true });
  Logger.info("Database syncronized successfully.");
}
