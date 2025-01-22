import {
  ProductCreateOptions,
  ProductUpdateOptions,
} from "@/controllers/product-controller/ProductControllerTypes";
import Z, { number } from "Zod";

// BODY SCHEMA
export const ProductCreateBodySchema = Z.object<{
  [K in keyof ProductCreateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string(),
  base_price: Z.number(),
  description: Z.string().nullable().optional(),
});

export const ProductUpdateBodySchema = Z.object<{
  [K in keyof ProductUpdateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string().optional(),
  base_price: Z.number().optional(),
  description: Z.string().nullable().optional(),
});

export const ImageURLGetBodySchema = Z.object({
  image_url: Z.string().url().nonempty(),
});

// PARAMS SCHEMA
export const ProductGetIdParamsSchema = Z.object({
  product_id: Z.string().uuid().nonempty(),
});

export const ImageGetIdParamsSchema = Z.object({
  image_id: Z.string().uuid().nonempty(),
});

export const AttributeValueGetIdParamsSchema = Z.object({
  attribute_value_id: Z.string().uuid().nonempty(),
});
