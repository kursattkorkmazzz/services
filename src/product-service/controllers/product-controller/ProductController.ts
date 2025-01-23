import {
  ProductCreateOptions,
  ProductUpdateOptions,
} from "./ProductControllerTypes";
import Product from "@/product-service/models/Product";
import Category from "@/product-service/models/Category";
import CategoryController from "../categrory-controller/CategoryController";

import ProductCategory from "@/product-service/models/junctions/ProductCategory";
import GetRowsByPagination from "@/product-service/utils/get-rows-by-pagination";
import ProductImage from "@/product-service/models/ProductImage";
import { SEQUELIZE_DATABASE } from "@/commons/database/Database";
import CreateError from "@/product-service/utils/product-error-types";

export default class ProductController {
  public static async CreateProduct(
    options: ProductCreateOptions
  ): Promise<Product> {
    try {
      // Create new product.
      const newProduct = await Product.create(options);
      // If category_id not specified, add default category to product.
      await this.AttachCategoryToProduct(
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
        throw CreateError("PRODUCT_NOT_FOUND");
      }

      await product.reload({
        include: [
          {
            model: Category,
            association: "categories",
            through: { attributes: [] },
          },
          {
            model: ProductCategory,
            association: "images",
          },
        ],
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
      const result = await GetRowsByPagination(Product, page, limit, {
        include: {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      });

      return {
        productList: result.list,
        totalCount: result.totalCount,
      };
    } catch (e) {
      throw e;
    }
  }
  public static async GetProductListByCategory(
    category_id?: string,
    page?: number,
    limit?: number
  ): Promise<{ productList: Product[]; totalCount: number }> {
    try {
      // Pagination filtering.
      const result = await GetRowsByPagination(Product, page, limit, {
        include: {
          model: Category,
          as: "categories",
          through: { attributes: [] },
          where: {
            id: category_id,
          },
        },
      });
      return {
        productList: result.list,
        totalCount: result.totalCount,
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
        throw CreateError("PRODUCT_NOT_FOUND");
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
        throw CreateError("PRODUCT_NOT_FOUND");
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
  public static async AttachCategoryToProduct(
    category_id: string,
    product_id: string
  ): Promise<ProductCategory> {
    try {
      const isCategoryExist = await CategoryController.isCategoryExist(
        category_id
      );
      const isProductExist = await ProductController.isProductExist(product_id);
      if (!isCategoryExist) {
        throw CreateError("CATEGORY_NOT_FOUND");
      }
      if (!isProductExist) {
        throw CreateError("PRODUCT_NOT_FOUND");
      }

      const productCategory = await ProductCategory.create({
        category_id: isCategoryExist.id,
        product_id: isProductExist.id,
      });

      return productCategory;
    } catch (e) {
      throw e;
    }
  }
  public static async DetachCategoryFromProduct(
    category_id: string,
    product_id: string
  ): Promise<number> {
    try {
      if (CategoryController.defaultCategory === category_id) {
        throw CreateError("DEFAULT_CATEGORY_CANNOT_DELETE");
      }
      const isCategoryExist = await CategoryController.isCategoryExist(
        category_id
      );
      const isProductExist = await ProductController.isProductExist(product_id);
      if (!isCategoryExist) {
        throw CreateError("CATEGORY_NOT_FOUND");
      }
      if (!isProductExist) {
        throw CreateError("PRODUCT_NOT_FOUND");
      }

      const deletedPCcount = await ProductCategory.destroy({
        where: {
          category_id: isCategoryExist.id,
          product_id: isProductExist.id,
        },
      });
      return deletedPCcount;
    } catch (e) {
      throw e;
    }
  }
  public static async AttachDefaultCategoryToProduct(product_id: string) {
    try {
      const isProductExist = await ProductController.isProductExist(product_id);
      if (!isProductExist) {
        throw CreateError("PRODUCT_NOT_FOUND");
      }
      const productCategory = await ProductCategory.create({
        category_id: CategoryController.defaultCategory,
        product_id: isProductExist.id,
      });

      return productCategory;
    } catch (e) {
      throw e;
    }
  }
  public static async AddImageToProduct(
    product_id: string,
    image_url: string
  ): Promise<ProductImage> {
    try {
      const product = await this.isProductExist(product_id);
      if (!product) {
        throw CreateError("PRODUCT_NOT_FOUND");
      }

      const productImage = await ProductImage.create({
        product_id: product.id,
        image_url,
      });

      return productImage;
    } catch (e) {
      throw e;
    }
  }
  public static async RemoveImageFromProduct(image_id: string): Promise<void> {
    try {
      const productImage = await ProductImage.findByPk(image_id);
      if (!productImage) {
        throw CreateError("IMAGE_NOT_FOUND");
      }
      await productImage.destroy();
    } catch (e) {
      throw e;
    }
  }
}
