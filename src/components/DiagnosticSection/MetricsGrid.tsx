
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { DiagnosticCard } from "./DiagnosticCard";

interface MetricsGridProps {
  diagnostics: {
    totalRevenue: number;
    currentROI?: number;
    maxCPC?: number;
    currentCPC?: number;
    monthlyGoalProgress?: number;
    orderBumpRate?: number;
  };
}

export const MetricsGrid = ({ diagnostics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <DiagnosticCard 
        title="Faturamento Total"
        value={formatCurrency(diagnostics.totalRevenue)}
      />

      {diagnostics.monthlyGoalProgress !== undefined && (
        <DiagnosticCard
          title="Progresso da Meta Mensal"
          value={formatPercentage(diagnostics.monthlyGoalProgress)}
        />
      )}

      {diagnostics.maxCPC && (
        <DiagnosticCard
          title="CPC Máximo Recomendado"
          value={formatCurrency(diagnostics.maxCPC)}
          tooltip="Valor máximo que você pode pagar por clique mantendo seu ROI desejado"
        />
      )}

      {diagnostics.currentCPC && (
        <DiagnosticCard
          title="CPC Atual"
          value={formatCurrency(diagnostics.currentCPC)}
          valueColor={diagnostics.currentCPC > (diagnostics.maxCPC || 0) ? 'text-red-500' : 'text-green-500'}
        />
      )}
      
      {diagnostics.currentROI && (
        <DiagnosticCard
          title="ROI Atual"
          value={`${diagnostics.currentROI.toFixed(2)}x`}
        />
      )}

      <DiagnosticCard
        title="Taxa de Order Bump"
        value={diagnostics.orderBumpRate ? `${diagnostics.orderBumpRate.toFixed(1)}%` : "0.0%"}
        valueColor={diagnostics.orderBumpRate && diagnostics.orderBumpRate < 30 ? 'text-amber-500' : 'text-green-500'}
        tooltip="Ideal: 30% das vendas totais devem incluir order bump"
      />
    </div>
  );
};
