import React from 'react';
import { UnapprovedReceiptViewer } from '@/components/receipt/UnapprovedReceiptViewer';
import { INITIAL_UNAPPROVED_ENTRIES } from '@/services/mockAccountingData';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'AI領収書レビュー・一括承認 | Antigravity Accounting',
};

export default function UnapprovedReceiptPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 画面ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
              title="ダッシュボードへ戻る"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              AI領収書 未承認レビュー ＆ 一括確定
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-9">
            左側の領収書画像（原本）を確認しながら、AIが推論した科目・金額・インボイス番号を修正し、そのまま仕訳（POSTED）として確定できます。
          </p>
        </div>
      </div>

      {/* スプリットビューメインコンポーネント */}
      <UnapprovedReceiptViewer entries={INITIAL_UNAPPROVED_ENTRIES} />
    </div>
  );
}
