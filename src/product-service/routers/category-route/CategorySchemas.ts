import {
  AttributeCreateOptions,
  AttributeUpdateOptions,
} from "@/product-service/controllers/attribute-controller/AttributeControllerTypes";
import {
  CategoryCreateOptions,
  CategoryUpdateOptions,
} from "@/product-service/controllers/categrory-controller/CategoryControllerTypes";
import Z from "Zod";

// BODY SCHEMA
export const CategoryCreateBodySchema = Z.object<{
  [K in keyof CategoryCreateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string(),
  parent_category_id: Z.string().uuid().optional(),
});

export const CategoryUpdateBodySchema = Z.object<{
  [K in keyof CategoryUpdateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string().optional(),
  parent_category_id: Z.string().uuid().optional(),
});

export const AttributeCreateBodySchema = Z.object<{
  [K in keyof AttributeCreateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string(),
});

export const AttributeUpdateBodySchema = Z.object<{
  [K in keyof AttributeUpdateOptions as string]: Zod.ZodTypeAny;
}>({
  name: Z.string().optional(),
});
// PARAM SCHEMA
export const CategoryGetIdParamsSchema = Z.object({
  category_id: Z.string().uuid().nonempty(),
});

export const AttributeGetIdParamSchema = Z.object({
  attribute_id: Z.string().uuid().nonempty(),
});
