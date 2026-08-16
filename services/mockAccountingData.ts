export interface AccountMaster {
  code: string;
  name: string;
  kana: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense' | 'CostOfSales';
  costType: 'VARIABLE' | 'FIXED' | 'NONE';
}

export const ACCOUNT_MASTERS: AccountMaster[] = [
  { code: '111', name: '現金', kana: 'げんきん', category: 'Asset', costType: 'NONE' },
  { code: '113', name: '普通預金', kana: 'ふつうよきん', category: 'Asset', costType: 'NONE' },
  { code: '131', name: '売掛金', kana: 'うりかけきん', category: 'Asset', costType: 'NONE' },
  { code: '211', name: '買掛金', kana: 'かいかけきん', category: 'Liability', costType: 'NONE' },
  { code: '311', name: '資本金', kana: 'しほんきん', category: 'Equity', costType: 'NONE' },
  { code: '411', name: '売上高', kana: 'うりあげだか', category: 'Revenue', costType: 'NONE' },
  { code: '511', name: '仕入高', kana: 'しいれだか', category: 'CostOfSales', costType: 'VARIABLE' },
  { code: '512', name: '外注費', kana: 'がいちゅうひ', category: 'CostOfSales', costType: 'VARIABLE' },
  { code: '520', name: '旅費交通費', kana: 'りょひこうつうひ', category: 'Expense', costType: 'FIXED' },
  { code: '521', name: '通信費', kana: 'つうしんひ', category: 'Expense', costType: 'FIXED' },
  { code: '522', name: '会議費', kana: 'かいぎひ', category: 'Expense', costType: 'FIXED' },
  { code: '523', name: '接待交際費', kana: 'せったいこうさいひ', category: 'Expense', costType: 'FIXED' },
  { code: '524', name: '消耗品費', kana: 'しょうもうひんひ', category: 'Expense', costType: 'FIXED' },
  { code: '525', name: '地代家賃', kana: 'ちだいやちん', category: 'Expense', costType: 'FIXED' },
  { code: '526', name: '給料手当', kana: 'きゅうりょうてあて', category: 'Expense', costType: 'FIXED' },
  { code: '527', name: '水道光熱費', kana: 'すいどうこうねつひ', category: 'Expense', costType: 'FIXED' },
  { code: '528', name: '雑費', kana: 'ざっぴ', category: 'Expense', costType: 'FIXED' },
];

export interface UnapprovedEntry {
  id: string;
  receiptImageUrl: string;
  entryDate: string;
  vendorName: string;
  vendorInvoiceNo: string;
  debitAccountCode: string;
  debitAmount: string;
  description: string;
  aiConfidenceScore?: number;
  items?: { name: string; amount: string }[];
}

