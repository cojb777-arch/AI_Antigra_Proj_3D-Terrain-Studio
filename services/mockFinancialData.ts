import { FinancialBaseData } from './financialIndicators';

export const BASE_FINANCIAL_DATA: FinancialBaseData = {
  sales: 48000000,              // 年間売上高: 4,800万円 (月商400万円)
  operatingIncome: 7200000,      // 営業利益: 720万円 (利益率 15.0%)
  netIncome: 4800000,            // 当期純利益: 480万円
  currentAssets: 32000000,       // 流動資産: 3,200万円
  fixedAssets: 8000000,          // 固定資産: 800万円
  totalAssets: 40000000,         // 総資産: 4,000万円
  currentLiabilities: 12000000,   // 流動負債: 1,200万円
  fixedLiabilities: 8000000,     // 固定負債 (長期借入金等): 800万円
  totalLiabilities: 20000000,    // 負債合計: 2,000万円
  equity: 20000000,              // 自己資本 (純資産): 2,000万円 (自己資本比率 50%)
  interestBearingDebt: 10000000, // 有利子負債: 1,000万円
  accountsReceivable: 6500000,   // 売掛金: 650万円 (約1.6か月分)
  inventory: 1500000,            // 棚卸資産: 150万円
  accountsPayable: 3000000,      // 買掛金: 300万円
  issuedShares: 10000,           // 発行済株式数: 10,000株 (EPS: 480円, BPS: 2,000円)
};

// 月次キャッシュフロー計算書データ (1月〜12月)
export interface MonthlyCashflowItem {
  month: string;
  operatingCf: number;
  investingCf: number;
  financingCf: number;
  netChange: number;
  endingCash: number;
}

export const MONTHLY_CASHFLOW_DATA: MonthlyCashflowItem[] = [
  { month: '1月', operatingCf: 520000, investingCf: -100000, financingCf: -200000, netChange: 220000, endingCash: 14220000 },
  { month: '2月', operatingCf: 480000, investingCf: 0, financingCf: -200000, netChange: 280000, endingCash: 14500000 },
  { month: '3月', operatingCf: 750000, investingCf: -500000, financingCf: -200000, netChange: 50000, endingCash: 14550000 },
  { month: '4月', operatingCf: 610000, investingCf: 0, financingCf: -200000, netChange: 410000, endingCash: 14960000 },
  { month: '5月', operatingCf: 590000, investingCf: -200000, financingCf: -200000, netChange: 190000, endingCash: 15150000 },
  { month: '6月', operatingCf: 820000, investingCf: 0, financingCf: -200000, netChange: 620000, endingCash: 15770000 },
  { month: '7月', operatingCf: 430000, investingCf: -300000, financingCf: -200000, netChange: -70000, endingCash: 15700000 },
  { month: '8月', operatingCf: 670000, investingCf: 0, financingCf: -200000, netChange: 470000, endingCash: 16170000 },
  { month: '9月', operatingCf: 540000, investingCf: -150000, financingCf: -200000, netChange: 190000, endingCash: 16360000 },
  { month: '10月', operatingCf: 620000, investingCf: 0, financingCf: -200000, netChange: 420000, endingCash: 16780000 },
  { month: '11月', operatingCf: 580000, investingCf: -100000, financingCf: -200000, netChange: 280000, endingCash: 17060000 },
  { month: '12月', operatingCf: 890000, investingCf: -250000, financingCf: -200000, netChange: 440000, endingCash: 17500000 },
];

// 運転資金の月次推移データ
export interface MonthlyWorkingCapitalItem {
  month: string;
  sales: number;
  receivables: number;  // 売掛金
  inventory: number;    // 在庫
  payables: number;     // 買掛金
  operatingWc: number;  // 経常運転資金 = 売掛 + 在庫 - 買掛
  ratioToMonthlySales: number; // 月商倍率
}

