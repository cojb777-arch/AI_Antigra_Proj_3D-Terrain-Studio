'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MONTHLY_CASHFLOW_DATA } from '@/services/mockFinancialData';

export default function CashflowPage() {
  const [viewMode, setViewMode] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');

  // 年間合計の集計
  const totalOperatingCf = MONTHLY_CASHFLOW_DATA.reduce((acc, cur) => acc + cur.operatingCf, 0);
  const totalInvestingCf = MONTHLY_CASHFLOW_DATA.reduce((acc, cur) => acc + cur.investingCf, 0);
  const totalFinancingCf = MONTHLY_CASHFLOW_DATA.reduce((acc, cur) => acc + cur.financingCf, 0);
  const totalNetChange = totalOperatingCf + totalInvestingCf + totalFinancingCf;
  const endingCash = MONTHLY_CASHFLOW_DATA[MONTHLY_CASHFLOW_DATA.length - 1].endingCash;
  const beginningCash = endingCash - totalNetChange;

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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
              <DollarSign className="w-5 h-5 text-emerald-600" />
              キャッシュフロー計算書 (C/F)
            </h1>
            <p className="text-xs text-slate-500">営業・投資・財務活動による現預金の増減および月次推移</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-200 p-1 rounded-xl flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('ANNUAL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'ANNUAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              年間サマリー (間接法)
            </button>
            <button
              onClick={() => setViewMode('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'MONTHLY' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              月次推移表 (1月〜12月)
            </button>
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

      {/* サマリーカード 4選 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">営業活動によるCF</span>
          <p className="text-2xl font-mono font-bold text-emerald-600">+{fmt(totalOperatingCf)}</p>
          <span className="text-[11px] text-slate-400">本業のキャッシュ創出力（順調）</span>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">投資活動によるCF</span>
          <p className="text-2xl font-mono font-bold text-slate-700">{fmt(totalInvestingCf)}</p>
          <span className="text-[11px] text-slate-400">設備・IT投資支出</span>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">財務活動によるCF</span>
          <p className="text-2xl font-mono font-bold text-slate-700">{fmt(totalFinancingCf)}</p>
          <span className="text-[11px] text-slate-400">借入金返済支出</span>
        </div>
        <div className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-emerald-800 font-medium">期末現預金残高</span>
          <p className="text-2xl font-mono font-bold text-emerald-950">{fmt(endingCash)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">年間純増: +{fmt(totalNetChange)}</span>
        </div>
      </div>

      {/* メイン帳票コンテンツ */}
      {viewMode === 'ANNUAL' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="text-center border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-wider">キャ ッ シ ュ ・ フ ロ ー 計 算 書</h2>
            <p className="text-xs text-slate-500 mt-1">2026年度（自 2026年1月1日 至 2026年12月31日）</p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-700">
                  <th className="py-2 text-left font-bold">区分・項目</th>
                  <th className="py-2 text-right font-bold w-40">金額 (円)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {/* 営業活動 */}
                <tr className="bg-slate-50 font-sans font-bold">
                  <td className="py-2.5 px-1 text-slate-900">Ⅰ 営業活動によるキャッシュ・フロー</td>
                  <td className="py-2.5 px-1 text-right text-emerald-700">{fmt(totalOperatingCf)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">税引前当期純利益</td>
                  <td className="py-2 text-right text-slate-800">4,800,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">減価償却費（非資金費用加算）</td>
                  <td className="py-2 text-right text-slate-800">1,200,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">売上債権の増減額（△は増加）</td>
                  <td className="py-2 text-right text-slate-800">△ 500,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">棚卸資産の増減額（△は増加）</td>
                  <td className="py-2 text-right text-slate-800">△ 250,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">仕入債務の増減額</td>
                  <td className="py-2 text-right text-slate-800">450,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">法人税等の支払額</td>
                  <td className="py-2 text-right text-slate-800">△ 2,510,000</td>
                </tr>

                {/* 投資活動 */}
                <tr className="bg-slate-50 font-sans font-bold">
                  <td className="py-2.5 px-1 text-slate-900">Ⅱ 投資活動によるキャッシュ・フロー</td>
                  <td className="py-2.5 px-1 text-right text-rose-700">△ {fmt(Math.abs(totalInvestingCf))}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">有形固定資産（PC・什器等）の取得による支出</td>
                  <td className="py-2 text-right text-slate-800">△ 1,600,000</td>
                </tr>

                {/* 財務活動 */}
                <tr className="bg-slate-50 font-sans font-bold">
                  <td className="py-2.5 px-1 text-slate-900">Ⅲ 財務活動によるキャッシュ・フロー</td>
                  <td className="py-2.5 px-1 text-right text-rose-700">△ {fmt(Math.abs(totalFinancingCf))}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 font-sans text-slate-600">長期借入金の返済による支出</td>
                  <td className="py-2 text-right text-slate-800">△ 2,400,000</td>
                </tr>

                {/* 現金純増減 */}
                <tr className="border-t-2 border-slate-900 font-sans font-bold bg-slate-100">
                  <td className="py-2.5 px-1 text-slate-900">Ⅳ 現金及び現金同等物の純増減額</td>
                  <td className="py-2.5 px-1 text-right text-emerald-700">{fmt(totalNetChange)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 font-sans text-slate-600">Ⅴ 現金及び現金同等物の期首残高</td>
                  <td className="py-2 text-right text-slate-800">{fmt(beginningCash)}</td>
                </tr>
                <tr className="border-t-2 border-b-2 border-slate-900 font-sans font-bold bg-emerald-50 text-emerald-950">
                  <td className="py-3 px-1 text-sm">Ⅵ 現金及び現金同等物の期末残高</td>
                  <td className="py-3 px-1 text-right text-sm">{fmt(endingCash)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 月次推移表 */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">月次キャッシュフロー推移表 (2026年)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">月度</th>
                  <th className="py-2.5 px-3 text-right">営業CF</th>
                  <th className="py-2.5 px-3 text-right">投資CF</th>
                  <th className="py-2.5 px-3 text-right">財務CF</th>
                  <th className="py-2.5 px-3 text-right">月間純増減</th>
                  <th className="py-2.5 px-3 text-right font-bold">月末現預金残高</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {MONTHLY_CASHFLOW_DATA.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{row.month}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600">+{row.operatingCf.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{row.investingCf === 0 ? '-' : row.investingCf.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{row.financingCf.toLocaleString()}</td>
                    <td className={`py-2.5 px-3 text-right font-bold ${row.netChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {row.netChange >= 0 ? `+${row.netChange.toLocaleString()}` : row.netChange.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{row.endingCash.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
