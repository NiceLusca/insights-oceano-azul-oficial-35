
import { z } from "zod";

export const idealMetrics = {
  salesPageConversion: 0.4,
  checkoutConversion: 0.4,
  comboRate: 0.35,
  orderBumpRate: 0.3,
  upsellRate: 0.05,
  cpaIdeal: 17,
  icMaximo: 6,
  cpcMaximo: 2,
};

export const calculateMetrics = (values: any) => {
  const messages = [];
  
  const salesPageConversion = values.salesPageVisits > 0 ? (values.checkoutVisits / values.salesPageVisits) * 100 : 0;
  const checkoutConversion = values.checkoutVisits > 0 ? ((values.mainProductSales + values.comboSales) / values.checkoutVisits) * 100 : 0;
  const finalConversion = values.salesPageVisits > 0 ? ((values.mainProductSales + values.comboSales) / values.salesPageVisits) * 100 : 0;
  
  // Calcular ordem de faturamento
  const mainProductRevenue = values.mainProductSales * values.mainProductPrice;
  const comboRevenue = values.comboSales * values.comboPrice;
  const orderBumpRevenue = values.orderBumpSales * values.orderBumpPrice;
  const upsellRevenue = values.hasUpsell ? values.upsellSales * values.upsellPrice : 0;
  
  const totalRevenue = mainProductRevenue + comboRevenue + orderBumpRevenue + upsellRevenue;
  
  // Taxa de order bump (baseada nas vendas totais)
  const totalSales = values.mainProductSales + values.comboSales;
  const orderBumpRate = totalSales > 0 ? (values.orderBumpSales / totalSales) * 100 : 0;
  
  // Cálculos financeiros
  let adSpend = values.adSpend || 0;
  let currentROI = adSpend > 0 ? totalRevenue / adSpend : 0;
  let monthlyGoalProgress = values.monthlyRevenue > 0 ? totalRevenue / values.monthlyRevenue : 0;
  
  // CPC
  const totalClicks = values.totalClicks || 0;
  const currentCPC = totalClicks > 0 ? adSpend / totalClicks : 0;
  
  // CPA ideal baseado no ROI desejado
  const targetROI = values.targetROI || 1.5;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const maxCPC = averageOrderValue > 0 ? (averageOrderValue / values.targetROI) / (values.salesPageVisits / totalClicks) : 0;
  
  // Gerar mensagens de diagnóstico
  if (salesPageConversion < 40) {
    messages.push({
      type: "warning",
      message: "A conversão da sua página de vendas está abaixo do ideal (40%). Considere melhorar os elementos persuasivos, teste diferentes chamadas para ação e simplifique o caminho para o checkout."
    });
  }
  
  if (checkoutConversion < 40) {
    messages.push({
      type: "warning",
      message: "A conversão do seu checkout está abaixo do ideal (40%). Simplifique o processo, reduza campos de formulário e adicione elementos de confiança e segurança."
    });
  }
  
  if (orderBumpRate < 30) {
    messages.push({
      type: "warning",
      message: "Sua taxa de order bump está abaixo do ideal (30%). Melhore a proposta de valor, teste diferentes posições no checkout e destaque melhor os benefícios."
    });
  }
  
  if (currentROI && currentROI < 1) {
    messages.push({
      type: "error",
      message: `Seu ROI atual está negativo. Se persistir por 3 dias consecutivos, considere pausar esta campanha e revisar seus criativos.`
    });
  } else if (currentROI && currentROI >= 1 && currentROI < 1.5) {
    messages.push({
      type: "warning",
      message: "Seu ROI está aceitável, mas abaixo do ideal para escala (1.5x). Mantenha o orçamento atual e foque em otimizar criativos e página de vendas."
    });
  } else if (currentROI && currentROI >= 1.5) {
    messages.push({
      type: "success",
      message: `Seu ROI está excelente (${currentROI.toFixed(2)}x). Você pode aumentar o orçamento diário em 20% para escalar seus resultados.`
    });
  }
  
  if (currentCPC > 2) {
    messages.push({
      type: "error",
      message: `Seu CPC atual de ${currentCPC.toFixed(2)} está acima do máximo recomendado (R$2,00). Pause conjuntos/criativos com CPC alto se não estiverem gerando vendas após 2 dias de teste.`
    });
  }
  
  return {
    totalRevenue,
    currentROI,
    maxCPC,
    currentCPC,
    salesPageConversion,
    checkoutConversion,
    finalConversion,
    monthlyGoalProgress,
    adSpend,
    orderBumpRate,
    messages
  };
};

export const getComparisonData = (formData: any) => {
  // Calcular métricas atuais
  const salesPageConversion = formData.salesPageVisits > 0 
    ? (formData.checkoutVisits / formData.salesPageVisits) * 100 
    : 0;
    
  const checkoutConversion = formData.checkoutVisits > 0 
    ? ((formData.mainProductSales + formData.comboSales) / formData.checkoutVisits) * 100 
    : 0;
    
  const totalSales = formData.mainProductSales + formData.comboSales;
  const comboRate = totalSales > 0 
    ? (formData.comboSales / totalSales) * 100 
    : 0;
    
  const orderBumpRate = totalSales > 0 
    ? (formData.orderBumpSales / totalSales) * 100 
    : 0;
    
  const upsellRate = formData.hasUpsell && totalSales > 0 
    ? (formData.upsellSales / totalSales) * 100 
    : 0;

  // Configurar dados para o gráfico de comparação
  const comparisonData = [
    {
      name: "Conversão Página",
      actual: Math.round(salesPageConversion),
      ideal: 40
    },
    {
      name: "Conversão Checkout",
      actual: Math.round(checkoutConversion),
      ideal: 40
    },
    {
      name: "Taxa de Combo",
      actual: Math.round(comboRate),
      ideal: 35
    },
    {
      name: "Taxa Order Bump",
      actual: Math.round(orderBumpRate),
      ideal: 30
    }
  ];

  if (formData.hasUpsell) {
    comparisonData.push({
      name: "Taxa de Upsell",
      actual: Math.round(upsellRate),
      ideal: 5
    });
  }

  return comparisonData;
};
