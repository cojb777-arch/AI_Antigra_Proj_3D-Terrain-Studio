'use client';

import React, { useState } from 'react';
import { Decimal } from 'decimal.js';
import { TrendingUp, ShieldCheck, AlertTriangle, Calculator, Sparkles, ArrowRight } from 'lucide-react';
import { CvpAnalysisResult, calculateCvpFromRawValues } from '@/services/cvpAnalysis';

interface CvpDashboardProps {
  initialSales?: number;
  initialVariableCost?: number;
  initialFixedCost?: number;
}

export function CvpDashboard({
  initialSales = 24200000,
  initialVariableCost = 8470000,
  initialFixedCost = 9680000,
}: CvpDashboardProps) {
  const [salesInput, setSalesInput] = useState<string>(initialSales.toString());
  const [variableCostInput, setVariableCostInput] = useState<string>(initialVariableCost.toString());
  const [fixedCostInput, setFixedCostInput] = useState<string>(initialFixedCost.toString());
  const [targetProfit, setTargetProfit] = useState<string>('5000000');

  const data: CvpAnalysisResult = calculateCvpFromRawValues(
    salesInput,
    variableCostInput,
    fixedCostInput
  );

  const sales = new Decimal(data.sales || 0);
  const bep = new Decimal(data.breakEvenPointSales || 0);
  const safetyRatio = parseFloat(data.safetyMarginRatio);

  const getSafetyBadge = (ratio: number) => {
    if (ratio >= 40) return { label: '超優良 (40%以上)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
    if (ratio >= 20) return { label: '良好 (20%〜40%)', color: 'bg-blue-50 text-blue-700 border-blue-300' };
    if (ratio >= 10) return { label: '普通 (10%〜20%)', color: 'bg-amber-50 text-amber-700 border-amber-300' };
    return { label: '警戒 (10%未満)', color: 'bg-rose-50 text-rose-700 border-rose-300' };
  };

  const badge = getSafetyBadge(safetyRatio);
  const fmt = (v: string | number) => `¥${new Decimal(v || 0).toNumber().toLocaleString()}`;

  const neededSalesForTarget = data.targetSalesForProfit(targetProfit);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. タイトル＆総合判定ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              損益分岐点 (CVP) 分析 ＆ 経営安全シミュレーター
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            費用構造（固定費・変動費）から、赤字転落リスクと目標利益に必要な売上高をリアルタイム計算します。
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm ${badge.color}`}>
            <ShieldCheck className="w-4 h-4" />
            経営安全度: {badge.label}
          </span>
        </div>
      </div>

      {/* 2. KPI 4連カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">現在の売上高</span>
          <p className="text-2xl font-mono font-bold text-slate-900">{fmt(data.sales)}</p>
          <span className="text-[11px] text-slate-400">限界利益率: {(parseFloat(data.marginalProfitRatio) * 100).toFixed(1)}%</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">損益分岐点売上高 (BEP)</span>
          <p className="text-2xl font-mono font-bold text-blue-600">{fmt(data.breakEvenPointSales)}</p>
          <span className="text-[11px] text-slate-400">損益分岐比率: {data.breakEvenRatio}%</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">安全裕度額 (余裕キャッシュ)</span>
          <p className={`text-2xl font-mono font-bold ${new Decimal(data.safetyMarginAmount).isNegative() ? 'text-rose-600' : 'text-emerald-600'}`}>
            {fmt(data.safetyMarginAmount)}
          </p>
          <span className="text-[11px] text-slate-400">売上低下に対する許容クッション</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">経営安全率</span>
          <p className="text-2xl font-mono font-bold text-slate-900">{data.safetyMarginRatio}%</p>
          <span className="text-[11px] text-emerald-600 font-medium">営業利益: {fmt(data.operatingIncome)}</span>
        </div>
      </div>

      {/* 3. 視覚的ビジュアルバー (売上高 vs 損益分岐点) */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4 border border-slate-800">
        <div className="flex justify-between text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            損益分岐点到達ゲージ
          </span>
          <span>
            分岐比率: {sales.gt(0) ? bep.div(sales).mul(100).toFixed(1) : '0'}%
          </span>
        </div>

        <div className="w-full h-5 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              safetyRatio < 0 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-600 to-emerald-500'
            }`}
            style={{
              width: `${Math.min(
                100,
                sales.gt(0) ? bep.div(sales).mul(100).toNumber() : 0
              )}%`,
            }}
          />
        </div>

        <div className="flex flex-wrap justify-between text-xs text-slate-400 gap-2">
          <span>0円 (ゼロライン)</span>
          <span className="text-blue-400 font-semibold">損益分岐点: {fmt(data.breakEvenPointSales)}</span>
          <span className="text-emerald-400 font-bold">現在の売上: {fmt(data.sales)}</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            現在のコスト構造では、売上が今より <strong className="text-amber-400">{data.safetyMarginRatio}%</strong>（{fmt(data.safetyMarginAmount)}）以上落ち込むと赤字に転落します。
          </p>
        </div>
      </div>

      {/* 4. インタラクティブ・シミュレーション入力欄 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左: 費用内訳の変更シミュレーション */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            費用・売上のリアルタイム調整
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">売上高 (円)</label>
              <input
                type="number"
                value={salesInput}
                onChange={(e) => setSalesInput(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">変動費 (仕入・外注等)</label>
                <input
                  type="number"
                  value={variableCostInput}
                  onChange={(e) => setVariableCostInput(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">固定費 (人件費・家賃等)</label>
                <input
                  type="number"
                  value={fixedCostInput}
                  onChange={(e) => setFixedCostInput(e.target.value)}
                  className="w-full h-9 px-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右: 目標利益シミュレーター */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            目標営業利益 達成シミュレーター
          </h3>
          <p className="text-xs text-slate-500">
            達成したい営業利益額を入力すると、必要な売上高を自動逆算します。
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">目標営業利益 (円)</label>
              <input
                type="number"
                value={targetProfit}
                onChange={(e) => setTargetProfit(e.target.value)}
                className="w-full h-9 px-3 border border-slate-300 bg-white rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-4 bg-indigo-900 text-white rounded-xl space-y-1">
              <span className="text-[11px] text-indigo-200">目標達成に必要な売上高</span>
              <div className="flex items-center justify-between">
                <p className="text-xl font-mono font-bold">{fmt(neededSalesForTarget)}</p>
                <ArrowRight className="w-5 h-5 text-indigo-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
