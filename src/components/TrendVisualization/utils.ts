
// Helper function to generate trend data for visualization
export const generateTrendData = (days: number, baseValue: number, volatility: number, trend: number = 0) => {
  const data = [];
  let currentValue = baseValue;
  
  for (let i = days; i >= 0; i--) {
    // Calculate date
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    // Add directional trend (positive or negative)
    currentValue += trend;
    
    // Add random volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    currentValue = Math.max(currentValue + randomFactor, 0); // Avoid negative values
    
    data.push({
      date: dateStr,
      value: Number(currentValue.toFixed(2))
    });
  }
  
  return data;
};

export interface MetricConfig {
  title: string;
  color: string;
  dataKey: string;
  valuePrefix: string;
  valueSuffix: string;
  baseValue: number;
  volatility: number;
  trend: number;
  yAxisFormatter: (value: number) => string;
}

// Metric configurations
export const getMetricConfigs = (diagnostics: any) => ({
  roi: {
    title: "ROI ao Longo do Tempo",
    color: "#4299E1", // blue
    dataKey: "value",
    valuePrefix: "",
    valueSuffix: "x",
    baseValue: diagnostics?.currentROI || 1.2,
    volatility: 0.15,
    trend: 0.01, // slightly positive trend
    yAxisFormatter: (value: number) => `${value.toFixed(1)}x`
  },
  revenue: {
    title: "Receita Diária",
    color: "#48BB78", // green
    dataKey: "value",
    valuePrefix: "R$ ",
    valueSuffix: "",
    baseValue: (diagnostics?.totalRevenue || 1000) / 30, // average daily revenue
    volatility: 200,
    trend: 5, // positive trend
    yAxisFormatter: (value: number) => `R$ ${value.toFixed(0)}`
  },
  cpa: {
    title: "Custo por Aquisição",
    color: "#F56565", // red
    dataKey: "value",
    valuePrefix: "R$ ",
    valueSuffix: "",
    baseValue: diagnostics?.adSpend ? (diagnostics.adSpend / (diagnostics.mainProductSales + diagnostics.comboSales)) : 15,
    volatility: 3,
    trend: -0.05, // negative trend (improving over time)
    yAxisFormatter: (value: number) => `R$ ${value.toFixed(2)}`
  },
  conversion: {
    title: "Taxa de Conversão",
    color: "#9F7AEA", // purple
    dataKey: "value",
    valuePrefix: "",
    valueSuffix: "%",
    baseValue: diagnostics?.salesPageConversion || 2,
    volatility: 0.4,
    trend: 0.02, // slight positive trend
    yAxisFormatter: (value: number) => `${value.toFixed(1)}%`
  }
});
