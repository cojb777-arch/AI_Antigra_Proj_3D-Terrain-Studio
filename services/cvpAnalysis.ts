import { Decimal } from 'decimal.js';

export type CvpAnalysisResult = {
  sales: string;                  // 売上高
  variableCost: string;           // 変動費合計
  fixedCost: string;              // 固定費合計
  marginalProfit: string;         // 限界利益 (売上高 - 変動費)
  marginalProfitRatio: string;    // 限界利益率 (限界利益 / 売上高)
  operatingIncome: string;        // 営業利益 (限界利益 - 固定費)
  breakEvenPointSales: string;    // 損益分岐点売上高 (固定費 / 限界利益率)
  safetyMarginAmount: string;     // 安全裕度額 (売上高 - 損益分岐点売上高)
  safetyMarginRatio: string;      // 安全率 (%)
  breakEvenRatio: string;         // 損益分岐比率 (%)
  targetSalesForProfit: (targetProfit: string) => string;
};

export function calculateCvpFromRawValues(
  rawSales: number | string,
  rawVariableCost: number | string,
  rawFixedCost: number | string
): CvpAnalysisResult {
  const sales = new Decimal(rawSales || 0);
  const variableCost = new Decimal(rawVariableCost || 0);
  const fixedCost = new Decimal(rawFixedCost || 0);

  // 限界利益 = 売上高 - 変動費
  const marginalProfit = sales.minus(variableCost);

  // 限界利益率 = 限界利益 / 売上高
  const marginalProfitRatio = sales.gt(0)
    ? marginalProfit.div(sales)
    : new Decimal(0);

  // 営業利益 = 限界利益 - 固定費
  const operatingIncome = marginalProfit.minus(fixedCost);

  // 損益分岐点売上高 = 固定費 / 限界利益率
  const breakEvenPointSales = marginalProfitRatio.gt(0)
    ? fixedCost.div(marginalProfitRatio).ceil()
    : new Decimal(0);

  // 安全裕度額 = 売上高 - 損益分岐点売上高
  const safetyMarginAmount = sales.minus(breakEvenPointSales);

  // 安全率 (%) = (安全裕度額 / 売上高) * 100
  const safetyMarginRatio = sales.gt(0)
    ? safetyMarginAmount.div(sales).mul(100).toFixed(2)
    : '0.00';

  // 損益分岐比率 (%) = (損益分岐点売上高 / 売上高) * 100
  const breakEvenRatio = sales.gt(0)
    ? breakEvenPointSales.div(sales).mul(100).toFixed(2)
    : '0.00';

  return {
    sales: sales.toFixed(),
    variableCost: variableCost.toFixed(),
    fixedCost: fixedCost.toFixed(),
    marginalProfit: marginalProfit.toFixed(),
    marginalProfitRatio: marginalProfitRatio.toFixed(4),
    operatingIncome: operatingIncome.toFixed(),
    breakEvenPointSales: breakEvenPointSales.toFixed(),
    safetyMarginAmount: safetyMarginAmount.toFixed(),
    safetyMarginRatio,
    breakEvenRatio,
    targetSalesForProfit: (targetProfit: string) => {
      const target = new Decimal(targetProfit || 0);
      if (marginalProfitRatio.isZero()) return '0';
      return fixedCost.plus(target).div(marginalProfitRatio).ceil().toFixed();
    },
  };
}
