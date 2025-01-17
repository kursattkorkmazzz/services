import Category from "@/database/models/Category";
import ProductController from "../product-controller/ProductController";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import ProductCategory from "@/database/junctions/ProductCategory";

export default class CategoryController {
  static defaultCategory: string = "88be3acc-7573-491e-8a71-10b104769c6c";

  public static async AttachCategoryToProduct(
    category_id: string,
    product_id: string
  ): Promise<ProductCategory> {
    try {
      const isCategoryExist = await this.isCategoryExist(category_id);
      const isProductExist = await ProductController.isProductExist(product_id);
      if (!isCategoryExist) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }
      if (!isProductExist) {
        throw MyError.createError(MyErrorTypes.PRODUCT_NOT_FOUND);
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
  public static async isCategoryExist(
    category_id: string
  ): Promise<Category | null> {
    try {
      return await Category.findByPk(category_id);
    } catch (e) {
      throw e;
    }
  }

  public static async AttachDefaultCategoryToProduct(product_id: string) {
    try {
      const isProductExist = await ProductController.isProductExist(product_id);
      if (!isProductExist) {
        throw MyError.createError(MyErrorTypes.PRODUCT_NOT_FOUND);
      }
      const productCategory = await ProductCategory.create({
        category_id: this.defaultCategory,
        product_id: isProductExist.id,
      });

      return productCategory;
    } catch (e) {
      throw e;
    }
  }
}
