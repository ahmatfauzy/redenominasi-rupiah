import { MergedConfig } from "../types/config";

/**
 * Default configuration values for redenominasi operations
 * 
 * These defaults follow the Indonesian Rupiah redenomination proposal:
 * - 1:1000 ratio (Rp 15.000 becomes Rp 15)
 * - Standard rounding
 * - 2 decimal places
 * - "Rp" currency symbol
 * - Indonesian locale formatting
 */
export const DEFAULT_CONFIG: MergedConfig = {
  /** Default ratio is 1:1000 as per redenomination proposal */
  ratio: 1000,
  
  /** Standard rounding (0.5 rounds up) */
  roundingMode: "round",
  
  /** 2 decimal places for new currency (e.g., Rp 15.00) */
  decimalPlaces: 2,
  
  /** Show currency symbol by default */
  showCurrency: true,
  
  /** Indonesian Rupiah symbol */
  currencySymbol: "Rp",
  
  /** Indonesian locale for number formatting */
  locale: "id-ID",
  
  /** Use thousands separator for readability */
  useThousandsSeparator: true,
  
  /** Allow negative values by default */
  allowNegative: true,
};
