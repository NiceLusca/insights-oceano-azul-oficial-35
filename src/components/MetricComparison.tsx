
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/utils/formatters";
import { useIsMobile } from "@/hooks/use-mobile";

interface MetricComparisonProps {
  metrics: Array<{
    name: string;
    actual: number;
    ideal: number;
    format: "currency" | "percentage" | "multiplier";
    isHigherBetter: boolean;
  }>;
}

export function MetricComparison({ metrics }: MetricComparisonProps) {
  const isMobile = useIsMobile();
  
  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "multiplier":
        return `${value.toFixed(2)}x`;
      default:
        return value.toString();
    }
  };
  
  const getComparisonPercentage = (actual: number, ideal: number, isHigherBetter: boolean) => {
    if (isHigherBetter) {
      // Para métricas onde maior é melhor
      return Math.min((actual / ideal) * 100, 100); // Limitamos a 100% para visualização mobile
    } else {
      // Para métricas onde menor é melhor (como CPC)
      return Math.min((ideal / Math.max(actual, 0.1)) * 100, 100); // Evitamos divisão por zero
    }
  };
  
  const getProgressColor = (actual: number, ideal: number, isHigherBetter: boolean) => {
    if (isHigherBetter) {
      if (actual >= ideal) return "bg-green-500 dark:bg-green-600";
      if (actual >= ideal * 0.8) return "bg-amber-500 dark:bg-amber-600";
      return "bg-red-500 dark:bg-red-600";
    } else {
      if (actual <= ideal) return "bg-green-500 dark:bg-green-600";
      if (actual <= ideal * 1.2) return "bg-amber-500 dark:bg-amber-600";
      return "bg-red-500 dark:bg-red-600";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-blue-600 shadow-sm">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Comparação com Métricas Ideais</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className={`flex ${isMobile ? 'flex-col gap-1' : 'justify-between'} text-sm`}>
              <span className="font-medium dark:text-white">{metric.name}</span>
              <div className={`flex ${isMobile ? 'justify-between' : 'items-center gap-3'}`}>
                <span className="text-gray-500 dark:text-gray-300">
                  Atual: {formatValue(metric.actual, metric.format)}
                </span>
                <span className="text-blue-600 dark:text-blue-300">
                  Ideal: {formatValue(metric.ideal, metric.format)}
                </span>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(metric.actual, metric.ideal, metric.isHigherBetter)}`}
                    style={{
                      width: `${getComparisonPercentage(metric.actual, metric.ideal, metric.isHigherBetter)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
