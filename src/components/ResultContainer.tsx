
import { Card } from "@/components/ui/card";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ComparisonChart } from "@/components/ComparisonChart";
import { PdfExportButton } from "@/components/PdfExportButton";
import { SaveHistoryButton } from "@/components/SaveHistoryButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, BarChart3, FileText, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getComparisonData } from "@/utils/metricsHelpers";

interface ResultContainerProps {
  formData: any;
  diagnostics: any;
  hasErrors?: boolean;
  errorMessage?: string;
  isAuthenticated: boolean;
  onNavigateTo?: (path: string) => void;
}

export const ResultContainer = ({ 
  formData, 
  diagnostics, 
  hasErrors,
  errorMessage,
  isAuthenticated,
  onNavigateTo
}: ResultContainerProps) => {
  const comparisonData = getComparisonData(formData);

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DiagnosticSection diagnostics={diagnostics} />
        <ComparisonChart actualData={comparisonData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Button 
          className="flex items-center gap-2 h-auto py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200" 
          onClick={() => onNavigateTo && onNavigateTo("/dashboard")}
        >
          <BarChart3 className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Dashboard Inteligente</div>
            <div className="text-xs text-blue-600">Visão resumida com métricas principais</div>
          </div>
        </Button>
        
        <Button 
          className="flex items-center gap-2 h-auto py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200" 
          onClick={() => onNavigateTo && onNavigateTo("/analise")}
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Análise Detalhada</div>
            <div className="text-xs text-blue-600">Diagnóstico completo, problemas e ações</div>
          </div>
        </Button>
        
        <Button 
          className="flex items-center gap-2 h-auto py-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200" 
          onClick={() => onNavigateTo && onNavigateTo("/financas")}
        >
          <CircleDollarSign className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Métricas Financeiras</div>
            <div className="text-xs text-blue-600">ROI, LTV, CAC e outras métricas avançadas</div>
          </div>
        </Button>
      </div>
      
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
