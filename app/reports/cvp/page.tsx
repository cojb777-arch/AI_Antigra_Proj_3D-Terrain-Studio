import React from 'react';
import { CvpDashboard } from '@/components/cvp/CvpDashboard';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '損益分岐点 (CVP) 分析 | Antigravity Accounting',
};

export default function CvpReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
          title="ダッシュボードへ戻る"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          損益分岐点 (CVP) 分析レポート
        </h1>
      </div>

      <CvpDashboard />
    </div>
  );
}
