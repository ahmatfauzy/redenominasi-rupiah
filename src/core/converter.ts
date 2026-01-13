import { RedenominasiConfig, MergedConfig } from "../types/config";
import { DEFAULT_CONFIG } from "../constants/defaults";
import { applyRounding } from "./rounding";

/**
 * Merge user config with defaults
 */
export function mergeConfig(
  userConfig?: Partial<RedenominasiConfig>
): MergedConfig {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
}

/**
 * Convert old nominal (before redenominasi) to new nominal (after redenominasi)
 * Example: convert(15000) => 15
 */
export function convert(
  oldValue: number,
  config?: Partial<RedenominasiConfig>
): number {
  const merged = mergeConfig(config);
  const converted = oldValue / merged.ratio;
  const effectiveDecimals = converted < 0.01 ? 3 : merged.decimalPlaces;
  return applyRounding(converted, merged.roundingMode, effectiveDecimals);
}

/**
 * Revert new nominal back to old nominal
 * Example: revert(15) => 15000
 */
export function revert(
  newValue: number,
  config?: Partial<RedenominasiConfig>
): number {
  const merged = mergeConfig(config);
  return newValue * merged.ratio;
}

/**
 * Convert multiple values at once (optimized for bulk operations)
 */
export function convertBulk(
  oldValues: number[],
  config?: Partial<RedenominasiConfig>
): number[] {
  return oldValues.map((value) => convert(value, config));
}

/**
 * Revert multiple values at once
 */
export function revertBulk(
  newValues: number[],
  config?: Partial<RedenominasiConfig>
): number[] {
  return newValues.map((value) => revert(value, config));
}

/**
 * Validate if a value is a valid number for conversion
 */
export function isValidValue(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Sanitize and validate user input
 * Improved logic to handle thousands separators (both . and ,) correctly
 */
export function sanitizeInput(input: string): number | null {
  if (typeof input !== "string") return null;

  const cleaned = input.replace(/[^\d.,]/g, "");
  if (!cleaned) return null;

  const dotCount = (cleaned.match(/\./g) || []).length;
  const commaCount = (cleaned.match(/,/g) || []).length;

  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  let normalized = cleaned;

  // CASE 1: More than one separator → thousands separator
  if (dotCount > 1 || commaCount > 1) {
    normalized = cleaned.replace(/[.,]/g, "");
  }
  // CASE 2: One separator
  else if (dotCount === 1 && commaCount === 0) {
    if (cleaned.length - lastDot === 4) {
      normalized = cleaned.replace(/\./g, "");
    } else {
      normalized = cleaned.replace(".", ".");
    }
  } else if (commaCount === 1 && dotCount === 0) {
    if (cleaned.length - lastComma === 4) {
      normalized = cleaned.replace(/,/g, "");
    } else {
      normalized = cleaned.replace(",", ".");
    }
  }
  // CASE 3: Mixed separators → treat dot as thousands, comma as decimal
  else if (dotCount === 1 && commaCount === 1) {
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  }

  const parsed = parseFloat(normalized);
  return isValidValue(parsed) ? parsed : null;
}
