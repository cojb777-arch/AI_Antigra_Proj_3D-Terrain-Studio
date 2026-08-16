import './globals.css';
import Link from 'next/link';
import React from 'react';
import {
  LayoutDashboard,
  Table,
  FileBarChart,
  Receipt,
  TrendingUp,
  Building2,
  Settings,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Antigravity Accounting | 次世代 AI クラウド会計システム',
  description: 'AI駆動型・高精度複式簿記会計システム',
};

const NAV_ITEMS = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/journal-entries', label: '仕訳高速入力', icon: Table },
  { href: '/receipts/unapproved', label: 'AI領収書レビュー', icon: Receipt, badge: '3件未承認' },
  { href: '/reports/cvp', label: '損益分岐点 (CVP) 分析', icon: TrendingUp },
  { href: '/reports/financial-statements', label: '決算書 (B/S・P/L)', icon: FileBarChart },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans bg-slate-100 text-slate-900">
        <div className="flex h-screen overflow-hidden">
          {/* サイドバーナビゲーション */}
          <aside className="w-64 bg-slate-950 text-white flex flex-col justify-between shrink-0 no-print border-r border-slate-800">
            <div>
              {/* ブランドロゴ */}
              <Link href="/dashboard" className="p-5 border-b border-slate-800/80 flex items-center gap-3 hover:bg-slate-900/50 transition">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-sm tracking-wide text-white">Antigravity Accounting</h1>
                  <p className="text-[10px] text-slate-400 font-mono">AI-Powered ERP Engine</p>
                </div>
              </Link>

              {/* メニュー一覧 */}
              <nav className="p-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* サイドバーフッター */}
            <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="truncate max-w-[130px] font-medium text-slate-300">株式会社サンプル商事</span>
              </div>
              <Settings className="w-4 h-4 hover:text-white cursor-pointer transition" />
            </div>
          </aside>

          {/* メインコンテンツエリア */}
          <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
