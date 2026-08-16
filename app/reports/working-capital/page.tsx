'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, Layers, Calculator } from 'lucide-react';
import { MONTHLY_WORKING_CAPITAL_DATA } from '@/services/mockFinancialData';
import { calculateFinancialIndicators } from '@/services/financialIndicators';
import { BASE_FINANCIAL_DATA } from '@/services/mockFinancialData';

export default function WorkingCapitalPage() {
  const [receivablesInput, setReceivablesInput] = useState<number>(6500000); // 売掛金 650万
  const [inventoryInput, setInventoryInput] = useState<number>(1500000);   // 在庫 150万
  const [payablesInput, setPayablesInput] = useState<number>(3000000);     // 買掛金 300万
  const [fixedAssetsInput, setFixedAssetsInput] = useState<number>(8000000); // 固定資産 800万
  const [longTermFundsInput, setLongTermFundsInput] = useState<number>(28000000); // 長期調達資金 2800万

  // 経常運転資金 = 売掛金 + 在庫 - 買掛金
  const operatingWc = receivablesInput + inventoryInput - payablesInput;
  const monthlySales = 4000000;
  const wcMonthlyRatio = (operatingWc / monthlySales).toFixed(2);

  // 長期運転資金 = 経常運転資金 + 固定資産 - 長期資金
  const longTermWc = operatingWc + fixedAssetsInput - longTermFundsInput;
  const isHealthyLongTerm = longTermWc <= 0; // マイナスであれば長期資金で完全にカバーされており極めて健全

  const fmt = (v: number) => `¥${v.toLocaleString()}`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 画面ヘッダー */}
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
              <Layers className="w-5 h-5 text-blue-600" />
              経常運転資金 ＆ 長期運転資金 管理レポート
            </h1>
            <p className="text-xs text-slate-500">
              売上拡大に伴う「必要資金の立替ギャップ」と中長期の資金調達バランス（資金ショート防止）
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          印刷 (PDF)
        </button>
      </div>

      {/* 1. 2大運転資金 KPIカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* カード1: 経常運転資金 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-medium">事業継続に必要な立替資金</span>
              <h2 className="text-lg font-bold text-slate-900">経常運転資金 (Working Capital)</h2>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
              月商の {wcMonthlyRatio} か月分
            </span>
          </div>

          <p className="text-3xl font-mono font-bold text-blue-600">{fmt(operatingWc)}</p>

          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600">
            <div className="flex justify-between">
              <span>[+] 売掛債権 (売掛金):</span>
              <span className="font-bold text-slate-900">{fmt(receivablesInput)}</span>
            </div>
            <div className="flex justify-between">
              <span>[+] 棚卸資産 (商品在庫):</span>
              <span className="font-bold text-slate-900">{fmt(inventoryInput)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>[-] 仕入債務 (買掛金):</span>
              <span className="font-bold">△ {fmt(payablesInput)}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            ※売上が伸びるほどこの資金が必要になります。銀行の運転資金借入枠を確保しておくと安心です。
          </p>
        </div>

        {/* カード2: 長期運転資金 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-500 font-medium">中長期の資金調達バランス</span>
              <h2 className="text-lg font-bold text-slate-900">長期運転資金 (Long-term WC)</h2>
            </div>
            {isHealthyLongTerm ? (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 資金ショートリスクなし
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 資金ギャップ警戒
              </span>
            )}
          </div>

          <p className={`text-3xl font-mono font-bold ${isHealthyLongTerm ? 'text-emerald-600' : 'text-rose-600'}`}>
            {fmt(longTermWc)}
          </p>

          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-mono text-slate-600">
            <div className="flex justify-between">
              <span>[+] 経常運転資金:</span>
              <span className="font-bold text-slate-900">{fmt(operatingWc)}</span>
            </div>
            <div className="flex justify-between">
              <span>[+] 固定資産 (設備等):</span>
              <span className="font-bold text-slate-900">{fmt(fixedAssetsInput)}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>[-] 長期安定資金 (固定負債+純資産):</span>
              <span className="font-bold">△ {fmt(longTermFundsInput)}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            ※マイナス（余剰）であれば、設備と運転資金が全額「長期資金」で安全に賄われていることを示します。
          </p>
        </div>
      </div>

      {/* 2. 月次運転資金の推移テーブル */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          月次経常運転資金の推移 (2026年)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-mono">
                <th className="py-2.5 px-3 font-sans">月度</th>
                <th className="py-2.5 px-3 text-right">月間売上高</th>
                <th className="py-2.5 px-3 text-right">売掛金 (債権)</th>
                <th className="py-2.5 px-3 text-right">商品在庫 (棚卸)</th>
                <th className="py-2.5 px-3 text-right">買掛金 (債務)</th>
                <th className="py-2.5 px-3 text-right font-bold text-blue-600">経常運転資金</th>
                <th className="py-2.5 px-3 text-right font-sans">月商倍率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {MONTHLY_WORKING_CAPITAL_DATA.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{row.month}</td>
                  <td className="py-2.5 px-3 text-right text-slate-800">{row.sales.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{row.receivables.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-700">{row.inventory.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">△ {row.payables.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-600">{row.operatingWc.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-sans font-semibold text-slate-700">{row.ratioToMonthlySales} ヶ月</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. リアルタイム運転資金シミュレーター */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4 border border-slate-800">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400" />
          運転資金・資金需要シミュレーション
        </h3>
        <p className="text-xs text-slate-400">
          取引先の支払いサイトや在庫増減を変更した場合の必要資金をリアルタイム試算できます。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">想定売掛金 (円)</label>
            <input
              type="number"
              value={receivablesInput}
              onChange={(e) => setReceivablesInput(Number(e.target.value))}
              className="w-full h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">想定商品在庫 (円)</label>
            <input
              type="number"
              value={inventoryInput}
              onChange={(e) => setInventoryInput(Number(e.target.value))}
              className="w-full h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">想定買掛金 (円)</label>
            <input
              type="number"
              value={payablesInput}
              onChange={(e) => setPayablesInput(Number(e.target.value))}
              className="w-full h-9 px-3 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
