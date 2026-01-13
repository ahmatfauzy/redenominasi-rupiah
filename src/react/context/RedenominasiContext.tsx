import React, { createContext, useContext, ReactNode } from "react";
import { RedenominasiConfig } from "../../types/config";

interface RedenominasiContextType {
  config: Partial<RedenominasiConfig>;
}

/**
 * Context for providing redenominasi config to child components
 */
const RedenominasiContext = createContext<RedenominasiContextType | undefined>(
  undefined
);

interface RedenominasiProviderProps {
  config?: Partial<RedenominasiConfig>;
  children: ReactNode;
}

/**
 * Provider component for redenominasi configuration
 */
export const RedenominasiProvider: React.FC<RedenominasiProviderProps> = ({
  config = {},
  children,
}) => {
  return (
    <RedenominasiContext.Provider value={{ config }}>
      {children}
    </RedenominasiContext.Provider>
  );
};

/**
 * Hook to use redenominasi context
 */
export function useRedenominasiContext(): RedenominasiContextType {
  const context = useContext(RedenominasiContext);
  if (!context) {
    throw new Error(
      "useRedenominasiContext must be used within RedenominasiProvider"
    );
  }
  return context;
}
