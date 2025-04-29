
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { getPercentageChange } from "./useFinanceCalculations";

interface MetricCardProps {
  title: string;
  value: number | string;
  format?: "currency" | "number" | "percentage";
  subtitle?: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "success";
  };
  historicalValue?: number;
  showComparison?: boolean;
  additionalContent?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  format = "number",
  subtitle,
  badge,
  historicalValue,
  showComparison = false,
  additionalContent
}: MetricCardProps) {
  const formattedValue = (): string => {
    if (typeof value === "string") return value;
    
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(2);
    }
  };

  const percentageChange = historicalValue 
    ? getPercentageChange(typeof value === "number" ? value : 0, historicalValue)
    : 0;
  
  const comparisonVariant = percentageChange > 0 ? "success" : "destructive";

  return (
    <div className="finance-metric-card">
      <div className="finance-metric-label mb-1">{title}</div>
      <div className="finance-metric-value flex items-center gap-2">
        {formattedValue()}
        {badge && (
          <Badge variant={badge.variant} className="dark:text-white">
            {badge.text}
          </Badge>
        )}
      </div>
      <div className="finance-metric-subtitle mt-1 flex justify-between items-center">
        {subtitle && <span>{subtitle}</span>}
        
        {showComparison && historicalValue !== undefined && (
          <Badge variant={comparisonVariant} className="dark:text-white">
            {percentageChange.toFixed(1)}%
          </Badge>
        )}
      </div>
      {additionalContent}
    </div>
  );
}
