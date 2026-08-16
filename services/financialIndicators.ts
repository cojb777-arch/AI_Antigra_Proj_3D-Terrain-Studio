import { Decimal } from 'decimal.js';

export interface FinancialIndicatorsResult {
  // 収益性指標
  roe: string;               // 自己資本利益率 (%) = 当期純利益 / 自己資本 * 100
  roa: string;               // 総資産利益率 (%) = 営業利益 / 総資産 * 100
  operatingProfitMargin: string; // 売上高営業利益率 (%) = 営業利益 / 売上高 * 100
  netProfitMargin: string;   // 売上高当期純利益率 (%) = 当期純利益 / 売上高 * 100

  // 安全性指標
  equityRatio: string;       // 自己資本比率 (%) = 自己資本 / 総資産 * 100
  currentRatio: string;      // 流動比率 (%) = 流動資産 / 流動負債 * 100
  fixedRatio: string;        // 固定比率 (%) = 固定資産 / 自己資本 * 100
  debtToMonthlySalesRatio: string; // 有利子負債月商倍率 (か月) = 有利子負債 / (売上高 / 12)

  // 投資・企業価値指標 (株価シミュレーション対応)
  eps: string;               // 1株当たり当期純利益 (円)
  bps: string;               // 1株当たり純資産 (円)
  per: (stockPrice: number | string) => string; // PER (株価収益率) = 株価 / EPS
  pbr: (stockPrice: number | string) => string; // PBR (株価純資産倍率) = 株価 / BPS

  // 運転資金
  operatingWorkingCapital: string; // 経常運転資金 = 売上債権 + 棚卸資産 - 仕入債務
  workingCapitalSalesRatio: string; // 運転資金月商比率 (か月) = 経常運転資金 / (売上高 / 12)
  longTermWorkingCapital: string;  // 長期運転資金 = 経常運転資金 + 固定資産 - (固定負債 + 純資産)
}

export interface FinancialBaseData {
  sales: number | string;           // 売上高
  operatingIncome: number | string; // 営業利益
  netIncome: number | string;       // 当期純利益
  currentAssets: number | string;   // 流動資産
  fixedAssets: number | string;     // 固定資産
  totalAssets: number | string;     // 総資産 (流動資産 + 固定資産)
  currentLiabilities: number | string; // 流動負債
  fixedLiabilities: number | string;   // 固定負債
  totalLiabilities: number | string;   // 負債合計
  equity: number | string;          // 自己資本 (純資産)
  interestBearingDebt: number | string; // 有利子負債
  accountsReceivable: number | string;  // 売上債権 (売掛金+受取手形)
  inventory: number | string;       // 棚卸資産
  accountsPayable: number | string; // 仕入債務 (買掛金+支払手形)
  issuedShares: number;             // 発行済株式数
}

export function calculateFinancialIndicators(data: FinancialBaseData): FinancialIndicatorsResult {
  const sales = new Decimal(data.sales || 0);
  const operatingIncome = new Decimal(data.operatingIncome || 0);
  const netIncome = new Decimal(data.netIncome || 0);
  const currentAssets = new Decimal(data.currentAssets || 0);
  const fixedAssets = new Decimal(data.fixedAssets || 0);
  const totalAssets = new Decimal(data.totalAssets || currentAssets.plus(fixedAssets));
  const currentLiabilities = new Decimal(data.currentLiabilities || 0);
  const fixedLiabilities = new Decimal(data.fixedLiabilities || 0);
  const equity = new Decimal(data.equity || 0);
  const interestBearingDebt = new Decimal(data.interestBearingDebt || 0);
  const accountsReceivable = new Decimal(data.accountsReceivable || 0);
  const inventory = new Decimal(data.inventory || 0);
  const accountsPayable = new Decimal(data.accountsPayable || 0);
  const issuedShares = new Decimal(data.issuedShares || 10000);

  // 1. 収益性
  const roe = equity.gt(0) ? netIncome.div(equity).mul(100).toFixed(2) : '0.00';
  const roa = totalAssets.gt(0) ? operatingIncome.div(totalAssets).mul(100).toFixed(2) : '0.00';
  const operatingProfitMargin = sales.gt(0) ? operatingIncome.div(sales).mul(100).toFixed(2) : '0.00';
  const netProfitMargin = sales.gt(0) ? netIncome.div(sales).mul(100).toFixed(2) : '0.00';

  // 2. 安全性
  const equityRatio = totalAssets.gt(0) ? equity.div(totalAssets).mul(100).toFixed(2) : '0.00';
  const currentRatio = currentLiabilities.gt(0) ? currentAssets.div(currentLiabilities).mul(100).toFixed(2) : '0.00';
  const fixedRatio = equity.gt(0) ? fixedAssets.div(equity).mul(100).toFixed(2) : '0.00';

  const monthlySales = sales.gt(0) ? sales.div(12) : new Decimal(1);
  const debtToMonthlySalesRatio = interestBearingDebt.div(monthlySales).toFixed(2);

  // 3. 株式・企業価値 (1株当たり)
  const eps = issuedShares.gt(0) ? netIncome.div(issuedShares).toFixed(2) : '0.00';
  const bps = issuedShares.gt(0) ? equity.div(issuedShares).toFixed(2) : '0.00';

  // 4. 運転資金
  // 経常運転資金 = 売上債権 + 棚卸資産 - 仕入債務
  const operatingWorkingCapital = accountsReceivable.plus(inventory).minus(accountsPayable);
  const workingCapitalSalesRatio = operatingWorkingCapital.div(monthlySales).toFixed(2);

  // 長期運転資金 = 経常運転資金 + 固定資産 - (固定負債 + 純資産)
  const longTermFunds = fixedLiabilities.plus(equity);
  const longTermWorkingCapital = operatingWorkingCapital.plus(fixedAssets).minus(longTermFunds);

  return {
    roe,
    roa,
    operatingProfitMargin,
    netProfitMargin,
    equityRatio,
    currentRatio,
    fixedRatio,
    debtToMonthlySalesRatio,
    eps,
    bps,
    per: (stockPrice: number | string) => {
      const price = new Decimal(stockPrice || 0);
      const epsDec = new Decimal(eps);
      if (epsDec.lte(0)) return 'N/A';
      return price.div(epsDec).toFixed(2);
    },
    pbr: (stockPrice: number | string) => {
      const price = new Decimal(stockPrice || 0);
      const bpsDec = new Decimal(bps);
      if (bpsDec.lte(0)) return 'N/A';
      return price.div(bpsDec).toFixed(2);
    },
    operatingWorkingCapital: operatingWorkingCapital.toFixed(),
    workingCapitalSalesRatio,
    longTermWorkingCapital: longTermWorkingCapital.toFixed(),
  };
}
