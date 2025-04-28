
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart2, HistoryIcon } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { HistoricalMetrics } from "./types";
import { getLtvCacStatus, getPercentageChange } from "./useFinanceCalculations";

interface EfficiencyTabProps {
  metrics: {
    cac: number;
    ltv: number;
    ltvToCAC: number;
    currentROI: number;
  };
  historicalMetrics: HistoricalMetrics | null;
  isLoadingHistorical: boolean;
}

export function EfficiencyTab({ metrics, historicalMetrics, isLoadingHistorical }: EfficiencyTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="CAC (Custo de Aquisição)"
          value={metrics.cac}
          format="currency"
          subtitle="Gasto para adquirir cada cliente"
          historicalValue={!isLoadingHistorical && historicalMetrics ? historicalMetrics.cac : undefined}
          showComparison={!isLoadingHistorical && !!historicalMetrics}
        />
        
        <MetricCard
          title="LTV (Valor do Cliente)"
          value={metrics.ltv}
          format="currency"
          subtitle="Valor estimado no ciclo de vida"
          historicalValue={!isLoadingHistorical && historicalMetrics ? historicalMetrics.ltv : undefined}
          showComparison={!isLoadingHistorical && !!historicalMetrics}
        />
        
        <MetricCard
          title="LTV:CAC"
          value={`${metrics.ltvToCAC.toFixed(2)}x`}
          subtitle="Ideal: 3x ou mais"
          badge={{
            text: metrics.ltvToCAC >= 3 ? "Excelente" : 
                 metrics.ltvToCAC >= 1.5 ? "Bom" : "Insuficiente",
            variant: getLtvCacStatus(metrics.ltvToCAC)
          }}
        />
      </div>
      
      <Card className="border-dashed border-gray-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-sm mb-3 text-gray-700">Insights de Eficiência</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className={`p-1 rounded-full ${metrics.currentROI >= 1.5 ? 'bg-green-100' : 'bg-amber-100'}`}>
                {metrics.currentROI >= 1.5 ? 
                  <TrendingUp className="h-4 w-4 text-green-600" /> : 
                  <TrendingDown className="h-4 w-4 text-amber-600" />
                }
              </div>
              <div className="text-sm">
                {metrics.currentROI >= 1.5 ?
                  <span>Seu ROI atual permite escala. Considere aumentar o orçamento em 20%.</span> :
                  <span>Seu ROI ainda é baixo para escala. Foque em otimizar os criativos e página de vendas.</span>
                }
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className={`p-1 rounded-full ${metrics.ltvToCAC >= 3 ? 'bg-green-100' : 'bg-amber-100'}`}>
                <BarChart2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                {metrics.ltvToCAC >= 3 ?
                  <span>Sua relação LTV:CAC está saudável. Você pode aumentar os gastos com aquisição.</span> :
                  <span>Busque aumentar o LTV com ações de retenção ou diminua o CAC com testes em criativos.</span>
                }
              </div>
            </div>
            
            {!isLoadingHistorical && historicalMetrics && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-md">
                <div className="p-1 rounded-full bg-blue-100">
                  <HistoryIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Comparação histórica:</span> Seu CAC atual está 
                    {metrics.cac < historicalMetrics.cac ? (
                      <span className="text-green-600"> {Math.abs(getPercentageChange(metrics.cac, historicalMetrics.cac)).toFixed(1)}% menor </span>
                    ) : (
                      <span className="text-red-600"> {Math.abs(getPercentageChange(metrics.cac, historicalMetrics.cac)).toFixed(1)}% maior </span>
                    )}
                    que a média histórica, enquanto seu ROI está 
                    {metrics.currentROI > historicalMetrics.roi ? (
                      <span className="text-green-600"> {Math.abs(getPercentageChange(metrics.currentROI, historicalMetrics.roi)).toFixed(1)}% melhor.</span>
                    ) : (
                      <span className="text-red-600"> {Math.abs(getPercentageChange(metrics.currentROI, historicalMetrics.roi)).toFixed(1)}% pior.</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