export const INITIAL_UNAPPROVED_ENTRIES: UnapprovedEntry[] = [
  {
    id: 'RCPT-2026-0089',
    receiptImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" style="background:%23fff;font-family:sans-serif;"><rect width="400" height="600" fill="%23fff" stroke="%23cbd5e1" stroke-width="2"/><text x="200" y="50" font-size="20" font-weight="bold" text-anchor="middle" fill="%231e293b">領 収 書 (RECEIPT)</text><line x1="40" y1="70" x2="360" y2="70" stroke="%23334155" stroke-width="1.5"/><text x="40" y="105" font-size="14" fill="%23475569">発行日: 2026年08月12日</text><text x="40" y="130" font-size="14" fill="%23475569">宛名: 株式会社サンプル商事 御中</text><rect x="40" y="150" width="320" height="50" fill="%23f1f5f9" rx="6"/><text x="200" y="182" font-size="22" font-weight="bold" fill="%230f172a" text-anchor="middle">¥14,850 - (税込)</text><text x="40" y="230" font-size="13" fill="%23334155">【内訳】</text><text x="40" y="255" font-size="12" fill="%2364748b">プロジェクト打ち合わせ飲食代 (4名)</text><text x="320" y="255" font-size="12" fill="%230f172a" text-anchor="end">¥13,500</text><text x="40" y="275" font-size="12" fill="%2364748b">消費税 (10%対象)</text><text x="320" y="275" font-size="12" fill="%230f172a" text-anchor="end">¥1,350</text><line x1="40" y1="300" x2="360" y2="300" stroke="%23e2e8f0" stroke-width="1"/><text x="40" y="340" font-size="13" font-weight="bold" fill="%231e293b">発行元: カフェ・ド・銀座</text><text x="40" y="365" font-size="11" fill="%2364748b">東京都中央区銀座 4-1-12 銀座タワー3F</text><text x="40" y="385" font-size="11" fill="%2364748b">TEL: 03-1234-5678</text><rect x="40" y="410" width="320" height="36" fill="%23e0f2fe" rx="4" stroke="%23bae6fd"/><text x="50" y="433" font-size="11" font-weight="bold" fill="%230369a1">適格請求書発行事業者登録番号: T1234567890123</text><circle cx="310" cy="490" r="30" fill="%23fee2e2" stroke="%23ef4444" stroke-width="2"/><text x="310" y="495" font-size="12" font-weight="bold" fill="%23b91c1c" text-anchor="middle">受領印</text></svg>',
    entryDate: '2026-08-12',
    vendorName: 'カフェ・ド・銀座',
    vendorInvoiceNo: 'T1234567890123',
    debitAccountCode: '522', // 会議費
    debitAmount: '14850',
    description: 'カフェ・ド・銀座 クライアント打合せ',
    aiConfidenceScore: 0.96,
  },
  {
    id: 'RCPT-2026-0090',
    receiptImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" style="background:%23fff;font-family:sans-serif;"><rect width="400" height="600" fill="%23fff" stroke="%23cbd5e1" stroke-width="2"/><text x="200" y="50" font-size="20" font-weight="bold" text-anchor="middle" fill="%231e293b">お 買 上 票</text><line x1="40" y1="70" x2="360" y2="70" stroke="%23334155" stroke-width="1.5"/><text x="40" y="105" font-size="14" fill="%23475569">日時: 2026/08/14 14:22</text><rect x="40" y="135" width="320" height="50" fill="%23f1f5f9" rx="6"/><text x="200" y="167" font-size="22" font-weight="bold" fill="%230f172a" text-anchor="middle">¥3,980 -</text><text x="40" y="220" font-size="12" fill="%23334155">USB-C ハブ 7-in-1</text><text x="320" y="220" font-size="12" fill="%230f172a" text-anchor="end">¥3,980</text><line x1="40" y1="260" x2="360" y2="260" stroke="%23e2e8f0" stroke-width="1"/><text x="40" y="300" font-size="13" font-weight="bold" fill="%231e293b">ビックカメラ 有楽町店</text><text x="40" y="325" font-size="11" fill="%2364748b">東京都千代田区有楽町 1-11-1</text><rect x="40" y="350" width="320" height="36" fill="%23e0f2fe" rx="4" stroke="%23bae6fd"/><text x="50" y="373" font-size="11" font-weight="bold" fill="%230369a1">登録番号: T9876543210987</text></svg>',
    entryDate: '2026-08-14',
    vendorName: 'ビックカメラ 有楽町店',
    vendorInvoiceNo: 'T9876543210987',
    debitAccountCode: '524', // 消耗品費
    debitAmount: '3980',
    description: 'ビックカメラ 有楽町店 PC周辺機器購入',
    aiConfidenceScore: 0.98,
  },
  {
    id: 'RCPT-2026-0091',
    receiptImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600" style="background:%23fff;font-family:sans-serif;"><rect width="400" height="600" fill="%23fff" stroke="%23cbd5e1" stroke-width="2"/><text x="200" y="50" font-size="20" font-weight="bold" text-anchor="middle" fill="%231e293b">タ ク シ ー 領 収 書</text><line x1="40" y1="70" x2="360" y2="70" stroke="%23334155" stroke-width="1.5"/><text x="40" y="105" font-size="14" fill="%23475569">乗車日: 2026/08/15</text><rect x="40" y="135" width="320" height="50" fill="%23f1f5f9" rx="6"/><text x="200" y="167" font-size="22" font-weight="bold" fill="%230f172a" text-anchor="middle">¥4,200 -</text><text x="40" y="220" font-size="12" fill="%23334155">東京駅 ➔ 渋谷（深夜割増）</text><line x1="40" y1="260" x2="360" y2="260" stroke="%23e2e8f0" stroke-width="1"/><text x="40" y="300" font-size="13" font-weight="bold" fill="%231e293b">日本交通株式会社</text><rect x="40" y="340" width="320" height="36" fill="%23e0f2fe" rx="4" stroke="%23bae6fd"/><text x="50" y="363" font-size="11" font-weight="bold" fill="%230369a1">登録番号: T5010001012345</text></svg>',
    entryDate: '2026-08-15',
    vendorName: '日本交通株式会社',
    vendorInvoiceNo: 'T5010001012345',
    debitAccountCode: '520', // 旅費交通費
    debitAmount: '4200',
    description: '日本交通 タクシー移動（東京〜渋谷）',
    aiConfidenceScore: 0.94,
  },
];

export interface PostedJournal {
  id: string;
  entryNumber: number;
  entryDate: string;
  description: string;
  debitAccountName: string;
  debitCode: string;
  debitAmount: string;
  creditAccountName: string;
  creditCode: string;
  creditAmount: string;
  status: 'POSTED' | 'REVERSED';
}

export const INITIAL_POSTED_JOURNALS: PostedJournal[] = [
  {
    id: 'JE-1001',
    entryNumber: 1001,
    entryDate: '2026-08-01',
    description: '8月分 オフィス家賃支払い',
    debitAccountName: '地代家賃',
    debitCode: '525',
    debitAmount: '350000',
    creditAccountName: '普通預金',
    creditCode: '113',
    creditAmount: '350000',
    status: 'POSTED',
  },
  {
    id: 'JE-1002',
    entryNumber: 1002,
    entryDate: '2026-08-05',
    description: '株式会社テックワン システム開発受託売上',
    debitAccountName: '売掛金',
    debitCode: '131',
    debitAmount: '2420000',
    creditAccountName: '売上高',
    creditCode: '411',
    creditAmount: '2420000',
    status: 'POSTED',
  },
  {
    id: 'JE-1003',
    entryNumber: 1003,
    entryDate: '2026-08-08',
    description: 'デザイン外注費 支払い',
    debitAccountName: '外注費',
    debitCode: '512',
    debitAmount: '440000',
    creditAccountName: '普通預金',
    creditCode: '113',
    creditAmount: '440000',
    status: 'POSTED',
  },
  {
    id: 'JE-1004',
    entryNumber: 1004,
    entryDate: '2026-08-10',
    description: 'AWS クラウドサーバー利用料',
    debitAccountName: '通信費',
    debitCode: '521',
    debitAmount: '86400',
    creditAccountName: '普通預金',
    creditCode: '113',
    creditAmount: '86400',
    status: 'POSTED',
  },
];
