/**
 * Configuration interface for redenominasi operations
 * 
 * @example
 * // Basic config
 * const config: RedenominasiConfig = {
 *   ratio: 1000,
 *   roundingMode: 'round',
 *   showCurrency: true
 * };
 * 
 * @example
 * // Custom currency symbol
 * const config: RedenominasiConfig = {
 *   currencySymbol: 'IDR',
 *   decimalPlaces: 0
 * };
 */
export interface RedenominasiConfig {
  /** 
   * Conversion ratio for redenomination
   * @default 1000
   * @example
   * // 1:1000 ratio (default)
   * convert(15000, { ratio: 1000 }) // => 15
   * 
   * // 1:100 ratio
   * convert(1500, { ratio: 100 }) // => 15
   */
  ratio?: number;

  /** 
   * Rounding mode for decimal conversions
   * - 'round': Standard rounding (0.5 rounds up)
   * - 'floor': Always round down
   * - 'ceil': Always round up
   * @default 'round'
   */
  roundingMode?: "floor" | "ceil" | "round";

  /** 
   * Number of decimal places to display in formatted output
   * @default 2
   */
  decimalPlaces?: number;

  /** 
   * Whether to show currency symbol in formatted output
   * @default true
   */
  showCurrency?: boolean;

  /** 
   * Currency symbol to display in formatted output
   * @default 'Rp'
   */
  currencySymbol?: string;

  /** 
   * Locale for number formatting
   * @default 'id-ID'
   */
  locale?: string;

  /** 
   * Whether to use thousands separator in formatted output
   * @default true
   */
  useThousandsSeparator?: boolean;

  /**
   * Whether to allow negative values in conversions
   * If false, negative values will return 0
   * @default true
   */
  allowNegative?: boolean;
}

/**
 * Merged configuration with all defaults applied
 * All properties are required (no optional fields)
 */
export interface MergedConfig extends Required<RedenominasiConfig> {}
