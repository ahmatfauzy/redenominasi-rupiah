import { RedenominasiConfig, MergedConfig } from "../types/config";
import { DEFAULT_CONFIG } from "../constants/defaults";
import { applyRounding } from "./rounding";

// Internal global config storage
let _globalConfig: Partial<RedenominasiConfig> = {};

/**
 * Set global configuration for all operations
 * @param config - Partial configuration to merge with defaults
 */
export function setGlobalConfig(config: Partial<RedenominasiConfig>): void {
  _globalConfig = { ...config };
}

/**
 * Get current global configuration
 * @returns Current global configuration
 */
export function getGlobalConfig(): Partial<RedenominasiConfig> {
  return { ..._globalConfig };
}

/**
 * Reset global configuration to defaults
 */
export function resetGlobalConfig(): void {
  _globalConfig = {};
}

/**
 * Merge user config with global config and defaults
 * Priority: userConfig > globalConfig > defaults
 * @param userConfig - Optional user-provided configuration
 * @returns Fully merged configuration with all required fields
 */
export function mergeConfig(
  userConfig?: Partial<RedenominasiConfig>
): MergedConfig {
  return {
    ...DEFAULT_CONFIG,
    ..._globalConfig,
    ...userConfig,
  };
}

/**
 * Fix floating point precision issues
 * @param value - Number to fix
 * @param precision - Number of decimal places (default: 10)
 * @returns Fixed number without floating point artifacts
 */
function fixPrecision(value: number, precision: number = 10): number {
  return Number(value.toFixed(precision));
}

/**
 * Convert old nominal (before redenominasi) to new nominal (after redenominasi)
 * Uses global config if set, with local config taking priority
 * 
 * @param oldValue - The old currency value to convert
 * @param config - Optional configuration to override global/default settings
 * @returns Converted value after redenominasi
 * 
 * @example
 * // Basic usage
 * convert(15000) // => 15
 * 
 * @example
 * // With custom ratio
 * convert(2000, { ratio: 2000 }) // => 1
 * 
 * @example
 * // With rounding mode
 * convert(1555, { roundingMode: 'floor' }) // => 1.55
 */
export function convert(
  oldValue: number,
  config?: Partial<RedenominasiConfig>
): number {
  if (!isValidValue(oldValue)) {
    return 0;
  }

  const merged = mergeConfig(config);
  
  // Handle negative values if not allowed
  if (merged.allowNegative === false && oldValue < 0) {
    return 0;
  }

  const converted = oldValue / merged.ratio;
  const effectiveDecimals = Math.abs(converted) < 0.01 && converted !== 0 
    ? 3 
    : merged.decimalPlaces;
  
  return applyRounding(converted, merged.roundingMode, effectiveDecimals);
}

/**
 * Revert new nominal back to old nominal
 * Uses global config if set, with local config taking priority
 * 
 * @param newValue - The new currency value to revert
 * @param config - Optional configuration to override global/default settings
 * @returns Original value before redenominasi
 * 
 * @example
 * // Basic usage
 * revert(15) // => 15000
 * 
 * @example
 * // With custom ratio
 * revert(1, { ratio: 2000 }) // => 2000
 */
export function revert(
  newValue: number,
  config?: Partial<RedenominasiConfig>
): number {
  if (!isValidValue(newValue)) {
    return 0;
  }

  const merged = mergeConfig(config);
  
  // Handle negative values if not allowed
  if (merged.allowNegative === false && newValue < 0) {
    return 0;
  }

  // Fix floating point precision issues
  return fixPrecision(newValue * merged.ratio);
}

/**
 * Convert multiple values at once (optimized for bulk operations)
 * 
 * @param oldValues - Array of old currency values to convert
 * @param config - Optional configuration to override global/default settings
 * @returns Array of converted values
 * 
 * @example
 * convertBulk([15000, 500, 1000]) // => [15, 0.5, 1]
 */
