import Item from "@/database/models/Item";
import { ItemCreateOptions, ItemUpdateOptions } from "./ItemControllerTypes";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import Logger from "@/utils/logger";

export default class ItemController {
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
}
