
import { TrendingUp, TrendingDown, AlertCircle, Info } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { DiagnosticCard } from "./DiagnosticCard";
import { cn } from "@/lib/utils";

interface MetricsGridProps {
  diagnostics: {
    totalRevenue: number;
    currentROI?: number;
    maxCPC?: number;
    currentCPC?: number;
    monthlyGoalProgress?: number;
    orderBumpRate?: number;
    salesPageConversion?: number;
    checkoutConversion?: number;
  };
}

export const MetricsGrid = ({ diagnostics }: MetricsGridProps) => {
  // Function to determine if a metric is below target
  const isBelowTarget = (value: number | undefined, target: number): boolean => {
    if (value === undefined) return false;
    return value < target;
  };

  // Function to get icon based on status
  const getStatusIcon = (value: number | undefined, target: number) => {
    if (value === undefined) return null;
    
    return value >= target ? (
      <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-amber-500 dark:text-amber-400" />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <DiagnosticCard 
        title="Faturamento Total"
        value={formatCurrency(diagnostics.totalRevenue)}
        icon="💰"
        className="border-l-4 border-l-blue-500 dark:border-l-blue-400"
      />

      {diagnostics.currentROI !== undefined && (
        <DiagnosticCard
          title="ROI Atual"
          value={`${diagnostics.currentROI.toFixed(2)}x`}
          icon="📈"
          className={cn(
            "border-l-4",
            diagnostics.currentROI >= 1.5 ? "border-l-green-500 dark:border-l-green-400" : "border-l-amber-500 dark:border-l-amber-400"
          )}
          statusIcon={getStatusIcon(diagnostics.currentROI, 1.5)}
        />
      )}

      {diagnostics.maxCPC && (
        <DiagnosticCard
          title="CPC Máximo Recomendado"
          value={formatCurrency(diagnostics.maxCPC)}
          tooltip="Valor máximo que você pode pagar por clique mantendo seu ROI desejado"
          icon="🎯"
          className="border-l-4 border-l-purple-500 dark:border-l-purple-400"
        />
      )}

      {diagnostics.currentCPC && (
        <DiagnosticCard
          title="CPC Atual"
          value={formatCurrency(diagnostics.currentCPC)}
          valueColor={diagnostics.currentCPC > (diagnostics.maxCPC || 0) ? 'text-red-500 dark:text-red-300' : 'text-green-500 dark:text-green-300'}
          icon="💸"
          className={cn(
            "border-l-4", 
            diagnostics.currentCPC <= (diagnostics.maxCPC || 0) ? "border-l-green-500 dark:border-l-green-400" : "border-l-red-500 dark:border-l-red-400"
          )}
          statusIcon={diagnostics.currentCPC > (diagnostics.maxCPC || 0) ? (
            <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-300" />
          ) : (
            <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
          )}
        />
      )}
      
      {diagnostics.salesPageConversion !== undefined && (
        <DiagnosticCard
          title="Conversão Página de Vendas"
          value={formatPercentage(diagnostics.salesPageConversion / 100)}
          valueColor={diagnostics.salesPageConversion < 40 ? 'text-amber-500 dark:text-amber-300' : 'text-green-500 dark:text-green-300'}
          icon="📃"
          className={cn(
            "border-l-4", 
            diagnostics.salesPageConversion >= 40 ? "border-l-green-500 dark:border-l-green-400" : "border-l-amber-500 dark:border-l-amber-400"
          )}
          statusIcon={getStatusIcon(diagnostics.salesPageConversion, 40)}
          tooltip="Ideal: 40% das visitas devem converter para checkout"
        />
      )}
      
      {diagnostics.checkoutConversion !== undefined && (
        <DiagnosticCard
          title="Conversão do Checkout"
          value={formatPercentage(diagnostics.checkoutConversion / 100)}
          valueColor={diagnostics.checkoutConversion < 40 ? 'text-amber-500 dark:text-amber-300' : 'text-green-500 dark:text-green-300'}
          icon="🛒"
          className={cn(
            "border-l-4", 
            diagnostics.checkoutConversion >= 40 ? "border-l-green-500 dark:border-l-green-400" : "border-l-amber-500 dark:border-l-amber-400"
          )}
          statusIcon={getStatusIcon(diagnostics.checkoutConversion, 40)}
          tooltip="Ideal: 40% das visitas ao checkout devem converter em vendas"
        />
      )}

      <DiagnosticCard
        title="Taxa de Order Bump"
        value={diagnostics.orderBumpRate ? `${diagnostics.orderBumpRate.toFixed(1)}%` : "0.0%"}
        valueColor={diagnostics.orderBumpRate && diagnostics.orderBumpRate < 30 ? 'text-amber-500 dark:text-amber-300' : 'text-green-500 dark:text-green-300'}
        tooltip="Ideal: 30% das vendas totais devem incluir order bump"
        icon="🎁"
        className={cn(
          "border-l-4", 
          (diagnostics.orderBumpRate || 0) >= 30 ? "border-l-green-500 dark:border-l-green-400" : "border-l-amber-500 dark:border-l-amber-400"
        )}
        statusIcon={getStatusIcon(diagnostics.orderBumpRate, 30)}
      />
    </div>
  );
};
