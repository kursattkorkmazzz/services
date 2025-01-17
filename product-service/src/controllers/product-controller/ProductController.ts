import Logger from "@/utils/logger";
import {
  ProductCreateOptions,
  ProductUpdateOptions,
} from "./ProductControllerTypes";
import Product from "@/database/models/Product";
import Category from "@/database/models/Category";
import CategoryController from "../categrory-controller/CategoryController";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";

export default class ProductController {
  public static async CreateProduct(
    options: ProductCreateOptions
  ): Promise<Product> {
    try {
      // Create new product.
      const newProduct = await Product.create(options);
      // If category_id not specified, add default category to product.
      await CategoryController.AttachCategoryToProduct(
        CategoryController.defaultCategory,
        newProduct.id
      );

      await newProduct.reload({
        include: {
          model: Category,
          association: "categories",
          through: { attributes: [] },
        },
      });
      return newProduct;
    } catch (e) {
      throw e;
    }
  }

  public static async GetProductById(product_id: string): Promise<Product> {
    try {
      // Create new product.
      const product = await ProductController.isProductExist(product_id);
      if (!product) {
        throw MyError.createError(MyErrorTypes.PRODUCT_NOT_FOUND);
      }

      await product.reload({
        include: {
          model: Category,
          association: "categories",
          through: { attributes: [] },
        },
      });
      return product;
    } catch (e) {
      throw e;
    }
  }

  public static async GetProductList(
    page?: number,
    limit?: number
  ): Promise<{ productList: Product[]; totalCount: number }> {
    try {
      const Paginagiton: any = {};
      if (limit && page) {
        Paginagiton["offset"] = (page - 1) * limit;
        Paginagiton["limit"] = limit;
      }

      const products = await Product.findAll({
        ...Paginagiton,
        include: {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      });

      const totalProductCount = await Product.count();
      return {
        productList: products,
        totalCount: totalProductCount,
      };
    } catch (e) {
      throw e;
    }
  }

  public static async DeleteProductById(product_id: string): Promise<void> {
    try {
      // Create new product.
      const product = await ProductController.isProductExist(product_id);
      if (!product) {
        throw MyError.createError(MyErrorTypes.PRODUCT_NOT_FOUND);
      }
      return await product.destroy({ force: true });
    } catch (e) {
      throw e;
    }
  }

  public static async UpdateProductById(
    product_id: string,
    new_values: ProductUpdateOptions
  ): Promise<Product> {
    try {
      // Create new product.
      const product = await ProductController.isProductExist(product_id);
      if (!product) {
        throw MyError.createError(MyErrorTypes.PRODUCT_NOT_FOUND);
      }

      await product.update(new_values);
      await product.reload({
        include: {
          model: Category,
          association: "categories",
          through: { attributes: [] },
        },
      });

      return product;
    } catch (e) {
      throw e;
    }
  }

  public static async isProductExist(
    product_id: string
  ): Promise<Product | null> {
    try {
      return await Product.findByPk(product_id);
    } catch (e) {
      throw e;
    }
  }
}
