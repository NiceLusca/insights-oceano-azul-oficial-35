
import { Card } from "@/components/ui/card";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ComparisonChart } from "@/components/ComparisonChart";
import { PdfExportButton } from "@/components/PdfExportButton";
import { SaveToHistoryButton } from "@/components/FormAnalyzer/SaveToHistoryButton";
import { getComparisonData } from "@/utils/metricsHelpers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

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
  const { theme } = useTheme();
  
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
        <ComparisonChart actualData={getComparisonData(formData)} />
      </div>

      {/* Botão de Salvar no Histórico com destaque */}
      <div className="mt-6 mb-4">
        <SaveToHistoryButton 
          formData={formData}
          diagnostics={diagnostics}
          isAuthenticated={isAuthenticated}
        />
      </div>

      <Card className="p-6">
        <PdfExportButton 
          formData={formData} 
          diagnostics={diagnostics} 
          comparisonData={getComparisonData(formData)}
        />
      </Card>
    </>
  );
};
