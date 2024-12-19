enum MyErrorTypes {
  // Default
  UNKNOWN,

  // General
  ID_IS_REQUIRED = "Id is required",
  ID_INVALID_SYNTAX = "Id has invalid syntax. Please use UUID.",
  NAME_IS_REQUIRED = "Name is required.",

  // Item
  ITEM_NOT_FOUND = "The item is not found.",
  ITEM_HAS_SAME_ATTRIBUTE = "The item already has the attribute with given name.",
  // Attribute
  ATTRIBUTE_NOT_FOUND = "The attribute is not found.",

  // Attribyte Value
  ATTRIBUTE_VALUE_NOT_FOUND = "The attribute value is not found.",
  ATTRIBUTE_ATTRIBUTE_ID_NOT_FOUND = "Attribute Id is required.",
  ATTRIBUTE_HAS_SAME_VALUE = "Attribute already has given value.",
}

export default MyErrorTypes;
