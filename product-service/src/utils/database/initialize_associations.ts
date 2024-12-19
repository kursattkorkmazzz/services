import { SEQUELIZE_DATABASE } from "@/database/Database";
import Attribute from "@/database/models/Attribute";
import AttributeValue from "@/database/models/AttributeValueTable";
import Logger from "@/utils/logger";

export default async function DefineAssociation() {
  try {
    // Create Association

    // Association between Attribute and AttributeValue
    Attribute.hasMany(AttributeValue, {
      foreignKey: "attribute_id",
    });
    AttributeValue.belongsTo(Attribute, {
      foreignKey: "attribute_id",
      onDelete: "CASCADE",
    });

    await DatabaseSync();
  } catch (e) {
    Logger.warn(
      "Error happened while model associationing and database synchronizing."
    );
    Logger.error(e);
    process.exit(1);
  }
}

async function DatabaseSync() {
  await SEQUELIZE_DATABASE.sync({ alter: true });
  Logger.info("Database syncronized successfully.");
}
