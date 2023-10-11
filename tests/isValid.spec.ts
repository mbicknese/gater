import { isValid } from "../src";

// Need to have a reference for checking equality
const emptyArray = [] as const;
const emptyObject = {} as const;

// A list of values that could cause havoc
const wrongValues: Array<any> = [
  true,
  false,
  emptyArray,
  emptyObject,
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
  describe("logic", () => {
    let untypedComputer: any;
    it("returns a validator function on a single argument", () => {
      expect(typeof isValid({ brand: "string" }) === "function").toBe(true);
    });
    it("returns a boolean when called with two arguments", () => {
      untypedComputer = { brand: 1 };
      expect(isValid({ brand: "string" }, { brand: "Apple" })).toBe(true);
      expect(isValid({ brand: "string" }, untypedComputer)).toBe(false);
    });
    it("can be curried", () => {
      // We're actually testing JavaScript here, but it's good to have the regression and example.
      untypedComputer = { brand: 1 };
      expect(isValid({ brand: "string" })({ brand: "Apple" })).toBe(true);
      expect(isValid({ brand: "string" })(untypedComputer)).toBe(false);
    });
    it("rejects missing fields", () => {
      untypedComputer = { brand: "HP" };
      expect(isValid({ brand: "string", model: "string" }, untypedComputer)).toBe(false);
    });
    it("rejects surplus fields", () => {
      untypedComputer = { brand: "Lenovo", model: "Legion" };
      expect(isValid({ brand: "string" }, untypedComputer)).toBe(false);
    });
    it("validates composite schemas", () => {
      expect(
        isValid(
          { brand: "string", year: "number", latest: "boolean", metadata: "object", tags: "array" },
          { brand: "Apple", year: 2021, latest: false, metadata: { owner: "Maarten" }, tags: ["Silicon"] },
        ),
      ).toBe(true);
    });
  });

  describe("types", () => {
    describe("string fields", () => {
      const stringValidator = isValid({ brand: "string" });

      it("accepts empty string", () => {
        expect(stringValidator({ brand: "" })).toBe(true);
      });
      it("accepts a string with content", () => {
        expect(stringValidator({ brand: "Apple" })).toBe(true);
      });

      it.each(wrongValues.filter((value) => !["Dell", ""].includes(value)))("rejects %s", (wrongValue) => {
        expect(stringValidator({ brand: wrongValue })).toBe(false);
      });
    });

    describe("number fields", () => {
      const numberValidator = isValid({ amount: "number" });

      it("accepts zero", () => {
        expect(numberValidator({ amount: 0 })).toBe(true);
      });
      it("accepts positive integers", () => {
        expect(numberValidator({ amount: 42 })).toBe(true);
      });
      it("accepts negative integers", () => {
        expect(numberValidator({ amount: -42 })).toBe(true);
      });
      it("accepts floats", () => {
        expect(numberValidator({ amount: Math.PI })).toBe(true);
      });
      it("accepts irrational numbers", () => {
        expect(numberValidator({ amount: Math.E })).toBe(true);
      });

      it.each(wrongValues.filter((value) => ![0, -42, Math.PI, Math.E].includes(value)))("rejects %s", (wrongValue) => {
        expect(numberValidator({ amount: wrongValue })).toBe(false);
      });
    });

    describe("boolean fields", () => {
      const booleanValidator = isValid({ pending: "boolean" });

      it("accepts true", () => {
        expect(booleanValidator({ pending: true })).toBe(true);
      });
      it("accepts false", () => {
        expect(booleanValidator({ pending: false })).toBe(true);
      });

      it.each(wrongValues.filter((value) => ![true, false].includes(value)))("rejects %s", (wrongValue) => {
        expect(booleanValidator({ pending: wrongValue })).toBe(false);
      });
    });

    describe("array fields", () => {
      const arrayValidator = isValid({ tags: "array" });

      it("accepts an empty array", () => {
        expect(arrayValidator({ tags: [] })).toBe(true);
      });
      it("accepts an array with mixed values", () => {
        expect(arrayValidator({ tags: [1, "hello", false] })).toBe(true);
      });

      it.each(wrongValues.filter((value) => ![emptyArray].includes(value)))("rejects %s", (wrongValue) => {
        expect(arrayValidator({ tags: wrongValue })).toBe(false);
      });
    });

    describe("Object fields", () => {
      const objectValidator = isValid({ metadata: "object" });

      it("accepts an empty object", () => {
        expect(objectValidator({ metadata: {} })).toBe(true);
      });
      it("accepts an object with mixed values", () => {
        expect(objectValidator({ metadata: { brand: "Apple", amount: 42, pending: false } })).toBe(true);
      });

      it.each(wrongValues.filter((value) => ![emptyObject].includes(value)))("rejects %s", (wrongValue) => {
        expect(objectValidator({ metadata: wrongValue })).toBe(false);
      });
    });
  });
});
