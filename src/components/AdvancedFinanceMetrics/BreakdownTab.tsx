
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { MetricCard } from "./MetricCard";
import { RevenueBreakdownItem, HistoricalMetrics } from "./types";

interface BreakdownTabProps {
  metrics: {
    aov: number;
    totalSales: number;
    orderBumpRevenue: number;
    upsellRevenue: number;
    totalRevenue: number;
    revenueBreakdown: RevenueBreakdownItem[];
  };
  historicalMetrics: HistoricalMetrics | null;
  isLoadingHistorical: boolean;
}

export function BreakdownTab({ metrics, historicalMetrics, isLoadingHistorical }: BreakdownTabProps) {
  const breakdownColors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm dark:border-blue-600">
          <h3 className="font-medium text-sm mb-3 text-gray-700 dark:text-white">Distribuição de Receita</h3>
          
          <div className="space-y-3">
            {metrics.revenueBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1 dark:text-white">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.value)}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${breakdownColors[index % breakdownColors.length]}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-right text-gray-500 dark:text-gray-300 mt-1">{item.percentage.toFixed(1)}% da receita</div>
                {index < metrics.revenueBreakdown.length - 1 && <Separator className="my-3 dark:bg-gray-700" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Valor Médio do Pedido"
            value={metrics.aov}
            format="currency"
            subtitle={`${metrics.totalSales} pedidos totais`}
            historicalValue={!isLoadingHistorical && historicalMetrics ? historicalMetrics.averageOrderValue : undefined}
            showComparison={!isLoadingHistorical && !!historicalMetrics}
          />
          
          <MetricCard
            title="Incremento por Add-ons"
            value={metrics.orderBumpRevenue + metrics.upsellRevenue}
            format="currency"
            subtitle="Order Bumps + Upsells"
            additionalContent={
              <span className="text-sm font-normal text-gray-600 dark:text-gray-300 inline-block mt-1">
                ({((metrics.orderBumpRevenue + metrics.upsellRevenue) / metrics.totalRevenue * 100).toFixed(1)}% da receita)
              </span>
            }
          />
        </div>
      </div>
    </div>
  );
}
