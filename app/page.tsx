import Link from 'next/link';
import React from 'react';
import {
  Table,
  Receipt,
  FileBarChart,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Activity,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { calculateCvpFromRawValues } from '@/services/cvpAnalysis';
import { calculateFinancialIndicators } from '@/services/financialIndicators';
import { INITIAL_POSTED_JOURNALS, INITIAL_UNAPPROVED_ENTRIES } from '@/services/mockAccountingData';
import { BASE_FINANCIAL_DATA } from '@/services/mockFinancialData';

export default function DashboardPage() {
  const currentSales = 48000000;
  const currentVariableCost = 16800000;
  const currentFixedCost = 19200000;

  const cvpData = calculateCvpFromRawValues(
    currentSales,
    currentVariableCost,
    currentFixedCost
  );

  const indicators = calculateFinancialIndicators(BASE_FINANCIAL_DATA);

  const fmt = (v: string | number) => `¥${Number(v).toLocaleString()}`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. 歓迎ヘッダー */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">会計 ＆ 財務分析ダッシュボード</h1>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
              2026年度 進行期
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AI領収書レビュー・複式簿記・キャッシュフロー・運転資金・財務健全性指標（ROE/ROA/PER）の統合管理
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/receipts/unapproved"
            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            AI領収書レビュー ({INITIAL_UNAPPROVED_ENTRIES.length}件)
          </Link>
          <Link
            href="/journal-entries"
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <Table className="w-4 h-4" />
            新規仕訳入力
          </Link>
        </div>
      </div>

      {/* 2. 最重要KPIサマリーカード群 (財務・運転資金・CF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">年間売上高（進行期）</span>
          <p className="text-2xl font-mono font-bold text-slate-900">{fmt(currentSales)}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> 営業利益: {fmt(BASE_FINANCIAL_DATA.operatingIncome)}
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">経常運転資金 (要立替資金)</span>
          <p className="text-2xl font-mono font-bold text-blue-600">{fmt(indicators.operatingWorkingCapital)}</p>
          <span className="text-[11px] text-slate-400">月商の {indicators.workingCapitalSalesRatio} か月分</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">ROE ＆ 自己資本比率</span>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-mono font-bold text-slate-900">{indicators.roe}%</p>
            <span className="text-xs font-mono text-emerald-600 font-bold">({indicators.equityRatio}%)</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
            財務スコア: S (極めて健全)
          </span>
        </div>

        <div className="p-5 bg-amber-500/10 border border-amber-300/80 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-amber-800 font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> AI領収書 未承認タスク
          </span>
          <p className="text-2xl font-mono font-bold text-amber-900">
            {INITIAL_UNAPPROVED_ENTRIES.length} 件
          </p>
          <Link
            href="/receipts/unapproved"
            className="text-[11px] text-amber-700 font-bold hover:underline block"
          >
            スプリットビューで確認・確定 ➔
          </Link>
        </div>
      </div>

      {/* 3. 主要財務レポート クイックアクセス 6連カード */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          財務・経営分析モジュール
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* カード 1: キャッシュフロー計算書 */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 hover:border-emerald-400 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">キャッシュフロー計算書 (年度/月次)</h3>
              <p className="text-xs text-slate-500 mt-1">
                営業・投資・財務CFおよび現預金残高の12か月推移を可視化します。
              </p>
            </div>
            <Link href="/reports/cashflow" className="inline-block text-xs font-bold text-emerald-600 hover:underline">
              レポートを開く ➔
            </Link>
          </div>

          {/* カード 2: 運転資金管理 */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 hover:border-blue-400 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">経常運転資金 ＆ 長期運転資金表</h3>
              <p className="text-xs text-slate-500 mt-1">
                立替資金の月商倍率と中長期の資金ショートリスクを事前判定します。
              </p>
            </div>
            <Link href="/reports/working-capital" className="inline-block text-xs font-bold text-blue-600 hover:underline">
              運転資金レポートへ ➔
            </Link>
          </div>

          {/* カード 3: 経営各種指標 (ROE/PER) */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 hover:border-indigo-400 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">経営・財務指標スコアボード</h3>
              <p className="text-xs text-slate-500 mt-1">
                ROE・ROA・流動比率・自己資本比率・PER/PBR株価シミュレーション。
              </p>
            </div>
            <Link href="/reports/indicators" className="inline-block text-xs font-bold text-indigo-600 hover:underline">
              指標スコアボードへ ➔
            </Link>
          </div>

          {/* カード 4: 損益分岐点 (CVP) */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 hover:border-purple-400 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">損益分岐点 (CVP) 分析</h3>
              <p className="text-xs text-slate-500 mt-1">
                固定費・変動費の比率分析と、売上低下に対する経営安全率を計算。
              </p>
            </div>
            <Link href="/reports/cvp" className="inline-block text-xs font-bold text-purple-600 hover:underline">
              CVPシミュレーターへ ➔
            </Link>
          </div>

          {/* カード 5: 月次推移試算表 */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 hover:border-sky-400 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">月次推移試算表 (T/B)</h3>
              <p className="text-xs text-slate-500 mt-1">
                全勘定科目の1月〜12月の発生額・残高推移を一覧表示します。
              </p>
            </div>
            <Link href="/reports/monthly-trial-balance" className="inline-block text-xs font-bold text-sky-600 hover:underline">
              月次試算表を見る ➔
            </Link>
          </div>

          {/* カード 6: 決算書 (B/S・P/L) */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 hover:border-teal-400 hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <FileBarChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">決算書 (B/S・P/L) ＆ 帳票印刷</h3>
              <p className="text-xs text-slate-500 mt-1">
                正式な財務諸表フォーマットで貸借対照表・損益計算書を印刷出力。
              </p>
            </div>
            <Link href="/reports/financial-statements" className="inline-block text-xs font-bold text-teal-600 hover:underline">
              決算書レポートへ ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
