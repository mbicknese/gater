type PossibleTypes = {
  string: string;
  number: number;
  boolean: boolean;
  array: Array<string | number | boolean>;
  object: Record<string, string | number | boolean>;
};

type SchemaType<TKey extends string, TValue extends keyof PossibleTypes> = { [Property in TKey]: TValue };
type ValueType<T extends SchemaType<string, keyof PossibleTypes>> = {
  [Property in keyof T]: PossibleTypes[T[Property]];
};

/**
 * Internal function to check key value against type
 * @param value
 * @param schema
 */
function _check(
  value: Record<string, string | boolean | number | Array<unknown> | Record<string, unknown>>,
  schema: Record<string, keyof PossibleTypes>,
): boolean {
  // Return early when there's a length mismatch
  // Note that length might be the same when there's both a surplus and missing field in the value
  if (Object.keys(schema).length !== Object.keys(value).length) {
    return false;
  }

  for (const key in value) {
    // Excess keys and empty values are not allowed
    if (!(key in schema) || value[key] == null) {
      return false;
    }
    // The odd one as Arrays are "objects"
    if (Array.isArray(value[key])) {
      if (schema[key] === "array") {
        continue;
      }
      return false;
    }
    // Not the right type
    if (typeof value[key] !== schema[key]) {
      return false;
    }
    // Whups, almost let that slide (NaN is a number, welcome to JavaScript)
    if (typeof value[key] === "number" && Number.isNaN(value[key])) {
      return false;
    }
  }
  return true;
}

/**
 * Validates the value against given schema
 *
 * Schemas allow any string key, with one of the following types:
 *  - string
 *  - number
 *  - boolean
 *  - array
 *  - object
 *
 * Values cannot be omitted or empty, nor can surplus values be supplied. Complex values do not allow for nesting.
 *
 * Example schema
 * ```
 *     {
 *         brand: 'string',
 *         model: 'string',
 *         year:  'number'
 *     }
 * ```
 * @param schema - Dictionary with all allowed keys and their prospective data type
 * @param value - Dictionary with scalar data, flat arrays, or flat objects as values
 */
export function isValid<T extends SchemaType<string, keyof PossibleTypes>>(schema: T, value: ValueType<T>): boolean;
/**
 * Creates a validator that will validate given value against the schema
 *
 * Schemas allow any string key, with one of the following types:
 *  - string
 *  - number
 *  - boolean
 *  - array
 *  - object
 *
 * Values cannot be omitted or empty, nor can surplus values be supplied. Complex values do not allow for nesting.
 *
 * Example schema
 * ```
 *     {
 *         brand: 'string',
 *         model: 'string',
 *         year:  'number'
 *     }
 *```
 * @param schema - Dictionary with all allowed keys and their prospective data type
 * @return A validator function which takes a value to validate against the schema
 */
export function isValid<T extends SchemaType<string, keyof PossibleTypes>>(schema: T): (value: ValueType<T>) => boolean;
export function isValid<T extends SchemaType<string, keyof PossibleTypes>>(schema: T, value?: ValueType<T>) {
  function validate(value: ValueType<T>): boolean {
    return _check(value, schema);
  }

  if (value) return validate(value);
  return validate;
}
