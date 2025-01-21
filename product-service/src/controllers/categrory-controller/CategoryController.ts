import Category from "@/database/models/Category";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import {
  CategoryCreateOptions,
  CategoryUpdateOptions,
} from "./CategoryControllerTypes";
import { InferAttributes } from "sequelize";

export default class CategoryController {
  static defaultCategory: string = "88be3acc-7573-491e-8a71-10b104769c6c";

  public static async CreateCategory(
    options: CategoryCreateOptions
  ): Promise<Category> {
    try {
      // Create new product.
      const newCategory = await Category.create(options);

      await newCategory.reload({
        include: {
          model: Category,
          association: "parent_category",
        },
      });
      return newCategory;
    } catch (e) {
      throw e;
    }
  }
  public static async GetCategoryById(category_id: string): Promise<Category> {
    try {
      // Create new category.
      const category = await CategoryController.isCategoryExist(category_id);
      if (!category) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }

      await category.reload({
        include: {
          model: Category,
          association: "parent_category",
        },
      });
      return category;
    } catch (e) {
      throw e;
    }
  }
  public static async GetCategoryList(
    page?: number,
    limit?: number
  ): Promise<{ categoryList: Category[]; totalCount: number }> {
    try {
      const Paginagiton: any = {};
      if (limit && page) {
        Paginagiton["offset"] = (page - 1) * limit;
        Paginagiton["limit"] = limit;
      }

      const categories = await Category.findAll({
        ...Paginagiton,
        include: {
          model: Category,
          as: "parent_category",
        },
        attributes: { exclude: ["parent_category_id"] },
      });

      const totalCategoryCount = await Category.count();
      return {
        categoryList: categories,
        totalCount: totalCategoryCount,
      };
    } catch (e) {
      throw e;
    }
  }
  public static async DeleteCategoryById(category_id: string): Promise<void> {
    try {
      // Create new product.
      if (this.defaultCategory === category_id) {
        throw MyError.createError(MyErrorTypes.DEFAULT_CATEGORY_CANNOT_DELETE);
      }
      const category = await CategoryController.isCategoryExist(category_id);
      if (!category) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }
      return await category.destroy({ force: true });
    } catch (e) {
      throw e;
    }
  }
  public static async UpdateCategoryById(
    category_id: string,
    new_values: CategoryUpdateOptions
  ): Promise<Category> {
    try {
      // Create new category.
      const category = await CategoryController.isCategoryExist(category_id);
      if (!category) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }

      await category.update(new_values);
      await category.reload({
        include: {
          model: Category,
          association: "parent_category",
        },
      });

      return category;
    } catch (e) {
      throw e;
    }
  }

  public static async GetCategoryTree(category_id: string): Promise<
    InferAttributes<Category> & {
      child_categories: InferAttributes<Category>[];
    }
  > {
    try {
      const rootCategory = await Category.findByPk(category_id, {
        include: {
          model: Category,
          as: "child_categories",
        },
      });
      if (!rootCategory) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }

      const childrens = await Promise.all(
        rootCategory.child_categories.map(async (child) => {
          return await CategoryController.GetCategoryTree(child.id);
        })
      );

      return {
        id: rootCategory.id,
        name: rootCategory.name,
        parent_category_id: rootCategory.parent_category_id,
        child_categories: childrens,
      };
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
}
