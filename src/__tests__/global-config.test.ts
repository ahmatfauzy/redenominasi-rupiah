import {
  setGlobalConfig,
  getGlobalConfig,
  resetGlobalConfig,
  convert,
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
});
