
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { periodsOverlap } from "@/components/TrendVisualization/utils";
import { HistoricalFormData, HistoricalDiagnostics, HistoricalMetrics } from "./types";

export const useHistoricalMetrics = (formData: any) => {
  const [historicalMetrics, setHistoricalMetrics] = useState<HistoricalMetrics | null>(null);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(true);
  
  useEffect(() => {
    const fetchHistoricalMetrics = async () => {
      try {
        setIsLoadingHistorical(true);
        
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          return;
        }
        
        const { data, error } = await supabase
          .from("user_analyses")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (!data || data.length === 0) return;
        
        // Get current period dates
        const currentStartDate = formData?.startDate ? new Date(formData.startDate) : null;
        const currentEndDate = formData?.endDate ? new Date(formData.endDate) : null;
        
        // Filter out analyses with overlapping periods
        const nonOverlappingAnalyses = data.filter((analysis) => {
          if (!currentStartDate || !currentEndDate) return true;
          
          const formDataObj = analysis.form_data as HistoricalFormData;
          
          const analysisStartDate = formDataObj.startDate 
            ? new Date(formDataObj.startDate) 
            : null;
          
          const analysisEndDate = formDataObj.endDate 
            ? new Date(formDataObj.endDate) 
            : null;
            
          if (!analysisStartDate || !analysisEndDate) return true;
          
          return !periodsOverlap(
            currentStartDate, 
            currentEndDate, 
            analysisStartDate, 
            analysisEndDate
          );
        });
        
        // Calculate average metrics from historical data
        if (nonOverlappingAnalyses.length > 0) {
          let totalRevenue = 0;
          let totalProfit = 0;
          let totalRoi = 0;
          let totalCac = 0;
          let totalLtv = 0;
          let totalAov = 0;
          let validCount = 0;
          
          nonOverlappingAnalyses.forEach((analysis) => {
            if (analysis.diagnostics) {
              validCount++;
              
              // Calculate basic metrics
              const diagnosticsObj = analysis.diagnostics as HistoricalDiagnostics;
              const formDataObj = analysis.form_data as HistoricalFormData;
              
              const revenue = diagnosticsObj.totalRevenue || 0;
              const adSpend = formDataObj.adSpend || 0;
              const profit = revenue - adSpend;
              const roi = diagnosticsObj.currentROI || 0;
              
              // Calculate sales metrics
              const totalSales = (formDataObj.mainProductSales || 0) + 
                              (formDataObj.comboSales || 0);
              const aov = totalSales > 0 ? revenue / totalSales : 0;
              const cac = totalSales > 0 ? adSpend / totalSales : 0;
              
              // Fix for LTV calculation
              const ltv = aov > 0 ? Math.max(aov * 1.5, 100) : 100;
              
              // Add to totals
              totalRevenue += revenue;
              totalProfit += profit;
              totalRoi += roi;
              totalCac += cac;
              totalLtv += ltv;
              totalAov += aov;
            }
          });
          
          if (validCount > 0) {
            setHistoricalMetrics({
              revenue: totalRevenue / validCount,
              profit: totalProfit / validCount,
              roi: totalRoi / validCount,
              cac: totalCac / validCount,
              ltv: totalLtv / validCount,
              averageOrderValue: totalAov / validCount
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar métricas históricas:", error);
      } finally {
        setIsLoadingHistorical(false);
      }
    };
    
    fetchHistoricalMetrics();
  }, [formData]);

  return { historicalMetrics, isLoadingHistorical };
};
