import {
  convert,
  revert,
  convertBulk,
  revertBulk,
  format,
  formatBulk,
  sanitizeInput,
  isValidValue,
  mergeConfig,
  applyRounding,
} from "../core";

describe("Core Redenominasi Functions", () => {
  describe("convert()", () => {
    test("converts 15000 to 15", () => {
      expect(convert(15000)).toBe(15);
    });

    test("converts 500 to 0.5", () => {
      expect(convert(500)).toBe(0.5);
    });

    test("converts 50 to 0.05", () => {
      expect(convert(50)).toBe(0.05);
    });

    test("handles small values correctly", () => {
      expect(convert(1)).toBe(0.001);
    });

    test("applies custom ratio", () => {
      expect(convert(2000, { ratio: 2000 })).toBe(1);
    });

    test("applies floor rounding", () => {
      expect(convert(1555, { roundingMode: "floor" })).toBe(1.55);
    });

    test("applies ceil rounding", () => {
      expect(convert(1556, { roundingMode: "ceil" })).toBe(1.56);
    });

    test("applies default round rounding", () => {
      expect(convert(1555, { roundingMode: "round" })).toBe(1.56);
    });

    test("respects decimal places setting", () => {
      expect(convert(15000, { decimalPlaces: 0 })).toBe(15);
      expect(convert(15000, { decimalPlaces: 3 })).toBe(15);
    });
  });

  describe("revert()", () => {
    test("reverts 15 to 15000", () => {
      expect(revert(15)).toBe(15000);
    });

    test("reverts 0.5 to 500", () => {
      expect(revert(0.5)).toBe(500);
    });

    test("reverts 0.05 to 50", () => {
      expect(revert(0.05)).toBe(50);
    });

    test("applies custom ratio", () => {
      expect(revert(1, { ratio: 2000 })).toBe(2000);
    });
  });

  describe("convertBulk()", () => {
    test("converts multiple values at once", () => {
      const result = convertBulk([15000, 500, 1000]);
      expect(result).toEqual([15, 0.5, 1]);
    });

    test("applies config to all values", () => {
      const result = convertBulk([1000, 2000], { roundingMode: "floor" });
      expect(result).toEqual([1, 2]);
    });

    test("handles empty array", () => {
      expect(convertBulk([])).toEqual([]);
    });
  });

  describe("revertBulk()", () => {
    test("reverts multiple values at once", () => {
      const result = revertBulk([15, 0.5, 1]);
      expect(result).toEqual([15000, 500, 1000]);
    });
  });

  describe("format()", () => {
    test('formats 15000 as "Rp 15.00"', () => {
      expect(format(15000)).toBe("Rp 15.00");
    });

    test('formats 500 as "Rp 0.50"', () => {
      expect(format(500)).toBe("Rp 0.50");
    });

    test("formats without currency symbol", () => {
      expect(format(15000, { config: { showCurrency: false } })).toBe("15.00");
    });

    test("uses custom currency symbol", () => {
      expect(format(15000, { config: { currencySymbol: "IDR" } })).toBe(
        "IDR 15.00"
      );
    });

    test("handles custom prefix and suffix", () => {
      expect(format(15000, { customPrefix: "[", customSuffix: "]" })).toBe(
        "[Rp 15.00]"
      );
    });

    test("formats with 0 decimal places", () => {
      expect(format(15000, { config: { decimalPlaces: 0 } })).toBe("Rp 15");
    });

    test("handles invalid input", () => {
      expect(format(NaN)).toBe("Rp 0.00");
    });
  });

  describe("formatBulk()", () => {
    test("formats multiple values", () => {
      const result = formatBulk([15000, 500, 1000]);
      expect(result).toEqual(["Rp 15.00", "Rp 0.50", "Rp 1.00"]);
    });

    test("applies config to all values", () => {
      const result = formatBulk([15000, 500], {
        config: { showCurrency: false },
      });
      expect(result).toEqual(["15.00", "0.50"]);
    });
  });

  describe("sanitizeInput()", () => {
    test('sanitizes "15000" to 15000', () => {
      expect(sanitizeInput("15000")).toBe(15000);
    });

    test('sanitizes "15,000" to 15000', () => {
      expect(sanitizeInput("15,000")).toBe(15000);
    });

    test('sanitizes "15.000" to 15000', () => {
      expect(sanitizeInput("15.000")).toBe(15000);
    });

    test('sanitizes "Rp 15000" to 15000', () => {
      expect(sanitizeInput("Rp 15000")).toBe(15000);
    });

    test("returns null for invalid input", () => {
      expect(sanitizeInput("abc")).toBeNull();
      expect(sanitizeInput("")).toBeNull();
    });

    test("returns null for non-string input", () => {
      expect(sanitizeInput(null as any)).toBeNull();
    });
  });

  describe("isValidValue()", () => {
    test("returns true for valid numbers", () => {
      expect(isValidValue(15000)).toBe(true);
      expect(isValidValue(0)).toBe(true);
      expect(isValidValue(-100)).toBe(true);
    });

    test("returns false for invalid values", () => {
      expect(isValidValue(NaN)).toBe(false);
      expect(isValidValue(Infinity)).toBe(false);
      expect(isValidValue("15000")).toBe(false);
      expect(isValidValue(null)).toBe(false);
    });
  });

  describe("mergeConfig()", () => {
    test("returns default config when no config provided", () => {
      const config = mergeConfig();
      expect(config.ratio).toBe(1000);
      expect(config.roundingMode).toBe("round");
      expect(config.decimalPlaces).toBe(2);
    });

    test("merges custom config with defaults", () => {
      const config = mergeConfig({ ratio: 2000 });
      expect(config.ratio).toBe(2000);
      expect(config.roundingMode).toBe("round");
    });

    test("partial config override", () => {
      const config = mergeConfig({
        decimalPlaces: 3,
        currencySymbol: "IDR",
      });
      expect(config.decimalPlaces).toBe(3);
      expect(config.currencySymbol).toBe("IDR");
      expect(config.ratio).toBe(1000);
    });
  });

  describe("applyRounding()", () => {
    test("floor rounding", () => {
      expect(applyRounding(1.556, "floor", 2)).toBe(1.55);
    });

    test("ceil rounding", () => {
      expect(applyRounding(1.551, "ceil", 2)).toBe(1.56);
    });

    test("round rounding", () => {
      expect(applyRounding(1.555, "round", 2)).toBe(1.56);
    });

    test("respects decimal places", () => {
      expect(applyRounding(1.5555, "round", 2)).toBe(1.56);
      expect(applyRounding(1.5555, "round", 3)).toBe(1.556);
    });
  });
});
