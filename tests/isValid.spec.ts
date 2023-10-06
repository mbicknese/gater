import { isValid } from "../src/index.ts";

const wrongValues: Array<any> = [
  true,
  false,
  [],
  {},
  "",
  "Dell",
  0,
  -42,
  Math.PI,
  Number.NaN,
  Math.E,
  null,
  undefined,
  () => {},
];

describe("isValid", () => {
  describe("string fields", () => {
    it("accepts empty string", () => {
      expect(isValid({ brand: "" }, { brand: "string" })).toBe(true);
    });
    it("accepts a string with content", () => {
      expect(isValid({ brand: "Apple" }, { brand: "string" })).toBe(true);
    });

    it.each(wrongValues.filter((value) => !["Dell", ""].includes(value)))(
      "rejects %s",
      (wrongValue) => {
        expect(isValid({ brand: wrongValue }, { brand: "string" })).toBe(false);
      },
    );
  });

  describe("number fields", () => {
    it("accepts zero", () => {
      expect(isValid({ amount: 0 }, { amount: "number" })).toBe(true);
    });
    it("accepts positive integers", () => {
      expect(isValid({ brand: 42 }, { brand: "number" })).toBe(true);
    });
    it("accepts negative integers", () => {
      expect(isValid({ brand: -42 }, { brand: "number" })).toBe(true);
    });
    it("accepts floats", () => {
      expect(isValid({ brand: Math.PI }, { brand: "number" })).toBe(true);
    });
    it("accepts irrational numbers", () => {
      expect(isValid({ brand: Math.E }, { brand: "number" })).toBe(true);
    });

    it.each(
      wrongValues.filter((value) => ![0, -42, Math.PI, Math.E].includes(value)),
    )("rejects %s", (wrongValue) => {
      expect(isValid({ brand: wrongValue }, { brand: "number" })).toBe(false);
    });
  });
});
