import {
  setGlobalConfig,
  getGlobalConfig,
  resetGlobalConfig,
  convert,
  revert,
  format,
} from "../core";

describe("Global Configuration", () => {
  afterEach(() => {
    resetGlobalConfig();
  });

  describe("setGlobalConfig() / getGlobalConfig()", () => {
    test("sets and retrieves global config", () => {
      setGlobalConfig({ ratio: 2000, decimalPlaces: 3 });
      const config = getGlobalConfig();

      expect(config.ratio).toBe(2000);
      expect(config.decimalPlaces).toBe(3);
    });

    test("returns new object (not reference)", () => {
      const config1 = { ratio: 2000 };
      setGlobalConfig(config1);
      const retrieved = getGlobalConfig();

      retrieved.ratio = 3000;
      const config2 = getGlobalConfig();

      expect(config2.ratio).toBe(2000);
    });

    test("updates global config correctly", () => {
      setGlobalConfig({ ratio: 1000 });
      expect(getGlobalConfig().ratio).toBe(1000);

      setGlobalConfig({ ratio: 2000 });
      expect(getGlobalConfig().ratio).toBe(2000);
    });
  });

  describe("resetGlobalConfig()", () => {
    test("resets to empty config", () => {
      setGlobalConfig({ ratio: 2000 });
      resetGlobalConfig();

      expect(getGlobalConfig()).toEqual({});
    });

    test("uses default values after reset", () => {
      setGlobalConfig({ ratio: 2000 });
      resetGlobalConfig();

      const result = convert(15000);
      expect(result).toBe(15);
    });
  });

  describe("Global Config Integration", () => {
    test("convert() uses global config", () => {
      setGlobalConfig({ ratio: 2000 });
      expect(convert(2000)).toBe(1);
    });

    test("revert() uses global config", () => {
      setGlobalConfig({ ratio: 2000 });
      expect(revert(1)).toBe(2000);
    });

    test("format() uses global config", () => {
      setGlobalConfig({ currencySymbol: "IDR", showCurrency: true });
      expect(format(15000)).toBe("IDR 15.00");
    });

    test("local config overrides global config", () => {
      setGlobalConfig({ ratio: 2000 });
      // Local config should take priority
      expect(convert(3000, { ratio: 3000 })).toBe(1);
    });

    test("global config with decimal places", () => {
      setGlobalConfig({ decimalPlaces: 0 });
      expect(format(15000)).toBe("Rp 15");
    });
  });

  describe("Negative Values", () => {
    test("allows negative values by default", () => {
      expect(convert(-15000)).toBe(-15);
      expect(revert(-15)).toBe(-15000);
    });

    test("rejects negative values when allowNegative is false", () => {
      setGlobalConfig({ allowNegative: false });
      expect(convert(-15000)).toBe(0);
      expect(revert(-15)).toBe(0);
    });

    test("local allowNegative overrides global", () => {
      setGlobalConfig({ allowNegative: true });
      expect(convert(-15000, { allowNegative: false })).toBe(0);
    });
  });

  describe("Floating Point Precision", () => {
    test("revert handles floating point precision correctly", () => {
      // This would cause 50.00000000000001 without fix
      expect(revert(0.05)).toBe(50);
    });

    test("revert handles common precision issues", () => {
      expect(revert(0.1)).toBe(100);
      expect(revert(0.01)).toBe(10);
      expect(revert(1.5)).toBe(1500);
    });
  });

  describe("Invalid Input Handling", () => {
    test("convert returns 0 for NaN", () => {
      expect(convert(NaN)).toBe(0);
    });

    test("convert returns 0 for Infinity", () => {
      expect(convert(Infinity)).toBe(0);
    });

    test("revert returns 0 for NaN", () => {
      expect(revert(NaN)).toBe(0);
    });

    test("revert returns 0 for Infinity", () => {
      expect(revert(Infinity)).toBe(0);
    });
  });
});

