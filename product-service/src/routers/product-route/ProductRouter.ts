import BodyValidation from "@/utils/request-validation/BodyValidation";
import express, { NextFunction, Request, Response } from "express";
import {
  ProductCreateBodySchema,
  ProductGetIdParamsSchema,
  ProductUpdateBodySchema,
} from "./ProductSchemas";
import Z, { number } from "Zod";
import {
  ProductCreateOptions,
  ProductUpdateOptions,
} from "@/controllers/product-controller/ProductControllerTypes";
import ProductController from "@/controllers/product-controller/ProductController";
import MyResponse, { MyResponseTypes } from "@/utils/response/MyResponse";
import ParamValidation from "@/utils/request-validation/ParamValidation";
import MyPagingResponse from "@/utils/response/MyPagingResponse";
const ProductRouter = express.Router();

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

export default ProductRouter;