export const MONTHLY_WORKING_CAPITAL_DATA: MonthlyWorkingCapitalItem[] = [
  { month: '1月', sales: 3800000, receivables: 5800000, inventory: 1400000, payables: 2600000, operatingWc: 4600000, ratioToMonthlySales: 1.21 },
  { month: '2月', sales: 3700000, receivables: 5600000, inventory: 1350000, payables: 2500000, operatingWc: 4450000, ratioToMonthlySales: 1.20 },
  { month: '3月', sales: 4500000, receivables: 6800000, inventory: 1600000, payables: 3100000, operatingWc: 5300000, ratioToMonthlySales: 1.18 },
  { month: '4月', sales: 3900000, receivables: 5900000, inventory: 1450000, payables: 2700000, operatingWc: 4650000, ratioToMonthlySales: 1.19 },
  { month: '5月', sales: 4100000, receivables: 6200000, inventory: 1500000, payables: 2800000, operatingWc: 4900000, ratioToMonthlySales: 1.20 },
  { month: '6月', sales: 4600000, receivables: 7000000, inventory: 1700000, payables: 3200000, operatingWc: 5500000, ratioToMonthlySales: 1.20 },
  { month: '7月', sales: 3900000, receivables: 6000000, inventory: 1450000, payables: 2750000, operatingWc: 4700000, ratioToMonthlySales: 1.21 },
  { month: '8月', sales: 4200000, receivables: 6400000, inventory: 1500000, payables: 2900000, operatingWc: 5000000, ratioToMonthlySales: 1.19 },
  { month: '9月', sales: 4000000, receivables: 6100000, inventory: 1480000, payables: 2800000, operatingWc: 4780000, ratioToMonthlySales: 1.20 },
  { month: '10月', sales: 4300000, receivables: 6500000, inventory: 1520000, payables: 2950000, operatingWc: 5070000, ratioToMonthlySales: 1.18 },
  { month: '11月', sales: 4200000, receivables: 6300000, inventory: 1500000, payables: 2850000, operatingWc: 4950000, ratioToMonthlySales: 1.18 },
  { month: '12月', sales: 4800000, receivables: 7300000, inventory: 1750000, payables: 3350000, operatingWc: 5700000, ratioToMonthlySales: 1.19 },
];

// 月次試算表（合計残高試算表）データ
export interface MonthlyTrialBalanceRow {
  code: string;
  name: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  months: number[]; // 1月〜12月
  total: number;
}

export const MONTHLY_TRIAL_BALANCE_DATA: MonthlyTrialBalanceRow[] = [
  // 資産
  { code: '111', name: '現金', category: 'Asset', months: [500, 480, 520, 510, 490, 530, 500, 520, 510, 540, 530, 550].map(v => v * 1000), total: 550000 },
  { code: '113', name: '普通預金', category: 'Asset', months: [13720, 14020, 14030, 14450, 14660, 15240, 15200, 15650, 15850, 16240, 16530, 16950].map(v => v * 1000), total: 16950000 },
  { code: '131', name: '売掛金', category: 'Asset', months: [5800, 5600, 6800, 5900, 6200, 7000, 6000, 6400, 6100, 6500, 6300, 7300].map(v => v * 1000), total: 7300000 },
  { code: '141', name: '商品（在庫）', category: 'Asset', months: [1400, 1350, 1600, 1450, 1500, 1700, 1450, 1500, 1480, 1520, 1500, 1750].map(v => v * 1000), total: 1750000 },
  { code: '171', name: '工具器具備品', category: 'Asset', months: Array(12).fill(8000000), total: 8000000 },

  // 負債
  { code: '211', name: '買掛金', category: 'Liability', months: [2600, 2500, 3100, 2700, 2800, 3200, 2750, 2900, 2800, 2950, 2850, 3350].map(v => v * 1000), total: 3350000 },
  { code: '221', name: '短期借入金', category: 'Liability', months: Array(12).fill(2000000), total: 2000000 },
  { code: '251', name: '長期借入金', category: 'Liability', months: [9800, 9600, 9400, 9200, 9000, 8800, 8600, 8400, 8200, 8000, 7800, 7600].map(v => v * 1000), total: 7600000 },

  // 純資産
  { code: '311', name: '資本金', category: 'Equity', months: Array(12).fill(10000000), total: 10000000 },

  // 収益
  { code: '411', name: '売上高', category: 'Revenue', months: [3800, 3700, 4500, 3900, 4100, 4600, 3900, 4200, 4000, 4300, 4200, 4800].map(v => v * 1000), total: 50000000 },

  // 費用
  { code: '511', name: '仕入高', category: 'Expense', months: [1400, 1350, 1600, 1450, 1500, 1700, 1450, 1500, 1480, 1520, 1500, 1750].map(v => v * 1000), total: 18200000 },
  { code: '512', name: '外注費', category: 'Expense', months: [700, 680, 800, 720, 750, 850, 720, 780, 750, 800, 780, 900].map(v => v * 1000), total: 9230000 },
  { code: '525', name: '地代家賃', category: 'Expense', months: Array(12).fill(350000), total: 4200000 },
  { code: '526', name: '給料手当', category: 'Expense', months: Array(12).fill(550000), total: 6600000 },
];
