export function isValid(
  value: Record<
    string,
    string | boolean | number | Array<unknown> | Record<string, unknown>
  >,
  schema: Record<string, "string" | "number" | "boolean" | "array" | "object">,
): boolean {
  for (const key in value) {
    if (!(key in schema)) {
      return false; // Excess keys not allowed
    }
    if (Array.isArray(value[key]) && schema[key] === "array") {
      continue; // The odd one as Arrays are "objects"
    }
    if (typeof value[key] !== schema[key]) {
      return false; // Not the right type
    }
    if (typeof value[key] === "number" && Number.isNaN(value[key])) {
      return false; // Whups, almost let that slide
    }
  }
  return true;
}
