
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { MetricCard } from "./MetricCard";
import { HistoricalMetrics } from "./types";
import { getROIStatus } from "./useFinanceCalculations";

interface OverviewTabProps {
  metrics: {
    totalRevenue: number;
    profit: number;
    profitMargin: number;
    adSpend: number;
    totalSales: number;
    aov: number;
    monthlyTarget: number;
    monthlyProjection: number;
    targetProgress: number;
    currentROI: number;
  };
  historicalMetrics: HistoricalMetrics | null;
  isLoadingHistorical: boolean;
}

export function OverviewTab({ metrics, historicalMetrics, isLoadingHistorical }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Receita Total"
          value={metrics.totalRevenue}
          format="currency"
          subtitle={`${metrics.totalSales} pedidos • ${formatCurrency(metrics.aov)} ticket médio`}
          historicalValue={!isLoadingHistorical && historicalMetrics ? historicalMetrics.revenue : undefined}
          showComparison={!isLoadingHistorical && !!historicalMetrics}
        />
        
        <MetricCard
          title="Lucro"
          value={metrics.profit}
          format="currency"
          historicalValue={!isLoadingHistorical && historicalMetrics ? historicalMetrics.profit : undefined}
          showComparison={!isLoadingHistorical && !!historicalMetrics}
          additionalContent={
            <Badge 
              variant={metrics.profit >= 0 ? "success" : "destructive"}
              className="text-xs font-normal mt-1 dark:bg-opacity-90 dark:text-white shadow-sm"
            >
              Margem: {metrics.profitMargin.toFixed(1)}%
            </Badge>
          }
        />
        
        <MetricCard
          title="ROI"
          value={`${metrics.currentROI.toFixed(2)}x`}
          format="number"
          subtitle={`${formatCurrency(metrics.adSpend)} investido em anúncios`}
          badge={{
            text: metrics.currentROI >= 1.5 ? "Ótimo" : 
                 metrics.currentROI >= 1 ? "Aceitável" : "Preocupante",
            variant: getROIStatus(metrics.currentROI)
          }}
          historicalValue={!isLoadingHistorical && historicalMetrics ? historicalMetrics.roi : undefined}
          showComparison={!isLoadingHistorical && !!historicalMetrics}
        />
      </div>
      
      <Card className="border-dashed border-gray-200 dark:border-gray-700 dark:bg-gray-800/90 shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm text-gray-700 dark:text-white">Projeção Mensal</h3>
            
            {!isLoadingHistorical && historicalMetrics && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                </svg>
                Comparado com a média histórica
              </div>
            )}
          </div>
          
          <div className="flex justify-between mb-1 dark:text-white">
            <span className="text-sm font-medium">Meta: {formatCurrency(metrics.monthlyTarget)}</span>
            <span className="text-sm font-medium">Projeção: {formatCurrency(metrics.monthlyProjection)}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-1">
            <div 
              className={`h-2.5 rounded-full ${
                metrics.targetProgress >= 100 ? 'bg-green-500' : 
                metrics.targetProgress >= 70 ? 'bg-yellow-400' : 'bg-red-400'
              }`} 
              style={{ width: `${Math.min(metrics.targetProgress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            {metrics.targetProgress.toFixed(1)}% da meta mensal
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
