import { useMemo, useCallback } from "react";
import { RedenominasiConfig, MergedConfig } from "../../types/config";
import {
  convert as coreConvert,
  revert as coreRevert,
  convertBulk as coreConvertBulk,
  revertBulk as coreRevertBulk,
  format as coreFormat,
  formatBulk as coreFormatBulk,
  sanitizeInput,
  mergeConfig,
} from "../../core";

/**
 * Return type for useRedenominasi hook
 */
interface UseRedenominasiReturn {
  /** Convert old nominal to new nominal */
  convert: (value: number) => number;
  /** Revert new nominal back to old nominal */
  revert: (value: number) => number;
  /** Convert multiple values at once */
  convertBulk: (values: number[]) => number[];
  /** Revert multiple values at once */
  revertBulk: (values: number[]) => number[];
  /** Format value as currency string */
  format: (value: number) => string;
  /** Format multiple values as currency strings */
  formatBulk: (values: number[]) => string[];
  /** Sanitize user input string to number */
  sanitizeInput: (input: string) => number | null;
  /** Current merged configuration */
  config: MergedConfig;
}

/**
 * Main React hook for redenominasi operations
 * 
 * Provides memoized conversion and formatting functions based on configuration.
 * The hook will re-compute functions only when config changes.
 * 
 * @param config - Optional partial configuration to override defaults
 * @returns Object containing conversion functions and current config
 * 
 * @example
 * // Basic usage
 * const { convert, format } = useRedenominasi();
 * const newValue = convert(15000); // => 15
 * const formatted = format(15000); // => "Rp 15.00"
 * 
 * @example
 * // With custom config
 * const { convert, format } = useRedenominasi({ 
 *   showCurrency: false,
 *   decimalPlaces: 0 
 * });
 * const formatted = format(15000); // => "15"
 * 
 * @example
 * // Bulk operations
 * const { convertBulk, formatBulk } = useRedenominasi();
 * const prices = [15000, 25000, 50000];
 * const newPrices = convertBulk(prices); // => [15, 25, 50]
 */
export function useRedenominasi(
  config?: Partial<RedenominasiConfig>
): UseRedenominasiReturn {
  // Memoize the merged config
  const mergedConfig = useMemo(() => mergeConfig(config), [config]);

  // Memoize individual functions to prevent unnecessary re-renders
  const convert = useCallback(
    (value: number) => coreConvert(value, config),
    [config]
  );

  const revert = useCallback(
    (value: number) => coreRevert(value, config),
    [config]
  );

  const convertBulk = useCallback(
    (values: number[]) => coreConvertBulk(values, config),
    [config]
  );

  const revertBulk = useCallback(
    (values: number[]) => coreRevertBulk(values, config),
    [config]
  );

  const format = useCallback(
    (value: number) => coreFormat(value, { config }),
    [config]
  );

  const formatBulk = useCallback(
    (values: number[]) => coreFormatBulk(values, { config }),
    [config]
  );

  return useMemo(
    () => ({
      convert,
      revert,
      convertBulk,
      revertBulk,
      format,
      formatBulk,
      sanitizeInput,
      config: mergedConfig,
    }),
    [convert, revert, convertBulk, revertBulk, format, formatBulk, mergedConfig]
  );
}