export function convertBulk(
  oldValues: number[],
  config?: Partial<RedenominasiConfig>
): number[] {
  if (!Array.isArray(oldValues)) {
    return [];
  }
  return oldValues.map((value) => convert(value, config));
}

/**
 * Revert multiple values at once
 * 
 * @param newValues - Array of new currency values to revert
 * @param config - Optional configuration to override global/default settings
 * @returns Array of reverted values
 * 
 * @example
 * revertBulk([15, 0.5, 1]) // => [15000, 500, 1000]
 */
export function revertBulk(
  newValues: number[],
  config?: Partial<RedenominasiConfig>
): number[] {
  if (!Array.isArray(newValues)) {
    return [];
  }
  return newValues.map((value) => revert(value, config));
}

/**
 * Validate if a value is a valid number for conversion
 * 
 * @param value - Value to validate
 * @returns True if value is a valid finite number
 * 
 * @example
 * isValidValue(15000) // => true
 * isValidValue(NaN) // => false
 * isValidValue(Infinity) // => false
 * isValidValue("15000") // => false
 */
export function isValidValue(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Sanitize and validate user input string to number
 * Handles various Indonesian number formats including:
 * - Thousands separators with dots (15.000)
 * - Thousands separators with commas (15,000)
 * - Decimal with comma (15,50)
 * - Currency prefix (Rp 15000)
 * 
 * @param input - User input string to sanitize
 * @returns Parsed number or null if invalid
 * 
 * @example
 * sanitizeInput("15.000") // => 15000 (Indonesian thousands separator)
 * sanitizeInput("15,50") // => 15.5 (Indonesian decimal)
 * sanitizeInput("Rp 15000") // => 15000
 * sanitizeInput("abc") // => null
 */
export function sanitizeInput(input: string): number | null {
  if (typeof input !== "string") return null;

  // Remove all non-numeric characters except dots, commas, and minus
  const cleaned = input.replace(/[^\d.,-]/g, "").replace(/^-/, "MINUS").replace(/-/g, "").replace("MINUS", "-");
  if (!cleaned || cleaned === "-") return null;

  const isNegative = cleaned.startsWith("-");
  const absValue = cleaned.replace(/^-/, "");

  const dotCount = (absValue.match(/\./g) || []).length;
  const commaCount = (absValue.match(/,/g) || []).length;

  const lastDot = absValue.lastIndexOf(".");
  const lastComma = absValue.lastIndexOf(",");

  let normalized = absValue;

  // CASE 1: More than one separator → thousands separator
  if (dotCount > 1 || commaCount > 1) {
    normalized = absValue.replace(/[.,]/g, "");
  }
  // CASE 2: One dot only
  else if (dotCount === 1 && commaCount === 0) {
    // Check if it's likely a thousands separator (e.g., 15.000)
    if (absValue.length - lastDot === 4) {
      normalized = absValue.replace(/\./g, "");
    } else {
      // It's a decimal point
      normalized = absValue;
    }
  }
  // CASE 3: One comma only
  else if (commaCount === 1 && dotCount === 0) {
    // Check if it's likely a thousands separator (e.g., 15,000)
    if (absValue.length - lastComma === 4) {
      normalized = absValue.replace(/,/g, "");
    } else {
      // It's a decimal separator (Indonesian style: 15,50)
      normalized = absValue.replace(",", ".");
    }
  }
  // CASE 4: Mixed separators → dot as thousands, comma as decimal (Indonesian: 1.000.000,50)
  else if (dotCount >= 1 && commaCount === 1 && lastComma > lastDot) {
    normalized = absValue.replace(/\./g, "").replace(",", ".");
  }
  // CASE 5: Mixed separators → comma as thousands, dot as decimal (US: 1,000,000.50)
  else if (commaCount >= 1 && dotCount === 1 && lastDot > lastComma) {
    normalized = absValue.replace(/,/g, "");
  }

  const parsed = parseFloat((isNegative ? "-" : "") + normalized);
  return isValidValue(parsed) ? parsed : null;
}
