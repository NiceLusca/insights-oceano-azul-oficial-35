
import { Card, CardContent } from "@/components/ui/card";
import { MetricsGrid } from "./DiagnosticSection/MetricsGrid";
import { DiagnosticMessages } from "./DiagnosticSection/DiagnosticMessages";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface DiagnosticSectionProps {
  diagnostics: {
    totalRevenue: number;
    currentROI?: number;
    maxCPC?: number;
    currentCPC?: number;
    salesPageConversion: number;
    checkoutConversion: number;
    finalConversion: number;
    monthlyGoalProgress?: number;
    adSpend?: number;
    orderBumpRate?: number;
    messages: Array<{ type: "success" | "warning" | "error"; message: string }>;
  };
}

export const DiagnosticSection = ({ diagnostics }: DiagnosticSectionProps) => {
  return (
    <Card className="p-6 metric-card-gradient dark:border-blue-600 dark:shadow-blue-900/10">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-md">📊</span>
        Insights
      </h2>
      
      {diagnostics.monthlyGoalProgress !== undefined && (
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Progresso da Meta Mensal</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1 cursor-help">
                      <Info className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Progresso em relação à sua meta de faturamento mensal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs font-semibold dark:text-white">
              {formatCurrency(diagnostics.totalRevenue)} de {formatPercentage(diagnostics.monthlyGoalProgress)}
            </span>
          </div>
          <Progress 
            value={Math.min(diagnostics.monthlyGoalProgress * 100, 100)} 
            className="h-2 bg-blue-100 dark:bg-blue-900"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-500 dark:text-slate-300">0%</span>
            <span className="text-xs text-slate-500 dark:text-slate-300">100%</span>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <MetricsGrid diagnostics={diagnostics} />
        
        <Separator className="my-6 bg-blue-100 dark:bg-blue-800" />
        
        <DiagnosticMessages messages={diagnostics.messages} />
      </div>
    </Card>
  );
}
