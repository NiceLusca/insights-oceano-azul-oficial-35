
import { z } from "zod";

export const idealMetrics = {
  salesPageConversion: 0.4,
  checkoutConversion: 0.4,
  comboRate: 0.35,
  orderBumpRate: 0.3,
  upsellRate: 0.05,
};

export const calculateMetrics = (values: any) => {
  const messages = [];
  
  const salesPageConversion = values.salesPageVisits > 0 ? (values.checkoutVisits / values.salesPageVisits) * 100 : 0;
  const checkoutConversion = values.checkoutVisits > 0 ? ((values.mainProductSales + values.comboSales) / values.checkoutVisits) * 100 : 0;
  
  const totalSales = values.mainProductSales + values.comboSales;
  const comboRate = totalSales > 0 ? (values.comboSales / totalSales) * 100 : 0;
  
  const orderBumpRate = totalSales > 0 ? (values.orderBumpSales / totalSales) * 100 : 0;
  const upsellRate = totalSales > 0 ? (values.upsellSales / totalSales) * 100 : 0;
  const finalConversion = values.totalClicks > 0 ? ((values.mainProductSales + values.comboSales) / values.totalClicks) * 100 : 0;

  const totalRevenue = 
    values.mainProductSales * values.mainProductPrice +
    values.comboSales * values.comboPrice +
    values.orderBumpSales * values.orderBumpPrice +
    (values.hasUpsell ? values.upsellSales * values.upsellPrice : 0);

  const monthlyGoalProgress = values.monthlyRevenue ? totalRevenue / values.monthlyRevenue : undefined;

  if (salesPageConversion < idealMetrics.salesPageConversion * 100) {
    messages.push({
      type: "error",
      message: "❌ Sua taxa de conversão da página de vendas está abaixo do ideal (40%). Revise sua página de vendas."
    });
  } else {
    messages.push({
      type: "success",
      message: "✅ Sua taxa de conversão da página de vendas está ótima!"
    });
  }

  if (checkoutConversion < idealMetrics.checkoutConversion * 100) {
    messages.push({
      type: "error",
      message: "❌ Sua taxa de conversão do checkout está abaixo do ideal (40%). Revise seu processo de checkout."
    });
  } else {
    messages.push({
      type: "success",
      message: "✅ Sua taxa de conversão do checkout está excelente!"
    });
  }

  if (comboRate < idealMetrics.comboRate * 100) {
    messages.push({
      type: "warning",
      message: "⚠️ Sua taxa de combo está abaixo do ideal (35%). Considere revisar sua oferta de combo."
    });
  } else {
    messages.push({
      type: "success",
      message: "✅ Sua taxa de combo está dentro ou acima do ideal. Parabéns!"
    });
  }
  
  if (orderBumpRate < idealMetrics.orderBumpRate * 100) {
    const faltaOrderBumps = Math.ceil((idealMetrics.orderBumpRate * totalSales) - values.orderBumpSales);
    messages.push({
      type: "warning",
      message: `⚠️ Sua taxa de order bump está abaixo do ideal (30%). Você está vendendo apenas ${orderBumpRate.toFixed(1)}% quando deveria vender 30%. Faltam aproximadamente ${faltaOrderBumps} order bumps para atingir o ideal.`
    });
  } else {
    messages.push({
      type: "success",
      message: "✅ Sua taxa de order bump está dentro ou acima do ideal. Parabéns!"
    });
  }

  if (values.hasUpsell && upsellRate < idealMetrics.upsellRate * 100) {
    messages.push({
      type: "warning",
      message: "⚠️ Sua taxa de upsell está abaixo do ideal (5%). Considere melhorar sua estratégia de upsell."
    });
  } else if (values.hasUpsell) {
    messages.push({
      type: "success",
      message: "✅ Sua taxa de upsell está dentro ou acima do ideal!"
    });
  }

  let currentROI, maxCPC;
  if (values.adSpend && values.adSpend > 0) {
    currentROI = totalRevenue / values.adSpend;
    maxCPC = (totalRevenue / values.targetROI) / values.totalClicks;
  }

  return {
    totalRevenue,
    currentROI,
    maxCPC,
    salesPageConversion,
    checkoutConversion,
    finalConversion,
    monthlyGoalProgress,
    adSpend: values.adSpend,
    orderBumpRate,
    messages
  };
};

export const getComparisonData = (values: any) => {
  const salesPageConversion = values.salesPageVisits > 0 ? (values.checkoutVisits / values.salesPageVisits) * 100 : 0;
  const checkoutConversion = values.checkoutVisits > 0 ? ((values.mainProductSales + values.comboSales) / values.checkoutVisits) * 100 : 0;
  
  const totalSales = values.mainProductSales + values.comboSales;
  const comboRate = totalSales > 0 ? (values.comboSales / totalSales) * 100 : 0;
  
  const orderBumpRate = totalSales > 0 ? (values.orderBumpSales / totalSales) * 100 : 0;
  
  const upsellRate = totalSales > 0 ? (values.upsellSales / totalSales) * 100 : 0;

  const data = [
    {
      name: "Página de Vendas",
      actual: Number(salesPageConversion.toFixed(1)),
      ideal: idealMetrics.salesPageConversion * 100,
    },
    {
      name: "Checkout",
      actual: Number(checkoutConversion.toFixed(1)),
      ideal: idealMetrics.checkoutConversion * 100,
    },
    {
      name: "Taxa Combo",
      actual: Number(comboRate.toFixed(1)),
      ideal: idealMetrics.comboRate * 100,
    },
    {
      name: "Order Bump",
      actual: Number(orderBumpRate.toFixed(1)),
      ideal: idealMetrics.orderBumpRate * 100,
    },
  ];
  
  if (values.hasUpsell) {
    data.push({
      name: "Taxa Upsell",
      actual: Number(upsellRate.toFixed(1)),
      ideal: idealMetrics.upsellRate * 100,
    });
  }
  
  return data;
};
