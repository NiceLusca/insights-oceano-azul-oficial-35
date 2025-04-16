
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
    <Card className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 oceano-azul-logo mr-2"></div>
        <h2 className="text-xl font-semibold text-blue-800">
          Diagnóstico
        </h2>
      </div>
      
      <MetricsGrid diagnostics={diagnostics} />
      <DiagnosticMessages messages={diagnostics.messages} />
    </Card>
  );
};
