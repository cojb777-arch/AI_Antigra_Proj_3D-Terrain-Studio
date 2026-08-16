'use client';

import React, { useState, useEffect } from 'react';
import { Decimal } from 'decimal.js';

interface AmountInputProps {
  value: string | number;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export function AmountInput({
  value,
  onChange,
  className = '',
  placeholder = '0',
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      if (!value || value === '0') {
        setDisplayValue('');
      } else {
        try {
          const d = new Decimal(value);
          setDisplayValue(d.toNumber().toLocaleString());
        } catch {
          setDisplayValue(String(value));
        }
      }
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value ? String(value) : '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    const cleaned = displayValue.replace(/,/g, '').trim();
    if (!cleaned || isNaN(Number(cleaned))) {
      onChange('0');
      setDisplayValue('');
    } else {
      try {
        const d = new Decimal(cleaned);
        onChange(d.toFixed());
        setDisplayValue(d.toNumber().toLocaleString());
      } catch {
        onChange('0');
        setDisplayValue('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.-]/g, '');
    setDisplayValue(raw);
    onChange(raw || '0');
  };

  return (
    <input
      type="text"
      value={isFocused ? displayValue : displayValue || (value ? Number(value).toLocaleString() : '')}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full h-9 px-3 text-right font-mono text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
