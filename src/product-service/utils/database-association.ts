import Logger from "@/commons/utils/logger";
import Attribute from "../models/Attribute";
import Category from "../models/Category";
import CategoryAttribute from "../models/junctions/CategoryAttribute";
import ProductCategory from "../models/junctions/ProductCategory";
import Product from "../models/Product";
import ProductImage from "../models/ProductImage";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";

export default async function ProductServiceDefineAssociation() {
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
  Logger.info("Product service models syncronized successfully.");
}
