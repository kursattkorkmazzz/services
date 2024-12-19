import { SEQUELIZE_DATABASE } from "@/database/Database";
import Attribute from "@/database/models/Attribute";
import AttributeValue from "@/database/models/AttributeValueTable";
import Item from "@/database/models/Item";
import ItemAttribute from "@/database/models/ItemAttribute";
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

    // Association between Item and Attribute
    Item.belongsToMany(Attribute, {
      through: ItemAttribute,
      foreignKey: "item_id",
      timestamps: false,
    });
    Attribute.belongsToMany(Item, {
      through: ItemAttribute,
      foreignKey: "attribute_id",
      timestamps: false,
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
