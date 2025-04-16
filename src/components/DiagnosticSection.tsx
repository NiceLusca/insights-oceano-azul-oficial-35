
import { Card } from "@/components/ui/card";
import { MetricsGrid } from "./DiagnosticSection/MetricsGrid";
import { DiagnosticMessages } from "./DiagnosticSection/DiagnosticMessages";

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
    <Card className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
      <div className="flex items-center mb-4">
        <span className="w-6 h-6 oceano-azul-logo mr-2"></span>
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-400 flex items-center">
          Diagnóstico
        </h2>
      </div>
      
      <MetricsGrid diagnostics={diagnostics} />
      <DiagnosticMessages messages={diagnostics.messages} />
    </Card>
  );
};
