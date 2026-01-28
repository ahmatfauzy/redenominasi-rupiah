/**
 * React integration module for redenominasi-rupiah
 * 
 * This module provides React-specific utilities:
 * - Components: CurrencyDisplay, CurrencyInput
 * - Hooks: useRedenominasi
 * - Context: RedenominasiProvider, useRedenominasiContext
 * 
 * @example
 * // Using the hook
 * import { useRedenominasi } from 'redenominasi-rupiah/react';
 * 
 * function PriceDisplay({ price }) {
 *   const { format } = useRedenominasi();
 *   return <span>{format(price)}</span>;
 * }
 * 
 * @example
 * // Using the component
 * import { CurrencyDisplay } from 'redenominasi-rupiah/react';
 * 
 * function Product({ price }) {
 *   return <CurrencyDisplay value={price} />;
 * }
 * 
 * @example
 * // Using the context provider
 * import { RedenominasiProvider, useRedenominasiContext } from 'redenominasi-rupiah/react';
 * 
 * function App() {
 *   return (
 *     <RedenominasiProvider config={{ showCurrency: true }}>
 *       <MyComponent />
 *     </RedenominasiProvider>
 *   );
 * }
 */

// Components
export { CurrencyDisplay } from './components/CurrencyDisplay';
export { CurrencyInput } from './components/CurrencyInput';

// Hooks
export { useRedenominasi } from './hooks/useRedenominasi';

// Context
export { RedenominasiProvider, useRedenominasiContext } from './context/RedenominasiContext';
