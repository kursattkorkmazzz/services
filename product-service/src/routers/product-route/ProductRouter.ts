import BodyValidation from "@/utils/request-validation/BodyValidation";
import express, { NextFunction, Request, Response } from "express";
import {
  ImageGetIdParamsSchema,
  ImageURLGetBodySchema,
  ProductCreateBodySchema,
  ProductGetIdParamsSchema,
  ProductUpdateBodySchema,
} from "./ProductSchemas";
import {
  ProductCreateOptions,
  ProductUpdateOptions,
} from "@/controllers/product-controller/ProductControllerTypes";
import ProductController from "@/controllers/product-controller/ProductController";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import ParamValidation from "@/utils/request-validation/ParamValidation";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
import {
  AttributeGetIdParamSchema,
  CategoryGetIdParamsSchema,
} from "../category-route/CategorySchemas";
const ProductRouter = express.Router();

//#region READ OPERATIONS
ProductRouter.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    try {
      const products = await ProductController.GetProductList(
        Number(page),
        Number(limit)
      );

      res.status(200).send(
        MyPagingResponse.createPagingResponse({
          page: Number(page),
          pageSize: Number(limit),
          total: products.totalCount,
          products: products.productList,
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

ProductRouter.get(
  "/products/:category_id",
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const { category_id } = req.params;

    try {
      const products = await ProductController.GetProductListByCategory(
        category_id,
        Number(page),
        Number(limit)
      );

      res.status(200).send(
        MyPagingResponse.createPagingResponse({
          page: Number(page),
          pageSize: Number(limit),
          total: products.totalCount,
          products: products.productList,
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

ProductRouter.get(
  "/:product_id",
  ParamValidation(ProductGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_id = req.params.product_id;
      // Call ProductController.CreateProduct method with props.
      const product = await ProductController.GetProductById(product_id);
      res.status(200).send(MyResponse.createResponse(product));
    } catch (err) {
      next(err);
    }
  }
);
//#endregion

// #region PRODUCT ITSELF OPERATIONS

ProductRouter.post(
  "/",
  BodyValidation(ProductCreateBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const props: ProductCreateOptions = req.body;
      // Call ProductController.CreateProduct method with props.
      const product = await ProductController.CreateProduct(props);

      res.status(200).send(MyResponse.createResponse(product));
    } catch (err) {
      next(err);
    }
  }
);

ProductRouter.delete(
  "/:product_id",
  ParamValidation(ProductGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_id = req.params.product_id;
      // Call ProductController.CreateProduct method with props.
      await ProductController.DeleteProductById(product_id);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
);

ProductRouter.patch(
  "/:product_id",
  BodyValidation(ProductUpdateBodySchema),
  ParamValidation(ProductGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const new_values: ProductUpdateOptions = req.body;
      const product_id = req.params.product_id;
      // Call ProductController.CreateProduct method with props.
      const updatedProduct = await ProductController.UpdateProductById(
        product_id,
        new_values
      );
      res.status(200).send(MyResponse.createResponse(updatedProduct));
    } catch (err) {
      next(err);
    }
  }
);
//#endregion

//#region PRODUCT CATEGORY OPERATIONS

ProductRouter.post(
  "/:product_id/category/:category_id",
  ParamValidation(ProductGetIdParamsSchema),
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_id = req.params.product_id;
      const category_id = req.params.category_id;
      await ProductController.AttachCategoryToProduct(category_id, product_id);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
);

ProductRouter.delete(
  "/:product_id/category/:category_id",
  ParamValidation(ProductGetIdParamsSchema),
  ParamValidation(CategoryGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product_id = req.params.product_id;
      const category_id = req.params.category_id;
      await ProductController.DetachCategoryFromProduct(
        category_id,
        product_id
      );
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
);
// #endregion

// #region PRODUCT IMAGE OPERATIONS
ProductRouter.post(
  "/:product_id/image",
  ParamValidation(ProductGetIdParamsSchema),
  BodyValidation(ImageURLGetBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id } = req.params;
      const { image_url } = req.body;
      await ProductController.AddImageToProduct(product_id, image_url);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
);

ProductRouter.delete(
  "/:product_id/image/:image_id",
  ParamValidation(ProductGetIdParamsSchema),
  ParamValidation(ImageGetIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id, image_id } = req.params;

      await ProductController.RemoveImageFromProduct(image_id);
      res.status(200).send(MyResponse.createResponse(MyResponseTypes.SUCCESS));
    } catch (err) {
      next(err);
    }
  }
);
// #endregion

// #region PRODUCT ATTRIBUTE VALUE OPERATIONS

ProductRouter.post(
  "/:product_id/attribute/:attribute_id/attribute-value",
  ParamValidation(ProductGetIdParamsSchema),
  ParamValidation(AttributeGetIdParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id, attribute_id } = req.params;

      res
        .status(200)
        .send(MyResponse.createResponse(attribute_id + " " + product_id));
    } catch (err) {
      next(err);
    }
  }
);

// #endregion
export default ProductRouter;
