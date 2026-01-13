import { useMemo } from "react";
import { RedenominasiConfig, MergedConfig } from "../../types/config";
import {
  convert,
  revert,
  convertBulk,
  revertBulk,
  format,
  formatBulk,
  sanitizeInput,
  mergeConfig,
} from "../../core";

interface UseRedenominasiReturn {
  convert: (value: number) => number;
  revert: (value: number) => number;
  convertBulk: (values: number[]) => number[];
  revertBulk: (values: number[]) => number[];
  format: (value: number) => string;
  formatBulk: (values: number[]) => string[];
  sanitizeInput: (input: string) => number | null;
  config: MergedConfig;
}

/**
 * Main React hook for redenominasi operations
 */
export function useRedenominasi(
  config?: Partial<RedenominasiConfig>
): UseRedenominasiReturn {
  const mergedConfig = useMemo(() => mergeConfig(config), [config]);

  return useMemo(
    () => ({
      convert: (value: number) => convert(value, config),
      revert: (value: number) => revert(value, config),
      convertBulk: (values: number[]) => convertBulk(values, config),
      revertBulk: (values: number[]) => revertBulk(values, config),
      format: (value: number) => format(value, { config }),
      formatBulk: (values: number[]) => formatBulk(values, { config }),
      sanitizeInput,
      config: mergedConfig,
    }),
    [config]
  );
}
