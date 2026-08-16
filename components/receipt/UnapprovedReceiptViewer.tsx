'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import { AccountCombobox } from '@/components/journal/cells/AccountCombobox';
import { AmountInput } from '@/components/journal/cells/AmountInput';
import { VendorInvoiceInput } from '@/components/journal/cells/VendorInvoiceInput';
import { UnapprovedEntry } from '@/services/mockAccountingData';

interface UnapprovedReceiptViewerProps {
  entries: UnapprovedEntry[];
  userId?: string;
  onApproveSuccess?: (approvedId: string) => void;
}

export function UnapprovedReceiptViewer({
  entries: initialEntries,
  userId = 'usr_admin',
  onApproveSuccess,
}: UnapprovedReceiptViewerProps) {
  const [entries, setEntries] = useState<UnapprovedEntry[]>(initialEntries);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currentEntry = entries[currentIndex];

  if (!currentEntry || entries.length === 0) {
    return (
      <div className="p-16 text-center bg-white border border-slate-200 rounded-xl shadow-sm max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">すべての未承認データが確認済みです</h3>
        <p className="text-sm text-slate-500 mt-2">
          AIが取り込んだ領収書データはすべて正式な仕訳（POSTED）として記帳されました。
        </p>
        <button
          onClick={() => {
            setEntries(initialEntries);
            setCurrentIndex(0);
            setMessage(null);
          }}
          className="mt-6 px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
        >
          サンプルデータをリロードして再体験
        </button>
      </div>
    );
  }

  const handleFieldChange = (field: keyof UnapprovedEntry, val: string) => {
    setEntries((prev) =>
      prev.map((item, idx) => (idx === currentIndex ? { ...item, [field]: val } : item))
    );
  };

  const handleApproveCurrent = () => {
    setIsPending(true);
    setTimeout(() => {
      setMessage(`伝票 (${currentEntry.id}: ¥${Number(currentEntry.debitAmount).toLocaleString()}) を承認・記帳しました。`);
      if (onApproveSuccess) onApproveSuccess(currentEntry.id);
      setEntries((prev) => prev.filter((_, idx) => idx !== currentIndex));
      if (currentIndex >= entries.length - 1) {
        setCurrentIndex(Math.max(0, entries.length - 2));
      }
      setIsPending(false);
    }, 400);
  };

  const handleApproveAll = () => {
    setIsPending(true);
    setTimeout(() => {
      setMessage(`全 ${entries.length} 件の伝票を一括承認・記帳しました。`);
      setEntries([]);
      setCurrentIndex(0);
      setIsPending(false);
    }, 600);
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* 1. ヘッダー＆ナビゲーションバー */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 text-white gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            AI記帳・未承認レビュー
          </span>
          <span className="text-xs text-slate-400 font-mono">
            全 <strong className="text-white">{entries.length}</strong> 件中{' '}
            <strong className="text-blue-400">{currentIndex + 1}</strong> 件目を表示中
          </span>
          {currentEntry.aiConfidenceScore && (
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[11px] font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              AI確信度: {Math.round(currentEntry.aiConfidenceScore * 100)}%
            </span>
          )}
        </div>

        {/* ナビゲーション & 一括ボタン */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              title="前へ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">
              {currentIndex + 1} / {entries.length}
            </span>
            <button
              onClick={() => setCurrentIndex((i) => Math.min(entries.length - 1, i + 1))}
              disabled={currentIndex === entries.length - 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
              title="次へ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleApproveAll}
            disabled={isPending}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-bold rounded-lg transition flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
            すべて一括承認
          </button>
        </div>
      </div>

      {/* 2. 2画面分割メインコンテンツ（スプリットビュー） */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* 【左側】領収書画像プレビュー (7/12) */}
        <div className="lg:col-span-7 p-6 bg-slate-950 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative select-none">
          {/* 画像操作ツールバー */}
          <div className="flex items-center justify-between mb-3 text-slate-400 text-xs">
            <span className="font-mono text-[11px] text-slate-500">伝票ID: {currentEntry.id}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                title="縮小"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                title="拡大"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                title="回転"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 画像表示枠 */}
          <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800/80 bg-slate-900/40 flex items-center justify-center p-4">
            {currentEntry.receiptImageUrl ? (
              <div
                className="transition-transform duration-200 ease-out max-h-full max-w-full flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentEntry.receiptImageUrl}
                  alt="領収書原本"
                  className="max-h-[480px] max-w-full object-contain rounded shadow-lg border border-slate-700/50"
                />
              </div>
            ) : (
              <div className="text-slate-600 text-xs flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 opacity-30" />
                <span>画像プレビューはありません</span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            電帳法（電子取引データ保存）原本タイムスタンプ付与済み
          </p>
        </div>

        {/* 【右側】AI解析結果の編集＆確定フォーム (5/12) */}
        <div className="lg:col-span-5 p-6 bg-slate-900 text-slate-100 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI推論結果の確認・修正
              </h3>
              <span className="text-[11px] text-slate-400">複式簿記（借方/貸方 自動生成）</span>
            </div>

            {/* 取引日＆金額 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">取引日 (日付)</label>
                <input
                  type="date"
                  value={currentEntry.entryDate}
                  onChange={(e) => handleFieldChange('entryDate', e.target.value)}
                  className="w-full h-9 px-3 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">税込合計金額 (円)</label>
                <AmountInput
                  value={currentEntry.debitAmount}
                  onChange={(val) => handleFieldChange('debitAmount', val)}
                  className="bg-slate-800 border-slate-700 text-white font-bold text-sm"
                />
              </div>
            </div>

            {/* 発行者情報（店舗名・インボイスT番号） */}
            <div className="space-y-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">発行元（店舗名 / 会社名）</label>
                <input
                  type="text"
                  value={currentEntry.vendorName}
                  onChange={(e) => handleFieldChange('vendorName', e.target.value)}
                  className="w-full h-8 px-2.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">
                  インボイス登録番号 (国税庁照会)
                </label>
                <VendorInvoiceInput
                  value={currentEntry.vendorInvoiceNo}
                  onChange={(val) => handleFieldChange('vendorInvoiceNo', val)}
                />
              </div>
            </div>

            {/* AIが推論した勘定科目選択 */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">
                借方勘定科目 (費用科目)
              </label>
              <AccountCombobox
                value={currentEntry.debitAccountCode}
                onChange={(code) => handleFieldChange('debitAccountCode', code)}
              />
            </div>

            {/* 摘要入力 */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">摘要 (取引内容)</label>
              <input
                type="text"
                value={currentEntry.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full h-8 px-2.5 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 仕訳プレビュー枠 */}
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 text-[11px] space-y-1 font-mono text-slate-400">
              <div className="flex justify-between text-slate-500 text-[10px] pb-1 border-b border-slate-800">
                <span>自動生成される仕訳 (POSTED)</span>
                <span>相手科目: 現金 (111)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>[借] 科目コード {currentEntry.debitAccountCode}</span>
                <span className="text-white">¥{Number(currentEntry.debitAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>[貸] 現金 (111)</span>
                <span className="text-white">¥{Number(currentEntry.debitAmount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 3. アクションボタンバー */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {message ? (
              <p className="text-xs text-amber-400 font-medium truncate max-w-[200px]">{message}</p>
            ) : <span />}
            <button
              onClick={handleApproveCurrent}
              disabled={isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              {isPending ? '承認記帳中...' : '確認して仕訳確定 (POSTED)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
