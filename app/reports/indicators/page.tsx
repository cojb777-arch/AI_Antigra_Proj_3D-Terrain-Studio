'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, ShieldCheck, Activity, LineChart, Sparkles, HelpCircle } from 'lucide-react';
import { calculateFinancialIndicators } from '@/services/financialIndicators';
import { BASE_FINANCIAL_DATA } from '@/services/mockFinancialData';

export default function FinancialIndicatorsPage() {
  const [stockPrice, setStockPrice] = useState<string>('7200'); // 想定株価 7,200円
  const indicators = calculateFinancialIndicators(BASE_FINANCIAL_DATA);

  const getHealthBadge = (score: number) => {
    if (score >= 80) return { label: 'S (極めて健全)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
    if (score >= 60) return { label: 'A (健全・高収益)', color: 'bg-blue-50 text-blue-700 border-blue-300' };
    return { label: 'B (標準的)', color: 'bg-amber-50 text-amber-700 border-amber-300' };
  };

  const health = getHealthBadge(85);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 画面ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              経営・財務各種指標スコアボード
            </h1>
            <p className="text-xs text-slate-500">収益性（ROE/ROA）、安全性（自己資本比率）、投資指標（PER/PBR）のリアルタイム分析</p>
          </div>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm ${health.color}`}>
          <ShieldCheck className="w-4 h-4" />
          財務スコア: {health.label}
        </span>
      </div>

      {/* 1. 収益性指標 (Profitability) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">1. 収益性指標 (資本効率・マージン)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">ROE (自己資本利益率)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">優良 (8%以上)</span>
            </div>
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.roe}%</p>
            <p className="text-[11px] text-slate-400">株主資本を活用して稼いだ効率</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">ROA (総資産利益率)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">優良 (5%以上)</span>
            </div>
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.roa}%</p>
            <p className="text-[11px] text-slate-400">総資産全体の運用利回り</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-xs text-slate-500 font-medium">売上高営業利益率</span>
            <p className="text-2xl font-mono font-bold text-blue-600">{indicators.operatingProfitMargin}%</p>
            <p className="text-[11px] text-slate-400">本業の収益力（営業利益÷売上）</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-xs text-slate-500 font-medium">売上高当期純利益率</span>
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.netProfitMargin}%</p>
            <p className="text-[11px] text-slate-400">最終手残り利益率（税引後）</p>
          </div>
        </div>
      </div>

      {/* 2. 安全性指標 (Safety) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800">2. 安全性・財務健全性指標 (倒産リスク耐性)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">自己資本比率</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">極めて健全</span>
            </div>
            <p className="text-2xl font-mono font-bold text-emerald-600">{indicators.equityRatio}%</p>
            <p className="text-[11px] text-slate-400">目安: 40%以上で倒産リスク低</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">流動比率 (短期支払能力)</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">安心水準</span>
            </div>
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.currentRatio}%</p>
            <p className="text-[11px] text-slate-400">流動資産÷流動負債 (目安: 150%以上)</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-xs text-slate-500 font-medium">固定比率 (固定資産÷自己資本)</span>
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.fixedRatio}%</p>
            <p className="text-[11px] text-slate-400">目安: 100%以下が健全（設備を自己資本で賄う）</p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
            <span className="text-xs text-slate-500 font-medium">有利子負債月商倍率</span>
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.debtToMonthlySalesRatio} か月</p>
            <p className="text-[11px] text-slate-400">借入金÷月商 (目安: 3か月以内が安心)</p>
          </div>
        </div>
      </div>

      {/* 3. 企業価値・株式投資指標 (PER / PBR / EPS) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-800">3. 企業価値 ＆ 1株当たり指標 (株価シミュレーター)</h2>
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                想定株価シミュレーター
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">発行済株式数 10,000株を基準にリアルタイム算出</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="text-slate-300">想定株価 (円):</label>
              <input
                type="number"
                value={stockPrice}
                onChange={(e) => setStockPrice(e.target.value)}
                className="w-28 h-8 px-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">PER (株価収益率)</span>
              <p className="text-2xl font-mono font-bold text-purple-400">{indicators.per(stockPrice)} 倍</p>
              <span className="text-[10px] text-slate-500">株価 ÷ EPS</span>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">PBR (株価純資産倍率)</span>
              <p className="text-2xl font-mono font-bold text-indigo-400">{indicators.pbr(stockPrice)} 倍</p>
              <span className="text-[10px] text-slate-500">株価 ÷ BPS</span>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">EPS (1株当たり利益)</span>
              <p className="text-2xl font-mono font-bold text-white">¥{Number(indicators.eps).toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">当期純利益 ÷ 発行済株式数</span>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">BPS (1株当たり純資産)</span>
              <p className="text-2xl font-mono font-bold text-white">¥{Number(indicators.bps).toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">純資産 ÷ 発行済株式数</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
