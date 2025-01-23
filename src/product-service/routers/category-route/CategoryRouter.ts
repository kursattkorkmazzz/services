import BodyValidation from "@/commons/utils/request-validation/BodyValidation";
import express, { NextFunction, Request, Response } from "express";
import {
  AttributeCreateBodySchema,
  AttributeGetIdParamSchema,
  AttributeUpdateBodySchema,
  CategoryCreateBodySchema,
  CategoryGetIdParamsSchema,
  CategoryUpdateBodySchema,
} from "./CategorySchemas";
import MyResponse from "@/commons/utils/response/MyResponse";
import ParamValidation from "@/commons/utils/request-validation/ParamValidation";
import MyPagingResponse from "@/commons/utils/response/MyPagingResponse";
import CategoryController from "@/product-service/controllers/categrory-controller/CategoryController";
import AttributeController from "@/product-service/controllers/attribute-controller/AttributeController";
import {
  CategoryCreateOptions,
  CategoryUpdateOptions,
} from "@/product-service/controllers/categrory-controller/CategoryControllerTypes";
import {
  AttributeCreateOptions,
  AttributeUpdateOptions,
} from "@/product-service/controllers/attribute-controller/AttributeControllerTypes";

const CategoryRouter = express.Router();

// #region GET OEPRATIONS

CategoryRouter.get(
  "/categories",
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;

    try {
      const categories = await CategoryController.GetCategoryList(
        Number(page),
        Number(limit)
      );

      res.status(200).send(
        MyPagingResponse.createPagingResponse({
          page: Number(page),
          pageSize: Number(limit),
          total: categories.totalCount,
          categories: categories.categoryList,
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

CategoryRouter.get(
  "/:category_id",
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category_id = req.params.category_id;
      // Call ProductController.CreateProduct method with props.
      const category = await CategoryController.GetCategoryById(category_id);
      res.status(200).send(MyResponse.createResponse(category));
    } catch (err) {
      next(err);
    }
  }
);
// #endregion

// #region CATEGORY OEPRATIONS
CategoryRouter.post(
  "/",
  BodyValidation(CategoryCreateBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props: CategoryCreateOptions = req.body;
      // Call ProductController.CreateProduct method with props.
      const category = await CategoryController.CreateCategory(props);

      res.status(200).send(MyResponse.createResponse(category));
    } catch (err) {
      next(err);
    }
  }
);

CategoryRouter.delete(
  "/:category_id",
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category_id = req.params.category_id;
      // Call ProductController.CreateProduct method with props.
      await CategoryController.DeleteCategoryById(category_id);
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (err) {
      next(err);
    }
  }
);

CategoryRouter.patch(
  "/:category_id",
  BodyValidation(CategoryUpdateBodySchema),
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const new_values: CategoryUpdateOptions = req.body;
      const category_id = req.params.category_id;
      // Call ProductController.CreateProduct method with props.
      const updatedCategory = await CategoryController.UpdateCategoryById(
        category_id,
        new_values
      );
      res.status(200).send(MyResponse.createResponse(updatedCategory));
    } catch (err) {
      next(err);
    }
  }
);
//#endregion

//#region CATEGORY TREE OPERATION
CategoryRouter.get(
  "/:category_id/tree",
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category_id } = req.params;
      const tree = await CategoryController.GetCategoryTree(category_id);
      res.status(200).send(MyResponse.createResponse(tree));
    } catch (err) {
      next(err);
    }
  }
);
//#endregion

//#region CATEGORY ATTRIBUTE OPERATIONS

CategoryRouter.post(
  "/:category_id/attribute",
  ParamValidation(CategoryGetIdParamsSchema),
  BodyValidation(AttributeCreateBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category_id } = req.params;
      const values: AttributeCreateOptions = req.body;
      const attribute = await AttributeController.CreateAttribute(
        category_id,
        values
      );
      res.status(200).send(MyResponse.createResponse(attribute));
    } catch (err) {
      next(err);
    }
  }
);

CategoryRouter.get(
  "/:category_id/attributes",
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category_id } = req.params;

      const attributes = await AttributeController.GetAttributesOfCategory(
        category_id
      );
      res.status(200).send(MyResponse.createResponse(attributes));
    } catch (err) {
      next(err);
    }
  }
);

CategoryRouter.delete(
  "/:category_id/attribute/:attribute_id",
  ParamValidation(CategoryGetIdParamsSchema),
  ParamValidation(AttributeGetIdParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category_id, attribute_id } = req.params;

      await AttributeController.DeleteAttributeOfCategory(
        category_id,
        attribute_id
      );
      res.status(200).send(MyResponse.createSuccessResponse());
    } catch (err) {
      next(err);
    }
  }
);

CategoryRouter.patch(
  "/:category_id/attribute/:attribute_id",
  ParamValidation(CategoryGetIdParamsSchema),
  ParamValidation(AttributeGetIdParamSchema),
  BodyValidation(AttributeUpdateBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category_id, attribute_id } = req.params;
      const new_values: AttributeUpdateOptions = req.body;
      const updatedAttribute =
        await AttributeController.UpdateAttributeOfCategory(
          attribute_id,
          new_values
        );
      res.status(200).send(MyResponse.createResponse(updatedAttribute));
    } catch (err) {
      next(err);
    }
  }
);
//#endregion
export default CategoryRouter;
