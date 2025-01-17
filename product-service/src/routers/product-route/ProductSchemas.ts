import {
  ProductCreateOptions,
  ProductUpdateOptions,
} from "@/controllers/product-controller/ProductControllerTypes";
import Z, { number } from "Zod";

export const ProductCreateBodySchema = Z.object<{
  [K in keyof ProductCreateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string(),
  base_price: Z.number(),
  description: Z.string().nullable().optional(),
  image_urls: Z.array(Z.string()).nullable().optional(),
});

export const ProductUpdateBodySchema = Z.object<{
  [K in keyof ProductUpdateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string().optional(),
  base_price: Z.number().optional(),
  description: Z.string().nullable().optional(),
});

export const ProductGetIdParamsSchema = Z.object({
  product_id: Z.string().uuid().nonempty(),
});
