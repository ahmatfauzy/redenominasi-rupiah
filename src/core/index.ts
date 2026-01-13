import type { RedenominasiConfig } from '../types/config';

export * from './converter';
export * from './formatter-main';
export * from './rounding';
export * from './formatter';

let globalConfig: Partial<RedenominasiConfig> = {};

/**
 * Set global configuration for all operations
 */
export function setGlobalConfig(config: Partial<RedenominasiConfig>): void {
  globalConfig = { ...config };
}

/**
 * Get current global configuration
 */
export function getGlobalConfig(): Partial<RedenominasiConfig> {
  return { ...globalConfig };
}

/**
 * Reset global configuration to defaults
 */
export function resetGlobalConfig(): void {
  globalConfig = {};
}
