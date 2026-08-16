'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ACCOUNT_MASTERS, AccountMaster } from '@/services/mockAccountingData';
import { ChevronDown, Search, Check } from 'lucide-react';

interface AccountComboboxProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function AccountCombobox({
  value,
  onChange,
  className = '',
}: AccountComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedAccount = ACCOUNT_MASTERS.find((a) => a.code === value);

  const filteredAccounts = ACCOUNT_MASTERS.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.code.includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.kana.includes(q)
    );
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-9 px-3 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded text-xs text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {selectedAccount ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-blue-400 font-bold">{selectedAccount.code}</span>
            <span>{selectedAccount.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">勘定科目を選択</span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-64 flex flex-col">
          <div className="p-2 border-b border-slate-800 flex items-center gap-2 bg-slate-950">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="コード・科目名・ひらがなで検索..."
              autoFocus
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>

          <div className="overflow-y-auto flex-1 p-1 space-y-0.5">
            {filteredAccounts.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">
                該当する科目がありません
              </div>
            ) : (
              filteredAccounts.map((account) => {
                const isSelected = account.code === value;
                return (
                  <button
                    key={account.code}
                    type="button"
                    onClick={() => {
                      onChange(account.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-600/30 text-blue-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-400 font-semibold">{account.code}</span>
                      <span>{account.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
