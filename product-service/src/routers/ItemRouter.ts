import ItemController from "@/controllers/item-controller/ItemController";
import { ItemUpdateOptions } from "@/controllers/item-controller/ItemControllerTypes";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import sendError from "@/utils/send-error";
import express, { NextFunction, Request, Response } from "express";
const ItemRouter = express.Router();

/// Get all items
ItemRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { page, limit } = req.query;

    if (!page) {
      page = String(0);
    }
    if (!limit) {
      limit = String(5);
    }
    const roles = await ItemController.GetItems(Number(page), Number(limit));

    res.status(200).send(
      MyPagingResponse.createPagingResponse(
        {
          page: Number(page),
          pageSize: Number(limit),
          total: roles.totalCount,
          items: roles.itemList,
        },
        null
      )
    );
  } catch (e) {
    next(e);
  }
});

// Get a single item by ID
ItemRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }
      const item = await ItemController.GetItemById(id);
      // Logic to get a single item by ID
      res.status(200).send(MyResponse.createResponse(item.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Create a new item
ItemRouter.post(
  "/",
  //authorizationMiddleware(""),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, base_price, description, image_urls } = req.body;

      if (!name) {
        sendError(MyErrorTypes.NAME_IS_REQUIRED, res, 400);
        return;
      }

      const newItem = await ItemController.CreateItem({
        name: name,
        base_price: base_price,
        description: description,
        image_urls: image_urls,
      });

      res.status(200).send(MyResponse.createResponse(newItem));
    } catch (e) {
      next(e);
    }
  }
);

// Update an existing item by ID
ItemRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const opt: ItemUpdateOptions = req.body;
      const updatedItem = await ItemController.UpdateItemById(id, opt);

      // Logic to update an existing item by ID
      res.status(200).send(MyResponse.createResponse(updatedItem.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Delete an item by ID
ItemRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await ItemController.DeleteItemById(id);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);

export default ItemRouter;
