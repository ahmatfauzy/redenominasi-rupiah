/**
 * Configuration interface for redenominasi operations
 */
export interface RedenominasiConfig {
  /** Conversion ratio (default: 1000) */
  ratio?: number;

  /** Rounding mode for conversions */
  roundingMode?: "floor" | "ceil" | "round";

  /** Number of decimal places to display */
  decimalPlaces?: number;

  /** Show currency symbol in formatted output */
  showCurrency?: boolean;

  /** Currency symbol to display */
  currencySymbol?: string;

  /** Locale for number formatting */
  locale?: string;

  /** Use thousands separator */
  useThousandsSeparator?: boolean;
}

/**
 * Merged configuration with defaults applied
 */
export interface MergedConfig extends Required<RedenominasiConfig> {}
