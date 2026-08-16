'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Save,
  Table as TableIcon,
} from 'lucide-react';
import { AccountCombobox } from '@/components/journal/cells/AccountCombobox';
import { AmountInput } from '@/components/journal/cells/AmountInput';
import { VendorInvoiceInput } from '@/components/journal/cells/VendorInvoiceInput';
import { INITIAL_POSTED_JOURNALS, PostedJournal } from '@/services/mockAccountingData';
import { Decimal } from 'decimal.js';

interface JournalFormLine {
  id: string;
  debitAccountCode: string;
  debitAmount: string;
  creditAccountCode: string;
  creditAmount: string;
  vendorInvoiceNo: string;
}

export default function JournalEntriesPage() {
  const [journals, setJournals] = useState<PostedJournal[]>(INITIAL_POSTED_JOURNALS);
  const [entryDate, setEntryDate] = useState('2026-08-16');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<JournalFormLine[]>([
    {
      id: '1',
      debitAccountCode: '524',
      debitAmount: '12000',
      creditAccountCode: '113',
      creditAmount: '12000',
      vendorInvoiceNo: 'T1234567890123',
    },
  ]);
  const [message, setMessage] = useState<string | null>(null);

  // 借方合計・貸方合計の計算
  const totalDebit = lines.reduce((acc, line) => {
    return acc.plus(new Decimal(line.debitAmount || 0));
  }, new Decimal(0));

  const totalCredit = lines.reduce((acc, line) => {
    return acc.plus(new Decimal(line.creditAmount || 0));
  }, new Decimal(0));

  const isBalanced = totalDebit.equals(totalCredit) && totalDebit.gt(0);
  const diff = totalDebit.minus(totalCredit).abs();

  const handleAddLine = () => {
    setLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        debitAccountCode: '',
        debitAmount: '0',
        creditAccountCode: '113',
        creditAmount: '0',
        vendorInvoiceNo: '',
      },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleLineChange = (index: number, field: keyof JournalFormLine, val: string) => {
    setLines((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item))
    );
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const newJournal: PostedJournal = {
      id: `JE-${1000 + journals.length + 1}`,
      entryNumber: 1000 + journals.length + 1,
      entryDate,
      description: description || '新規記帳伝票',
      debitAccountName: '消耗品費',
      debitCode: lines[0].debitAccountCode,
      debitAmount: totalDebit.toFixed(),
      creditAccountName: '普通預金',
      creditCode: lines[0].creditAccountCode,
      creditAmount: totalCredit.toFixed(),
      status: 'POSTED',
    };

    setJournals((prev) => [newJournal, ...prev]);
    setMessage(`伝票 #${newJournal.entryNumber} (¥${totalDebit.toNumber().toLocaleString()}) を正常に記帳しました。`);
    setDescription('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 画面ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-blue-600" />
              仕訳高速入力 (複式簿記)
            </h1>
            <p className="text-xs text-slate-500">借方・貸方のリアルタイムバランス検証とインボイスT番号の自動フォーマット</p>
          </div>
        </div>
      </div>

      {/* 新規仕訳入力カード */}
      <form
        onSubmit={handleSaveEntry}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <label className="text-slate-500 block mb-1 font-medium">取引日</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="h-9 px-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="min-w-[280px]">
              <label className="text-slate-500 block mb-1 font-medium">伝票摘要</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例: 文房具・事務用品の購入"
                className="w-full h-9 px-3 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 借貸バランス判定バー */}
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-mono font-bold">
                借方: ¥{totalDebit.toNumber().toLocaleString()} / 貸方: ¥{totalCredit.toNumber().toLocaleString()}
              </div>
              {isBalanced ? (
                <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 貸借一致 (バランスOK)
                </span>
              ) : (
                <span className="text-[11px] text-rose-600 font-bold flex items-center justify-end gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 不一致 (差額: ¥{diff.toNumber().toLocaleString()})
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!isBalanced}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              仕訳確定 (POSTED)
            </button>
          </div>
        </div>

        {/* 明細行テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-medium">
                <th className="p-2 text-left w-48">借方勘定科目</th>
                <th className="p-2 text-right w-36">借方金額 (円)</th>
                <th className="p-2 text-left w-48">貸方勘定科目</th>
                <th className="p-2 text-right w-36">貸方金額 (円)</th>
                <th className="p-2 text-left w-44">インボイス登録番号</th>
                <th className="p-2 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((line, idx) => (
                <tr key={line.id} className="hover:bg-slate-50/50">
                  <td className="p-2">
                    <AccountCombobox
                      value={line.debitAccountCode}
                      onChange={(code) => handleLineChange(idx, 'debitAccountCode', code)}
                    />
                  </td>
                  <td className="p-2">
                    <AmountInput
                      value={line.debitAmount}
                      onChange={(val) => handleLineChange(idx, 'debitAmount', val)}
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </td>
                  <td className="p-2">
                    <AccountCombobox
                      value={line.creditAccountCode}
                      onChange={(code) => handleLineChange(idx, 'creditAccountCode', code)}
                    />
                  </td>
                  <td className="p-2">
                    <AmountInput
                      value={line.creditAmount}
                      onChange={(val) => handleLineChange(idx, 'creditAmount', val)}
                      className="bg-white border-slate-300 text-slate-900"
                    />
                  </td>
                  <td className="p-2">
                    <VendorInvoiceInput
                      value={line.vendorInvoiceNo}
                      onChange={(val) => handleLineChange(idx, 'vendorInvoiceNo', val)}
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </td>
                  <td className="p-2 text-center">
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="行削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={handleAddLine}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> 行を追加
          </button>
          {message && <p className="text-xs text-emerald-600 font-bold">{message}</p>}
        </div>
      </form>

      {/* 記帳済み仕訳一覧 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">仕訳伝票履歴 (POSTED)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">伝票番号</th>
                <th className="py-2.5 px-3">取引日</th>
                <th className="py-2.5 px-3">借方科目</th>
                <th className="py-2.5 px-3 text-right">金額 (円)</th>
                <th className="py-2.5 px-3">貸方科目</th>
                <th className="py-2.5 px-3">摘要</th>
                <th className="py-2.5 px-3 text-center">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journals.map((j) => (
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
                      POSTED
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
