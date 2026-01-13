import { RedenominasiConfig } from './config';

export * from './config';

export interface FormatOptions {
  config?: Partial<RedenominasiConfig>;
  customPrefix?: string;
  customSuffix?: string;
}
