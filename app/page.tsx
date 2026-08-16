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
  CheckCircle2,
} from 'lucide-react';
import { calculateCvpFromRawValues } from '@/services/cvpAnalysis';
import { INITIAL_POSTED_JOURNALS, INITIAL_UNAPPROVED_ENTRIES } from '@/services/mockAccountingData';

export default function DashboardPage() {
  const currentSales = 24200000;
  const currentVariableCost = 8470000;
  const currentFixedCost = 9680000;

  const cvpData = calculateCvpFromRawValues(
    currentSales,
    currentVariableCost,
    currentFixedCost
  );

  const fmt = (v: string | number) => `¥${Number(v).toLocaleString()}`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. 歓迎ヘッダー */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">会計ダッシュボード</h1>
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
              2026年度 進行期
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            最新のAI領収書解析タスク・複式簿記残高・損益分岐点（CVP）分析のサマリー
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/receipts/unapproved"
            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            AI領収書をレビュー ({INITIAL_UNAPPROVED_ENTRIES.length}件)
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

      {/* 2. 最重要KPIサマリーカード群 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">当期売上高（確定）</span>
          <p className="text-2xl font-mono font-bold text-slate-900">{fmt(cvpData.sales)}</p>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> 前年同期比 +14.2%
          </span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">損益分岐点売上高 (BEP)</span>
          <p className="text-2xl font-mono font-bold text-blue-600">{fmt(cvpData.breakEvenPointSales)}</p>
          <span className="text-[11px] text-slate-400">黒字化ライン (固定費÷限界利益率)</span>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <span className="text-xs text-slate-500 font-medium">経営安全率</span>
          <p className="text-2xl font-mono font-bold text-slate-900">{cvpData.safetyMarginRatio}%</p>
          <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block">
            安全余裕額: {fmt(cvpData.safetyMarginAmount)}
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

      {/* 3. クイックアクション & 機能ショートカットカード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* カード 1: AI自動記帳 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 hover:border-blue-400 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">AI 領収書自動記帳 (未承認レビュー)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              領収書原本プレビューとAI解析フォームを並べて、修正・一括承認（POSTED）します。
            </p>
          </div>
          <Link
            href="/receipts/unapproved"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            レビュー画面を開く ➔
          </Link>
        </div>

        {/* カード 2: 財務諸表 (B/S・P/L) */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 hover:border-emerald-400 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <FileBarChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">決算書 (B/S・P/L) レポート</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              リアルタイムの貸借対照表と損益計算書を正式な財務諸表フォーマットで確認・印刷します。
            </p>
          </div>
          <Link
            href="/reports/financial-statements"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            決算書を表示 ➔
          </Link>
        </div>

        {/* カード 3: CVP分析 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 hover:border-purple-400 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">損益分岐点 (CVP) 分析</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              変動費・固定費の構造分析と、目標営業利益に必要な売上高シミュレーションを実行します。
            </p>
          </div>
          <Link
            href="/reports/cvp"
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
          >
            分析シミュレーターへ ➔
          </Link>
        </div>
      </div>

      {/* 4. 最近の記帳仕訳履歴 */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-500" />
            最近の確定仕訳伝票 (POSTED)
          </h3>
          <Link href="/journal-entries" className="text-xs font-semibold text-blue-600 hover:underline">
            全伝票を表示 ➔
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">伝票番号</th>
                <th className="py-2.5 px-3 font-semibold">取引日</th>
                <th className="py-2.5 px-3 font-semibold">借方科目</th>
                <th className="py-2.5 px-3 font-semibold text-right">金額 (円)</th>
                <th className="py-2.5 px-3 font-semibold">貸方科目</th>
                <th className="py-2.5 px-3 font-semibold">摘要</th>
                <th className="py-2.5 px-3 font-semibold text-center">状態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_POSTED_JOURNALS.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-mono text-slate-500">#{j.entryNumber}</td>
                  <td className="py-2.5 px-3 font-mono">{j.entryDate}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{j.debitAccountName}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">
                    ¥{Number(j.debitAmount).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{j.creditAccountName}</td>
                  <td className="py-2.5 px-3 text-slate-700">{j.description}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                      確定
                    </span>
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
