import AttributeController from "@/controllers/attribute-controller/AttributeController";
import { AttributeUpdateOptions } from "@/controllers/attribute-controller/AttributeControllerTypes";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import sendError from "@/utils/send-error";
import express, { NextFunction, Request, Response } from "express";

const AttributeRouter = express.Router();

// Get all attribute
AttributeRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { page, limit } = req.query;

      if (!page) {
        page = String(0);
      }
      if (!limit) {
        limit = String(5);
      }
      const attrs = await AttributeController.GetAttributes(
        Number(page),
        Number(limit)
      );

      res.status(200).send(
        MyPagingResponse.createPagingResponse(
          {
            page: Number(page),
            pageSize: Number(limit),
            total: attrs.totalCount,
            attributes: attrs.attributeList,
          },
          null
        )
      );
    } catch (e) {
      next(e);
    }
  }
);

// Get a single attribute by ID
AttributeRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }
      const attr = await AttributeController.GetAttributeById(id);
      // Logic to get a single item by ID
      res.status(200).send(MyResponse.createResponse(attr));
    } catch (e) {
      next(e);
    }
  }
);

// Create a new attribute
AttributeRouter.post(
  "/",
  //authorizationMiddleware(""),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, priceEffect, value } = req.body;

      if (!name) {
        sendError(MyErrorTypes.NAME_IS_REQUIRED, res, 400);
        return;
      }

      const newAttr = await AttributeController.CreateAttribute({
        name: name,
        priceEffect,
        value,
      });

      res.status(200).send(MyResponse.createResponse(newAttr));
    } catch (e) {
      next(e);
    }
  }
);

// Update an existing attribute by ID
AttributeRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const opt: AttributeUpdateOptions = req.body;
      const updatedAttr = await AttributeController.UpdateAttributeById(
        id,
        opt
      );

      // Logic to update an existing item by ID
      res.status(200).send(MyResponse.createResponse(updatedAttr.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

// Delete an item by ID
AttributeRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await AttributeController.DeleteAttributeById(id);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);

export default AttributeRouter;
