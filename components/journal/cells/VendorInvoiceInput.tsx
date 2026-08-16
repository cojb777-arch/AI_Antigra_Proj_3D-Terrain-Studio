'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Building } from 'lucide-react';

interface VendorInvoiceInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function VendorInvoiceInput({
  value,
  onChange,
  className = '',
}: VendorInvoiceInputProps) {
  const normalized = value ? value.trim().toUpperCase() : '';
  const isValidFormat = /^T\d{13}$/.test(normalized);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    if (val.length === 13 && /^\d{13}$/.test(val)) {
      val = 'T' + val;
    }
    onChange(val);
  };

  return (
    <div className="space-y-1">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="T1234567890123"
          maxLength={14}
          className={`w-full h-8 px-2.5 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        />
        <div className="absolute right-2 flex items-center gap-1 pointer-events-none">
          {isValidFormat ? (
            <span className="flex items-center text-[10px] text-emerald-400 font-semibold gap-0.5 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" />
              適格登録確認済
            </span>
          ) : normalized ? (
            <span className="flex items-center text-[10px] text-amber-400 gap-0.5 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30">
              <AlertCircle className="w-3 h-3" />
              T+13桁
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
