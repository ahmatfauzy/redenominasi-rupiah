import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { RedenominasiConfig } from "../../types/config";

/**
 * Context type definition
 */
interface RedenominasiContextType {
  /** Current configuration for redenominasi operations */
  config: Partial<RedenominasiConfig>;
}

/**
 * Context for providing redenominasi config to child components
 * @internal
 */
const RedenominasiContext = createContext<RedenominasiContextType | undefined>(
  undefined
);

/**
 * Props for RedenominasiProvider
 */
interface RedenominasiProviderProps {
  /** Optional configuration to provide to all children */
  config?: Partial<RedenominasiConfig>;
  /** Child components */
  children: ReactNode;
}

/**
 * Provider component for redenominasi configuration
 * 
 * Wrap your application or component tree with this provider to share
 * configuration across all redenominasi components.
 * 
 * @example
 * // Basic usage
 * <RedenominasiProvider config={{ showCurrency: true }}>
 *   <App />
 * </RedenominasiProvider>
 * 
 * @example
 * // Custom configuration
 * <RedenominasiProvider 
 *   config={{ 
 *     currencySymbol: 'IDR',
 *     decimalPlaces: 0,
 *     ratio: 1000 
 *   }}
 * >
 *   <PriceList />
 * </RedenominasiProvider>
 */
export const RedenominasiProvider: React.FC<RedenominasiProviderProps> = ({
  config = {},
  children,
}) => {
  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ config }), [config]);

  return (
    <RedenominasiContext.Provider value={value}>
      {children}
    </RedenominasiContext.Provider>
  );
};

/**
 * Hook to access redenominasi context
 * 
 * Must be used within a RedenominasiProvider.
 * 
 * @throws Error if used outside of RedenominasiProvider
 * @returns Context containing current configuration
 * 
 * @example
 * function PriceComponent() {
 *   const { config } = useRedenominasiContext();
 *   // Use config for operations...
 * }
 */
export function useRedenominasiContext(): RedenominasiContextType {
  const context = useContext(RedenominasiContext);
  if (!context) {
    throw new Error(
      "useRedenominasiContext must be used within a RedenominasiProvider"
    );
  }
  return context;
}

