import ItemController from "@/controllers/item-controller/ItemController";
import { ItemUpdateOptions } from "@/controllers/item-controller/ItemControllerTypes";
import authorizationMiddleware from "@/middleware/authorization-middleware";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import sendError from "@/utils/send-error";
import express, { NextFunction, Request, Response } from "express";
const ItemRouter = express.Router();

// /item-service/item/

// ************ Item Attribute and Value CRUD ************

// Create attribute to item.
ItemRouter.post(
  "/:id/attribute",
  authorizationMiddleware("item:create"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const item_id = req.params.id;
      if (!item_id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }
      if (!name) {
        sendError(MyErrorTypes.NAME_IS_REQUIRED, res, 400);
        return;
      }
      await ItemController.AddAttributeToItem(item_id, { name });
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);

// Get all attributes of an item
ItemRouter.get(
  "/:id/attributes",
  authorizationMiddleware("item:read"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }
      const attributes = await ItemController.GetAttributesOfItemById(id);
      res.status(200).send(MyResponse.createResponse(attributes));
    } catch (e) {
      next(e);
    }
  }
);

// Update attribute of an item
ItemRouter.put(
  "/:id/attribute",
  authorizationMiddleware("item:update"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { attribute_id, name } = req.body;

      if (!attribute_id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }

      const updatedAttribute = await ItemController.UpdateAttributeOfItem(
        attribute_id,
        { name }
      );
      res
        .status(200)
        .send(MyResponse.createResponse(updatedAttribute.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Delete attribute and its all values from item.
ItemRouter.delete(
  "/:id/attribute",
  authorizationMiddleware("item:delete"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { attribute_name } = req.body;
      const item_id = req.params.id;
      if (!item_id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }

      if (!attribute_name) {
        sendError(MyErrorTypes.NAME_IS_REQUIRED, res, 400);
        return;
      }
      await ItemController.RemoveAttributeFromItem(item_id, attribute_name);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);
// Add Value to Attribute
ItemRouter.post(
  "/:id/value",
  authorizationMiddleware("item:create"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { attribute_id, value, price_effect } = req.body;
      if (!attribute_id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }
      if (!value) {
        sendError(MyErrorTypes.ATTRIBUTE_VALUE_NOT_FOUND, res, 400);
        return;
      }
      await ItemController.AddValueToAttribute({
        attribute_id: attribute_id,
        value: value,
        priceEffect: price_effect,
      });
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);

// Delete Value from a Attribute of item.
ItemRouter.delete(
  "/:id/value",
  authorizationMiddleware("item:delete"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { value_id } = req.body;

      if (!value_id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }

      await ItemController.DeleteAttributeValue(value_id);
    } catch (e) {
      throw e;
    }
  }
);
// Update attribute value of attribute of an item.
ItemRouter.put(
  "/:id/value",
  authorizationMiddleware("item:update"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { attribute_value_id, value, price_effect } = req.body;
      if (!attribute_value_id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }

      const updatedAttributeValue = await ItemController.UpdateAttributeValue(
        attribute_value_id,
        {
          priceEffect: price_effect,
          value: value,
        }
      );

      res
        .status(200)
        .send(MyResponse.createResponse(updatedAttributeValue.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// ********** Item CRUD **********

/// Get all items
ItemRouter.get(
  "/",
  authorizationMiddleware("item:read"),
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// Get a single item by ID
ItemRouter.get(
  "/:id",
  authorizationMiddleware("item:read"),
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
  authorizationMiddleware("item:create"),
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
  authorizationMiddleware("item:update"),
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
  authorizationMiddleware("item:delete"),
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

// Remove attribute from item.
export default ItemRouter;
