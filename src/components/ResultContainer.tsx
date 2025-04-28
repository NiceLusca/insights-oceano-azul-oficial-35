
import { Card } from "@/components/ui/card";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ComparisonChart } from "@/components/ComparisonChart";
import { PdfExportButton } from "@/components/PdfExportButton";
import { SaveHistoryButton } from "@/components/SaveHistoryButton";
import { FunnelDashboard } from "@/components/FunnelDashboard";
import { getComparisonData } from "@/utils/metricsHelpers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

interface ResultContainerProps {
  formData: any;
  diagnostics: any;
  hasErrors?: boolean;
  errorMessage?: string;
  isAuthenticated: boolean;
}

export const ResultContainer = ({ 
  formData, 
  diagnostics, 
  hasErrors,
  errorMessage,
  isAuthenticated 
}: ResultContainerProps) => {
  const comparisonData = getComparisonData(formData);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <>
      {hasErrors && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage || "Por favor, preencha todos os campos obrigatórios antes de analisar os resultados."}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
        <TabsList className="w-full grid grid-cols-2 mb-2 rounded-xl bg-slate-100">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-medium rounded-lg py-3"
          >
            Análise Detalhada
          </TabsTrigger>
          <TabsTrigger 
            value="detailed" 
            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:font-medium rounded-lg py-3"
          >
            Dashboard Inteligente
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
          <FunnelDashboard 
            formData={formData} 
            diagnostics={diagnostics} 
          />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DiagnosticSection diagnostics={diagnostics} />
            <ComparisonChart actualData={comparisonData} />
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-6 mt-6 border border-blue-100 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-blue-800 mb-3">Exportar e Salvar Análise</h3>
            <p className="text-gray-600 mb-4 md:mb-0">
              Exporte um relatório detalhado em PDF ou salve esta análise no seu histórico para consultas futuras.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <SaveHistoryButton 
              formData={formData}
              diagnostics={diagnostics}
              disabled={!isAuthenticated}
            />
            <PdfExportButton 
              formData={formData}
              diagnostics={diagnostics}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
