enum MyErrorTypes {
  // Default
  UNKNOWN,

  // General
  ID_IS_REQUIRED = "Id is required",
  ID_INVALID_SYNTAX = "Id has invalid syntax. Please use UUID.",
  NAME_IS_REQUIRED = "Name is required.",

  // Product
  PRODUCT_NOT_FOUND = "The product with specified id is not found.",

  // Category
  CATEGORY_NOT_FOUND = "The category with specified id is not found.",
}

export default MyErrorTypes;
