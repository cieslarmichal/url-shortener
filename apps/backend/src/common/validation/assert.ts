import { InputNotValidError } from '../errors/common/inputNotValidError.js';
import { Validator } from './validator.js';

export enum StringFormat {
  uuid = 'uuid',
  email = 'email',
  phoneNumber = 'phoneNumber',
  isUrl = 'isUrl',
  numeric = 'numeric',
}

export class Assert {
  private static stringFormatValidatorsMap = new Map<StringFormat, (value: unknown) => boolean>([
    [StringFormat.uuid, Validator.isUuid],
    [StringFormat.email, Validator.isEmail],
    [StringFormat.isUrl, Validator.isStringUrl],
  ]);

  public static isStringFormat(format: StringFormat, value: unknown): asserts value is string {
    const validator = Assert.stringFormatValidatorsMap.get(format);

    if (!validator || !validator(value)) {
      throw new InputNotValidError({
        reason: `Input is not in the expected format (${format}).`,
        value,
      });
    }
  }

  public static isNotEmptyString(value: unknown): asserts value is string {
    if (!Validator.isNonEmptyString(value)) {
      throw new InputNotValidError({
        reason: `Input is not longer than or equal ${length} characters.`,
        value,
      });
    }
  }

  public static isNumber(value: unknown): asserts value is number {
    if (!Validator.isNumber(value)) {
      throw new InputNotValidError({
        reason: `Input is not a number.`,
        value,
      });
    }
  }

  public static isNumberInteger(value: unknown): asserts value is number {
    Assert.isNumber(value);

    if (!Validator.isInteger(value)) {
      throw new InputNotValidError({
        reason: `Input is not an integer.`,
        value,
      });
    }
  }

  public static isBoolean(value: unknown): asserts value is boolean {
    if (!Validator.isBoolean(value)) {
      throw new InputNotValidError({
        reason: `Input is not a boolean.`,
        value,
      });
    }
  }

  public static isEnum<T extends Record<string, string>>(enumType: T, value: unknown): asserts value is T[keyof T] {
    if (!Validator.isEnum(enumType, value)) {
      throw new InputNotValidError({
        reason: `Input is not an enum value.`,
        value,
        enum: enumType,
      });
    }
  }
}
