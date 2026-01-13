import React from "react";
import { RedenominasiConfig } from "../../types/config";
import { format } from "../../core";

interface CurrencyDisplayProps {
  value: number;
  config?: Partial<RedenominasiConfig>;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
  prefix?: string;
  suffix?: string;
}

/**
 * Display formatted currency value
 * Example: <CurrencyDisplay value={15000} /> => "Rp 15.00"
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
