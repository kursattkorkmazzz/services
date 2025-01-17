import { SEQUELIZE_DATABASE } from "@/database/Database";
import ProductCategory from "@/database/junctions/ProductCategory";
import Category from "@/database/models/Category";
import Product from "@/database/models/Product";

import Logger from "@/utils/logger";

export default async function DefineAssociation() {
  try {
    // Create Association

    // Product and Category Association
    Product.belongsToMany(Category, {
      through: ProductCategory,
      foreignKey: "product_id",
      as: "categories",
    });
    Category.belongsToMany(Product, {
      through: ProductCategory,
      foreignKey: "category_id",
      as: "products",
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
