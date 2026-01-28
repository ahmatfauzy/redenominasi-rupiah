import React from "react";
import { RedenominasiConfig } from "../../types/config";
import { format } from "../../core";

/**
 * Props for CurrencyDisplay component
 */
interface CurrencyDisplayProps {
  /** The old nominal value to convert and display */
  value: number;
  /** Optional configuration to override defaults */
  config?: Partial<RedenominasiConfig>;
  /** CSS class name for styling */
  className?: string;
  /** HTML element to render as (default: 'span') */
  as?: keyof HTMLElementTagNameMap;
  /** Custom prefix before the formatted value */
  prefix?: string;
  /** Custom suffix after the formatted value */
  suffix?: string;
}

/**
 * Display formatted currency value after redenomination
 * 
 * This component converts an old nominal value to the new denominated value
 * and displays it with proper currency formatting.
 * 
 * @example
 * // Basic usage
 * <CurrencyDisplay value={15000} /> // Renders: "Rp 15.00"
 * 
 * @example
 * // Without currency symbol
 * <CurrencyDisplay 
 *   value={15000} 
 *   config={{ showCurrency: false }} 
 * /> // Renders: "15.00"
 * 
 * @example
 * // As different HTML element with custom styling
 * <CurrencyDisplay 
 *   value={15000} 
 *   as="div" 
 *   className="price-tag" 
 * />
 * 
 * @example
 * // With prefix and suffix
 * <CurrencyDisplay 
 *   value={15000} 
 *   prefix="Harga: " 
 *   suffix=" /item" 
 * /> // Renders: "Harga: Rp 15.00 /item"
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  config,
  className = "",
  as: Component = "span",
  prefix,
  suffix,
}) => {
  const formatted = format(value, {
    config,
    customPrefix: prefix,
    customSuffix: suffix,
  });

  return React.createElement(Component as any, { className }, formatted);
};

