import React, { useState, useCallback, useEffect } from 'react';
import { RedenominasiConfig } from '../../types/config';
import { sanitizeInput, convert } from '../../core';

/**
 * Props for CurrencyInput component
 */
interface CurrencyInputProps {
  /** Current value (controlled mode) */
  value?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Optional configuration to override defaults */
  config?: Partial<RedenominasiConfig>;
  /** Input placeholder text */
  placeholder?: string;
  /** CSS class name for the input */
  className?: string;
  /** Whether to show conversion preview */
  showPreview?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Input name attribute */
  name?: string;
  /** Input id attribute */
  id?: string;
}

/**
 * Input component for currency values with validation and live preview
 * 
 * Features:
 * - Automatic sanitization of user input
 * - Handles Indonesian number formats (15.000 as 15000)
 * - Optional live preview of converted value
 * - Controlled and uncontrolled modes
 * 
 * @example
 * // Basic usage
 * <CurrencyInput 
 *   value={amount}
 *   onChange={setAmount}
 * />
 * 
 * @example
 * // Without preview
 * <CurrencyInput 
 *   value={amount}
 *   onChange={setAmount}
 *   showPreview={false}
 * />
 * 
 * @example
 * // With custom config
 * <CurrencyInput 
 *   value={amount}
 *   onChange={setAmount}
 *   config={{ ratio: 100 }}
 * />
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChange,
  config,
  placeholder = 'Enter amount',
  className = '',
  showPreview = true,
  disabled = false,
  name,
  id,
}) => {
  const [inputValue, setInputValue] = useState(value ? String(value) : '');

  // Sync input with external value changes
  useEffect(() => {
    if (value !== undefined && value !== sanitizeInput(inputValue)) {
      setInputValue(value ? String(value) : '');
    }
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      setInputValue(input);

      const sanitized = sanitizeInput(input);
      if (sanitized !== null && onChange) {
        onChange(sanitized);
      } else if (input === '' && onChange) {
        onChange(0);
      }
    },
    [onChange]
  );

  const preview = value > 0 ? convert(value, config) : 0;

  return (
    <div className="currency-input-wrapper">
      <input
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        aria-label={placeholder}
        inputMode="decimal"
      />
      {showPreview && value > 0 && (
        <div className="currency-preview" aria-live="polite">
          Preview: Rp {preview.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
        </div>
      )}
    </div>
  );
};

