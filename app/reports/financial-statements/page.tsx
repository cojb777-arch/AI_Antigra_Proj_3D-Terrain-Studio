'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, FileText, BarChart3 } from 'lucide-react';

export default function FinancialStatementsPage() {
  const [activeTab, setActiveTab] = useState<'PL' | 'BS'>('PL');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 操作バー */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            決算書レポート (B/S・P/L)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-200 p-1 rounded-xl flex gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('PL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'PL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              損益計算書 (P/L)
            </button>
            <button
              onClick={() => setActiveTab('BS')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'BS'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              貸借対照表 (B/S)
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            帳票印刷 (PDF出力)
          </button>
        </div>
      </div>

      {/* 決算書帳票カード */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        {/* 帳票ヘッダー */}
        <div className="text-center border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-wider">
            {activeTab === 'PL' ? '損 益 計 算 書' : '貸 借 対 照 表'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            自 2026年01月01日 至 2026年12月31日 （株式会社サンプル商事）
          </p>
        </div>

        {activeTab === 'PL' ? (
          /* 損益計算書 (P/L) */
          <div className="space-y-4 text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-700">
                  <th className="py-2 text-left font-bold">勘定科目区分</th>
                  <th className="py-2 text-right font-bold w-36">金額 (円)</th>
                  <th className="py-2 text-right font-bold w-36">合計 (円)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {/* Ⅰ 売上高 */}
                <tr className="bg-slate-50 font-sans font-bold">
                  <td className="py-2.5 px-1" colSpan={2}>Ⅰ 売上高</td>
                  <td className="py-2.5 px-1 text-right text-slate-900">24,200,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 text-slate-600 font-sans">売上高 (411)</td>
                  <td className="py-2 text-right text-slate-800">24,200,000</td>
                  <td className="py-2"></td>
                </tr>

                {/* Ⅱ 売上原価 */}
                <tr className="bg-slate-50 font-sans font-bold">
                  <td className="py-2.5 px-1" colSpan={2}>Ⅱ 売上原価</td>
                  <td className="py-2.5 px-1 text-right text-slate-900">8,470,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 text-slate-600 font-sans">仕入高 (511)</td>
                  <td className="py-2 text-right text-slate-800">4,070,000</td>
                  <td className="py-2"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 text-slate-600 font-sans">外注費 (512)</td>
                  <td className="py-2 text-right text-slate-800">4,400,000</td>
                  <td className="py-2"></td>
                </tr>

                {/* 売上総利益 */}
                <tr className="border-t border-b border-slate-300 font-sans font-bold bg-blue-50/50">
                  <td className="py-2.5 px-1 text-blue-900">売上総利益 (粗利益)</td>
                  <td className="py-2.5"></td>
                  <td className="py-2.5 px-1 text-right text-blue-900">15,730,000</td>
                </tr>

                {/* Ⅲ 販売費及び一般管理費 */}
                <tr className="bg-slate-50 font-sans font-bold">
                  <td className="py-2.5 px-1" colSpan={2}>Ⅲ 販売費及び一般管理費</td>
                  <td className="py-2.5 px-1 text-right text-slate-900">9,680,000</td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 text-slate-600 font-sans">給料手当 (526)</td>
                  <td className="py-2 text-right text-slate-800">5,000,000</td>
                  <td className="py-2"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 text-slate-600 font-sans">地代家賃 (525)</td>
                  <td className="py-2 text-right text-slate-800">3,500,000</td>
                  <td className="py-2"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-6 text-slate-600 font-sans">旅費交通費・会議費・通信費</td>
                  <td className="py-2 text-right text-slate-800">1,180,000</td>
                  <td className="py-2"></td>
                </tr>

                {/* 営業利益 */}
                <tr className="border-t-2 border-b-2 border-slate-900 font-sans font-bold bg-emerald-50 text-emerald-950">
                  <td className="py-3 px-1 text-sm">当期営業利益</td>
                  <td className="py-3"></td>
                  <td className="py-3 px-1 text-right text-sm">6,050,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          /* 貸借対照表 (B/S) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* 資産の部 */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 border-b-2 border-slate-900 pb-1 flex justify-between">
                <span>【資産の部】</span>
                <span className="font-mono">¥28,420,000</span>
              </h3>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-sans text-slate-700">現金及び普通預金 (111, 113)</span>
                  <span>16,000,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-sans text-slate-700">売掛金 (131)</span>
                  <span>12,420,000</span>
                </div>
              </div>
            </div>

            {/* 負債・純資産の部 */}
            <div className="space-y-6">
              {/* 負債 */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 border-b-2 border-slate-900 pb-1 flex justify-between">
                  <span>【負債の部】</span>
                  <span className="font-mono">¥12,370,000</span>
                </h3>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans text-slate-700">買掛金 (211)</span>
                    <span>4,370,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans text-slate-700">短期借入金</span>
                    <span>8,000,000</span>
                  </div>
                </div>
              </div>

              {/* 純資産 */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 border-b-2 border-slate-900 pb-1 flex justify-between">
                  <span>【純資産の部】</span>
                  <span className="font-mono">¥16,050,000</span>
                </h3>
                <div className="space-y-1 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans text-slate-700">資本金 (311)</span>
                    <span>10,000,000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-sans text-slate-700">繰越利益剰余金 (当期純利益)</span>
                    <span className="font-bold text-emerald-700">6,050,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 押印欄 */}
        <div className="pt-8 border-t border-slate-200 flex justify-end gap-3 text-[10px] text-slate-600 font-sans">
          <div className="w-16 h-16 border border-slate-300 rounded flex flex-col items-center justify-between p-1">
            <span>承認</span>
            <div className="w-7 h-7 rounded-full border border-dashed border-slate-300" />
          </div>
          <div className="w-16 h-16 border border-slate-300 rounded flex flex-col items-center justify-between p-1">
            <span>審査</span>
            <div className="w-7 h-7 rounded-full border border-dashed border-slate-300" />
          </div>
          <div className="w-16 h-16 border border-slate-300 rounded flex flex-col items-center justify-between p-1">
            <span>作成</span>
            <div className="w-7 h-7 rounded-full border border-dashed border-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
