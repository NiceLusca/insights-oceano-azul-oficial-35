
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/schemas/formSchema";
import { isWithinInterval } from "date-fns";

interface HistoricalAnalysis {
  id: string;
  created_at: string;
  form_data: FormValues;
  diagnostics: any;
}

// Helper function to check if a period overlaps with another
export const periodsOverlap = (
  period1Start: Date | string, 
  period1End: Date | string,
  period2Start: Date | string,
  period2End: Date | string
) => {
  const start1 = period1Start instanceof Date ? period1Start : new Date(period1Start);
  const end1 = period1End instanceof Date ? period1End : new Date(period1End);
  const start2 = period2Start instanceof Date ? period2Start : new Date(period2Start);
  const end2 = period2End instanceof Date ? period2End : new Date(period2End);

  return (
    isWithinInterval(start1, { start: start2, end: end2 }) ||
    isWithinInterval(end1, { start: start2, end: end2 }) ||
    isWithinInterval(start2, { start: start1, end: end1 }) ||
    isWithinInterval(end2, { start: start1, end: end1 })
  );
};

// Function to fetch historical data from Supabase
export const fetchHistoricalData = async (): Promise<HistoricalAnalysis[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("user_analyses")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    
    return data as HistoricalAnalysis[];
  } catch (error) {
    console.error("Erro ao carregar dados históricos:", error);
    return [];
  }
};

// Helper function to generate trend data for visualization
export const generateTrendData = async (
  days: number, 
  baseValue: number, 
  volatility: number, 
  trend: number = 0,
  currentData: FormValues
) => {
  // First get data from simple algorithm for backfilling
  const simulatedData = generateSimulatedTrendData(days, baseValue, volatility, trend);
  
  try {
    // Fetch historical data
    const historicalAnalyses = await fetchHistoricalData();
    
    if (historicalAnalyses.length === 0) {
      return simulatedData;
    }
    
    // Enhance simulated data with historical data points
    const enhancedData = [...simulatedData];
    const currentStart = currentData.startDate ? new Date(currentData.startDate) : null;
    const currentEnd = currentData.endDate ? new Date(currentData.endDate) : null;
    
    // Go through historical data and integrate non-overlapping periods
    historicalAnalyses.forEach(analysis => {
      const analysisStartDate = analysis.form_data.startDate ? new Date(analysis.form_data.startDate) : null;
      const analysisEndDate = analysis.form_data.endDate ? new Date(analysis.form_data.endDate) : null;
      
      // Skip if dates are missing or this is the current analysis period
      if (!analysisStartDate || !analysisEndDate || !currentStart || !currentEnd) {
        return;
      }
      
      // Skip if periods overlap
      if (periodsOverlap(currentStart, currentEnd, analysisStartDate, analysisEndDate)) {
        return;
      }
      
      // Calculate the average date for this analysis
      const avgDate = new Date((analysisStartDate.getTime() + analysisEndDate.getTime()) / 2);
      const dateStr = avgDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      // Try to find matching date in existing data
      const existingIndex = enhancedData.findIndex(d => d.date === dateStr);
      
      // Determine which metric to use based on the metric type
      const metricValue = analysis.diagnostics?.currentROI || analysis.diagnostics?.totalRevenue / 30 || 0;
      
      if (existingIndex >= 0) {
        // Update existing data point
        enhancedData[existingIndex] = {
          ...enhancedData[existingIndex],
          value: metricValue,
          historical: true
        };
      } else {
        // Insert new data point and sort by date
        enhancedData.push({
          date: dateStr,
          value: metricValue,
          historical: true
        });
      }
    });
    
    // Sort data by date
    enhancedData.sort((a, b) => {
      const dateA = new Date(`01/${a.date}`);
      const dateB = new Date(`01/${b.date}`);
      return dateA.getTime() - dateB.getTime();
    });
    
    return enhancedData;
  } catch (error) {
    console.error("Erro ao processar dados históricos:", error);
    return simulatedData;
  }
};

// Original simulation function for backfilling
export const generateSimulatedTrendData = (days: number, baseValue: number, volatility: number, trend: number = 0) => {
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
      value: Number(currentValue.toFixed(2)),
      historical: false
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
