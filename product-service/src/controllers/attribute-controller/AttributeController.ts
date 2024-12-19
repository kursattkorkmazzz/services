import {
  AttributeCreateOptions,
  AttributeUpdateOptions,
} from "./AttributeControllerTypes";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import Attribute from "@/database/models/Attribute";

export default class AttributeController {
  /**
   * Creates a new attribute with the given options.
   *
   * @param {AttributeCreateOptions} opt - The options for creating the attribute.
   * @returns {Promise<Attribute>} A promise that resolves to the created attribute.
   * @throws Will throw an error if the attribute creation fails.
   */
  public static async CreateAttribute(
    opt: AttributeCreateOptions
  ): Promise<Attribute> {
    try {
      const attribute = await Attribute.create({
        name: opt.name,
      });

      return attribute;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves an attribute by its ID.
   *
   * @param id - The ID of the attribute to retrieve.
   * @returns A promise that resolves to the attribute if found.
   * @throws {MyError} If the attribute is not found.
   */
  public static async GetAttributeById(id: string): Promise<Attribute> {
    try {
      const attr: Attribute | null = await Attribute.findByPk(id);
      if (!attr) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }

      return attr;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates an attribute by its ID.
   *
   * @param id - The ID of the attribute to update.
   * @param options - The update options for the attribute.
   * @returns A promise that resolves to the updated attribute.
   * @throws {MyError} If the attribute is not found.
   */
  public static async UpdateAttributeById(
    id: string,
    options: AttributeUpdateOptions
  ): Promise<Attribute> {
    try {
      const attr: Attribute | null = await Attribute.findByPk(id);

      if (!attr) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }
      await attr.update({
        ...options,
      });
      attr.reload();
      return attr;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Deletes an attribute by its ID.
   *
   * @param id - The ID of the attribute to delete.
   * @returns A promise that resolves to void.
   * @throws {MyError} If the attribute is not found.
   */
  public static async DeleteAttributeById(id: string): Promise<void> {
    try {
      const count = await Attribute.destroy({
        where: {
          id,
        },
      });
      if (count <= 0) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves a paginated list of attributes.
   *
   * @param {number} [page] - The page number to retrieve.
   * @param {number} [limit] - The number of attributes per page.
   * @returns {Promise<{ attributeList: Attribute[]; totalCount: number }>} A promise that resolves to an object containing the list of attributes and the total count of attributes.
   * @throws Will throw an error if the retrieval fails.
   */
  public static async GetAttributes(
    page?: number,
    limit?: number
  ): Promise<{ attributeList: Attribute[]; totalCount: number }> {
    try {
      let offset = undefined;
      if (limit && page) {
        offset = (page - 1) * limit;
      }

      const attrs = await Attribute.findAll({
        offset: offset,
        limit: limit,
      });

      const totalAttrCount = await Attribute.count();

      return {
        attributeList: attrs,
        totalCount: totalAttrCount,
      };
    } catch (e) {
      throw e;
    }
  }
}
