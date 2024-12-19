import Item from "@/database/models/Item";
import {
  AttributeCreateOptions,
  AttributeUpdateOptions,
  AttributeValueCreateOptions,
  AttributeValueUpdateOptions,
  ItemAttributeAndValueReturnType,
  ItemCreateOptions,
  ItemUpdateOptions,
} from "./ItemControllerTypes";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import { it } from "node:test";
import Attribute from "@/database/models/Attribute";
import AttributeValue from "@/database/models/AttributeValueTable";

export default class ItemController {
  //************* Item Functions *************
  /**
   * Creates a new item with the provided options.
   *
   * @param {ItemCreateOptions} opt - The options for creating the item.
   * @returns {Promise<Item>} A promise that resolves to the newly created item.
   * @throws Will throw an error if the item creation fails.
   */
  public static async CreateItem(opt: ItemCreateOptions): Promise<Item> {
    try {
      const newItem = await Item.create({
        ...opt,
      });
      return newItem;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves an item by its ID.
   *
   * @param id - The ID of the item to retrieve.
   * @returns A promise that resolves to the item if found.
   * @throws {MyError} If the item is not found.
   */
  public static async GetItemById(id: string): Promise<Item> {
    try {
      const item: Item | null = await Item.findByPk(id);
      if (!item) {
        throw MyError.createError(MyErrorTypes.ITEM_NOT_FOUND);
      }
      return item!;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Updates an item by its ID with the provided options.
   *
   * @param id - The ID of the item to update.
   * @param options - The update options to apply to the item.
   * @returns A promise that resolves to the updated item.
   * @throws Will throw an error if the item cannot be found or updated.
   */
  public static async UpdateItemById(
    id: string,
    options: ItemUpdateOptions
  ): Promise<Item> {
    try {
      const item: Item = await this.GetItemById(id);
      await item.update({
        ...options,
      });
      item.reload();
      return item;
    } catch (e) {
      throw e;
    }
  }

  /**
   * Deletes an item by its ID.
   *
   * @param id - The ID of the item to be deleted.
   * @returns A promise that resolves to void.
   * @throws {MyError} If the item is not found.
   */
  public static async DeleteItemById(id: string): Promise<void> {
    try {
      const count = await Item.destroy({
        where: {
          id,
        },
      });
      if (count <= 0) {
        throw MyError.createError(MyErrorTypes.ITEM_NOT_FOUND);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Retrieves a paginated list of items from the database.
   *
   * @param {number} [page] - The page number to retrieve.
   * @param {number} [limit] - The number of items per page.
   * @returns {Promise<{ itemList: Item[]; totalCount: number }>} A promise that resolves to an object containing the list of items and the total count of items.
   * @throws Will throw an error if the retrieval fails.
   */
  public static async GetItems(
    page?: number,
    limit?: number
  ): Promise<{ itemList: Item[]; totalCount: number }> {
    try {
      let offset = undefined;
      if (limit && page) {
        offset = (page - 1) * limit;
      }

      const items = await Item.findAll({
        offset: offset,
        limit: limit,
      });

      const totalItemCount = await Item.count();

      return {
        itemList: items,
        totalCount: totalItemCount,
      };
    } catch (e) {
      throw e;
    }
  }

  //************* Attribute Functions *************
  public static async AddAttributeToItem(
    item_id: string,
    opts: AttributeCreateOptions
  ) {
    try {
      const item = await this.GetItemById(item_id);

      const isItemHasSameAttribute: boolean = (await item.getAttributes()).some(
        (attr: Attribute) => {
          if (attr.name == opts.name) {
            return true;
          }
          return false;
        }
      );

      if (isItemHasSameAttribute) {
        throw MyError.createError(MyErrorTypes.ITEM_HAS_SAME_ATTRIBUTE);
      }

      await item.createAttribute({
        name: opts.name,
      });
    } catch (e) {
      throw e;
    }
  }

  public static async RemoveAttributeFromItem(
    item_id: string,
    attribute_name: string
  ) {
    try {
      // Deleted attribute from item.
      const item = await this.GetItemById(item_id);
      const attributes = await item.getAttributes();

      const attribute: Attribute | undefined = attributes.find(
        (attribute) => attribute.name == attribute_name
      );

      if (!attribute) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }

      await item.removeAttribute(attribute);

      // Deleted all values of attribute.
      const values = await attribute.getAttributeValues();
      await Promise.all(values.map((value) => value.destroy()));

      // Delete attribute itself.
      await attribute.destroy();
    } catch (e) {
      throw e;
    }
  }

  public static async UpdateAttributeOfItem(
    attribute_id: string,
    opts: AttributeUpdateOptions
  ) {
    try {
      const attribute = await Attribute.findByPk(attribute_id);
      if (!attribute) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }
      await attribute.update({
        ...opts,
      });
      attribute.reload();
      return attribute;
    } catch (e) {
      throw e;
    }
  }

  public static async GetAttributesOfItemById(
    item_id: string
  ): Promise<ItemAttributeAndValueReturnType> {
    try {
      const item = await this.GetItemById(item_id);
      const attributes = await item.getAttributes();
      const attributesAndValues = await Promise.all(
        attributes.map(async (attribute) => {
          const values = await attribute.getAttributeValues();
          return {
            ...attribute.get(),
            values,
          };
        })
      );
      return {
        ...item.get(),
        attributes: attributesAndValues,
      };
    } catch (e) {
      throw e;
    }
  }
  //************* Attribute Value Functions *************

  public static async AddValueToAttribute(opts: AttributeValueCreateOptions) {
    try {
      const attribute: Attribute | null = await Attribute.findByPk(
        opts.attribute_id
      );
      if (!attribute) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }

      await attribute.createAttributeValue({
        attribute_id: attribute.id!,
        priceEffect: opts.priceEffect || 0,
        value: opts.value,
      });
    } catch (e) {
      throw e;
    }
  }

  public static async DeleteAttributeValue(value_id: string) {
    try {
      const attributeValue = await AttributeValue.findByPk(value_id);

      if (!attributeValue) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_VALUE_NOT_FOUND);
      }

      await attributeValue.destroy();
    } catch (e) {
      throw e;
    }
  }

  public static async UpdateAttributeValue(
    value_id: string,
    opts: AttributeValueUpdateOptions
  ) {
    try {
      const attributeValue = await AttributeValue.findByPk(value_id);
      if (!attributeValue) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_VALUE_NOT_FOUND);
      }
      attributeValue.update({
        ...opts,
      });
      attributeValue.reload();
      return attributeValue;
    } catch (e) {
      throw e;
    }
  }
}
