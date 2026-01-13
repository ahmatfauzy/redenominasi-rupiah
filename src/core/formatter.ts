import { MergedConfig } from "../types/config";
import { applyRounding } from "./rounding";

/**
 * Format a number with thousands separator and locale
 * Force decimal point as "." regardless of locale
 */
function formatNumberWithLocale(
  value: number,
  locale: string,
  decimalPlaces: number,
  useThousandsSeparator: boolean
): string {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: useThousandsSeparator,
  };

  // Use 'en-US' locale to force decimal point as "." instead of ","
  const formatted = new Intl.NumberFormat("en-US", options).format(value);
  return formatted;
}

/**
 * Format number as currency string
 */
export function formatCurrency(
  value: number,
  config: MergedConfig,
  prefix?: string,
  suffix?: string
): string {
  const formattedNumber = formatNumberWithLocale(
    value,
    config.locale,
    config.decimalPlaces,
    config.useThousandsSeparator
  );

  if (!config.showCurrency) {
    return `${prefix || ""}${formattedNumber}${suffix || ""}`;
  }

  const currencyPart = `${config.currencySymbol} `;
  return `${prefix || ""}${currencyPart}${formattedNumber}${suffix || ""}`;
}
