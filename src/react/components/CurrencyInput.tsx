import React, { useState, useCallback } from 'react';
import { RedenominasiConfig } from '../../types/config';
import { sanitizeInput, convert } from '../../core';

interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  config?: Partial<RedenominasiConfig>;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
  disabled?: boolean;
}

/**
 * Input component for currency values with validation
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value = 0,
  onChange,
  config,
  placeholder = 'Enter amount',
  className = '',
  showPreview = true,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState(String(value));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = (e.target as HTMLInputElement).value;
      setInputValue(input);

      const sanitized = sanitizeInput(input);
      if (sanitized !== null && onChange) {
        onChange(sanitized);
      }
    },
    [onChange]
  );

  const preview = value > 0 ? convert(value, config) : 0;

  return (
    <div className="currency-input-wrapper">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
      {showPreview && (
        <div className="currency-preview">
          Preview: Rp {preview.toLocaleString('id-ID')}
        </div>
      )}
    </div>
  );
};
