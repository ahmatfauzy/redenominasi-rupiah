import { RedenominasiConfig } from "../types/config";
import { convert, mergeConfig, isValidValue } from "./converter";
import { formatCurrency } from "./formatter";
import { FormatOptions } from "../types";

/**
 * Format old nominal value as currency string
 * Example: format(15000) => "Rp 15.00"
 */
export function format(oldValue: number, options?: FormatOptions): string {
  if (!isValidValue(oldValue)) {
    return options?.config?.showCurrency === false ? "0" : "Rp 0.00";
  }

  const config = mergeConfig(options?.config);
  const converted = convert(oldValue, options?.config);

  return formatCurrency(
    converted,
    config,
    options?.customPrefix,
    options?.customSuffix
  );
}

/**
 * Format multiple values at once
 */
export function formatBulk(
  oldValues: number[],
  options?: FormatOptions
): string[] {
  return oldValues.map((value) => format(value, options));
}
