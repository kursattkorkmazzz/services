import { SEQUELIZE_DATABASE } from "@/database/Database";
import CategoryAttribute from "@/database/junctions/CategoryAttribute";
import ProductCategory from "@/database/junctions/ProductCategory";
import Attribute from "@/database/models/Attribute";
import Category from "@/database/models/Category";
import Product from "@/database/models/Product";
import ProductImage from "@/database/models/ProductImage";

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

    // Category Itself Association
    Category.belongsTo(Category, {
      foreignKey: "parent_category_id",
      as: "parent_category",
    });
    Category.hasMany(Category, {
      foreignKey: "parent_category_id",
      as: "child_categories",
    });

    // Product and ProductImage Association
    Product.hasMany(ProductImage, {
      foreignKey: "product_id",
      as: "images",
    });

    // Category and Attribute Association
    Category.belongsToMany(Attribute, {
      through: CategoryAttribute,
      foreignKey: "category_id",
      as: "attributes",
    });
    Attribute.belongsToMany(Category, {
      through: CategoryAttribute,
      foreignKey: "attribute_id",
      as: "categories",
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
