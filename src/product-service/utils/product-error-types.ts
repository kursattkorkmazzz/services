import CommonErrorCodes from "@/commons/utils/error/ CommonErrorTypes";
import MyError from "@/commons/utils/error/MyError";

export enum ErrorTypes {
  // Product
  PRODUCT_NOT_FOUND = "The product with specified id is not found.",
  IMAGE_NOT_FOUND = "The image with specified id is not found.",

  // Category
  CATEGORY_NOT_FOUND = "The category with specified id is not found.",
  DEFAULT_CATEGORY_CANNOT_DELETE = "This category cannot deletable.",

  // Attribute
  ATTRIBUTE_NOT_FOUND = "The attribute with specified id is not found.",

  // OTHERS
  ID_IS_REQUIRED = "Id is required",
  ID_INVALID_SYNTAX = "Id has invalid syntax. Please use UUID.",
  NAME_IS_REQUIRED = "Name is required.",
}

export type ProductErrorTypes =
  | keyof typeof ErrorTypes
  | keyof typeof CommonErrorCodes;

export default function CreateError(errorType: ProductErrorTypes): MyError {
  return new MyError({
    error_code:
      ErrorTypes[errorType as keyof typeof ErrorTypes] ||
      CommonErrorCodes[errorType as keyof typeof CommonErrorCodes],
    description: errorType,
  });
}
