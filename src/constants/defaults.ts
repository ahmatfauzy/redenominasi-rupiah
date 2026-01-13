import { MergedConfig } from "../types/config";

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: MergedConfig = {
  ratio: 1000,
  roundingMode: "round",
  decimalPlaces: 2,
  showCurrency: true,
  currencySymbol: "Rp",
  locale: "id-ID",
  useThousandsSeparator: true,
};
