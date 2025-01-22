import Attribute from "@/database/models/Attribute";

import CategoryController from "../categrory-controller/CategoryController";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import {
  AttributeCreateOptions,
  AttributeUpdateOptions,
} from "./AttributeControllerTypes";
import { SEQUELIZE_DATABASE } from "@/database/Database";

export default class AttributeController {
  public static async CreateAttribute(
    category_id: string,
    new_values: AttributeCreateOptions
  ): Promise<Attribute> {
    const t = await SEQUELIZE_DATABASE.transaction();
    try {
      const category = await CategoryController.isCategoryExist(category_id);
      if (!category) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }
      const newAttribute = await Attribute.create(new_values, {
        transaction: t,
      });
      await category.addAttribute(newAttribute, { transaction: t });
      await t.commit();
      return newAttribute;
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }

  public static async GetAttributesOfCategory(
    category_id: string
  ): Promise<Attribute[]> {
    try {
      const category = await CategoryController.isCategoryExist(category_id);
      if (!category) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }
      const attributes = await category.getAttributes({
        joinTableAttributes: [],
      });
      return attributes;
    } catch (e) {
      throw e;
    }
  }

  public static async DeleteAttributeOfCategory(
    category_id: string,
    attribute_id: string
  ): Promise<void> {
    try {
      const category = await CategoryController.isCategoryExist(category_id);
      if (!category) {
        throw MyError.createError(MyErrorTypes.CATEGORY_NOT_FOUND);
      }

      const attributes = await category.getAttributes();
      const attribute = attributes.find((a) => a.id === attribute_id);
      await category.removeAttribute(attribute);
      if (attribute) {
        await attribute.destroy({ force: true });
      }
    } catch (e) {
      throw e;
    }
  }

  public static async UpdateAttributeOfCategory(
    attribute_id: string,
    new_values: AttributeUpdateOptions
  ): Promise<Attribute> {
    try {
      const attribute = await Attribute.findByPk(attribute_id);
      if (!attribute) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }
      await attribute.update(new_values);
      return attribute;
    } catch (e) {
      throw e;
    }
  }
}
