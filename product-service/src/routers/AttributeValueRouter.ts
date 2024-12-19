import AttributeController from "@/controllers/attribute-controller/AttributeController";
import { AttributeUpdateOptions } from "@/controllers/attribute-controller/AttributeControllerTypes";
import AttributeValueController from "@/controllers/attribute-value-controller/AttributeValueController";
import { AttributeValueUpdateOptions } from "@/controllers/attribute-value-controller/AttributeValueTypes";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import sendError from "@/utils/send-error";
import express, { NextFunction, Request, Response } from "express";

const AttributeValueRouter = express.Router();
/**
 * + Create Atribute Value To a Attribute.
 * + Delete Attribute Value from a Attribute and DB.
 * + Update Attribute Value.
 * + Get -all- Attribute Values of an Attribute.
 */

// Get all attribute values of an attribute
AttributeValueRouter.get(
  "/:attribute_id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attribute_id = req.params.attribute_id as string;
      if (!attribute_id) {
        sendError(MyErrorTypes.ATTRIBUTE_ATTRIBUTE_ID_NOT_FOUND, res, 400);
        return;
      }

      const attributeValues =
        await AttributeValueController.GetAttributeValuesOfAttribute(
          attribute_id
        );
      res.status(200).send(MyResponse.createResponse(attributeValues));
    } catch (e) {
      next(e);
    }
  }
);

// Create attribute
AttributeValueRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { attribute_id, value, priceEffect } = req.body;
      if (!attribute_id) {
        sendError(MyErrorTypes.ATTRIBUTE_ATTRIBUTE_ID_NOT_FOUND, res, 400);
        return;
      }
      if (!value) {
        sendError(MyErrorTypes.ATTRIBUTE_VALUE_NOT_FOUND, res, 400);
        return;
      }

      const newAttribute = await AttributeValueController.CreateAttributeValue({
        attribute_id: attribute_id,
        value: value,
        priceEffect: priceEffect,
      });

      res.status(200).send(MyResponse.createResponse(newAttribute.toJSON()));
      // CREATING ATTRIBUTE VALUE for a ATTRIBUTE.
    } catch (e) {
      next(e);
    }
  }
);

// Delete attribute value from attribute
AttributeValueRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }

      await AttributeValueController.DeleteAttributeValue(id);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (e) {
      next(e);
    }
  }
);

// Update attribute value
AttributeValueRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { value, priceEffect } = req.body;
      if (!id) {
        sendError(MyErrorTypes.ID_IS_REQUIRED, res, 400);
        return;
      }

      const opts: AttributeValueUpdateOptions = {
        value: value,
        priceEffect: priceEffect,
      };

      const updatedAttribute =
        await AttributeValueController.UpdateAttributeValue(id, opts);
      res
        .status(200)
        .send(MyResponse.createResponse(updatedAttribute.toJSON()));
    } catch (e) {
      next(e);
    }
  }
);

export default AttributeValueRouter;
