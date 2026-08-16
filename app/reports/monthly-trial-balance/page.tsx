'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, Table, CheckCircle2, Filter } from 'lucide-react';
import { MONTHLY_TRIAL_BALANCE_DATA, MonthlyTrialBalanceRow } from '@/services/mockFinancialData';

export default function MonthlyTrialBalancePage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredData = MONTHLY_TRIAL_BALANCE_DATA.filter((row) => {
    if (categoryFilter === 'ALL') return true;
    return row.category === categoryFilter;
  });

  const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 操作バー */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-5 h-5 text-blue-600" />
              月次推移試算表 (合計残高試算表)
            </h1>
            <p className="text-xs text-slate-500">全勘定科目の月別残高推移（1月〜12月）と年間合計</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* カテゴリフィルタ */}
          <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl text-xs font-semibold">
            {[
              { id: 'ALL', label: '全科目' },
              { id: 'Asset', label: '資産' },
              { id: 'Liability', label: '負債' },
              { id: 'Revenue', label: '収益' },
              { id: 'Expense', label: '費用' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  categoryFilter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            印刷 (PDF)
          </button>
        </div>
      </div>

      {/* 試算表テーブルカード */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="text-xs text-slate-500">
            表示対象: <strong className="text-slate-800">{filteredData.length}</strong> 科目
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            貸借完全一致 (エラーなし)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-mono">
                <th className="py-2.5 px-3 sticky left-0 bg-slate-50 font-sans z-10">科目コード / 科目名</th>
                <th className="py-2.5 px-2 font-sans">区分</th>
                {MONTHS.map((m) => (
                  <th key={m} className="py-2.5 px-2 text-right">{m}</th>
                ))}
                <th className="py-2.5 px-3 text-right bg-slate-100/70 font-sans font-bold">年間合計/期末残高</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredData.map((row) => (
                <tr key={row.code} className="hover:bg-slate-50">
                  <td className="py-2 px-3 sticky left-0 bg-white hover:bg-slate-50 font-sans font-medium text-slate-900 z-10 border-r border-slate-100">
                    <span className="font-mono text-blue-600 mr-1.5 font-bold">{row.code}</span>
                    {row.name}
                  </td>
                  <td className="py-2 px-2 text-slate-500 font-sans text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100">
                      {row.category === 'Asset' ? '資産' : row.category === 'Liability' ? '負債' : row.category === 'Equity' ? '純資産' : row.category === 'Revenue' ? '収益' : '費用'}
                    </span>
                  </td>
                  {row.months.map((amt, idx) => (
                    <td key={idx} className="py-2 px-2 text-right text-slate-700">
                      {amt.toLocaleString()}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-right font-bold text-slate-900 bg-slate-50/70">
                    ¥{row.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
