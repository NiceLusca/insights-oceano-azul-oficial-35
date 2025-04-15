
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
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
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Diagnóstico</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-blue-600">Faturamento Total</p>
          <p className="text-2xl font-bold">
            {formatCurrency(diagnostics.totalRevenue)}
          </p>
        </div>

        {diagnostics.monthlyGoalProgress !== undefined && (
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-blue-600">Progresso da Meta Mensal</p>
            <p className="text-2xl font-bold">
              {formatPercentage(diagnostics.monthlyGoalProgress)}
            </p>
          </div>
        )}

        {diagnostics.maxCPC && (
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-blue-600 flex items-center gap-2">
              CPC Máximo Recomendado
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Valor máximo que você pode pagar por clique mantendo seu ROI desejado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(diagnostics.maxCPC)}
            </p>
          </div>
        )}

        {diagnostics.currentCPC && (
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-blue-600">CPC Atual</p>
            <p className={`text-2xl font-bold ${diagnostics.currentCPC > (diagnostics.maxCPC || 0) ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(diagnostics.currentCPC)}
            </p>
          </div>
        )}
        
        {diagnostics.currentROI && (
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-blue-600">ROI Atual</p>
            <p className="text-2xl font-bold">
              {diagnostics.currentROI.toFixed(2)}x
            </p>
          </div>
        )}

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-blue-600">Taxa de Order Bump</p>
          <p className={`text-2xl font-bold flex items-center gap-2 ${diagnostics.orderBumpRate && diagnostics.orderBumpRate < 30 ? 'text-amber-500' : 'text-green-500'}`}>
            {diagnostics.orderBumpRate ? `${diagnostics.orderBumpRate.toFixed(1)}%` : "0.0%"}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ideal: 30% das vendas totais devem incluir order bump</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {diagnostics.messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : msg.type === "warning"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
    </Card>
  );
};
