import Attribute from "@/database/models/Attribute";
import {
  AttributeAndAttributeValuesReturnType,
  AttributeValueCreateOptions,
  AttributeValueUpdateOptions,
} from "./AttributeValueTypes";
import MyError from "@/utils/error/MyError";
import MyErrorTypes from "@/utils/error/MyErrorTypes";
import AttributeValue from "@/database/models/AttributeValueTable";

export default class AttributeValueController {
  public static async CreateAttributeValue(opts: AttributeValueCreateOptions) {
    try {
      let attribute: Attribute | null = await Attribute.findByPk(
        opts.attribute_id
      );
      if (!attribute) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }
      const sameValueAttributes: AttributeValue[] =
        await attribute.getAttributeValues({
          where: {
            value: opts.value,
          },
        });

      if (sameValueAttributes.length > 0) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_HAS_SAME_VALUE);
      }

      const attributeValue: AttributeValue = await AttributeValue.create({
        attribute_id: opts.attribute_id,
        priceEffect: opts.priceEffect || 0,
        value: opts.value,
      });

      return attributeValue;
    } catch (e) {
      throw e;
    }
  }

  public static async DeleteAttributeValue(attribute_value_id: string) {
    try {
      const attributeValue: AttributeValue | null =
        await AttributeValue.findByPk(attribute_value_id);
      if (!attributeValue) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_VALUE_NOT_FOUND);
      }
      await attributeValue.destroy();
    } catch (e) {
      throw e;
    }
  }

  public static async UpdateAttributeValue(
    attribute_value_id: string,
    opts: AttributeValueUpdateOptions
  ) {
    try {
      const attributeValue: AttributeValue | null =
        await AttributeValue.findByPk(attribute_value_id);
      if (!attributeValue) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_VALUE_NOT_FOUND);
      }

      if (opts.value) {
        attributeValue.value = opts.value;
      }
      if (opts.priceEffect) {
        attributeValue.priceEffect = opts.priceEffect;
      }

      await attributeValue.save();
      return attributeValue;
    } catch (e) {
      throw e;
    }
  }

  public static async GetAttributeValuesOfAttribute(
    attribute_value_id: string
  ): Promise<AttributeAndAttributeValuesReturnType> {
    try {
      const attribute: Attribute | null = await Attribute.findByPk(
        attribute_value_id
      );
      if (!attribute) {
        throw MyError.createError(MyErrorTypes.ATTRIBUTE_NOT_FOUND);
      }

      const attributeValues: AttributeValue[] =
        await attribute.getAttributeValues();
      return {
        id: attribute.id,
        name: attribute.name,
        attributeValues: attributeValues,
      };
    } catch (e) {
      throw e;
    }
  }
}
