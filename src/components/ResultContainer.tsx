
import { Card } from "@/components/ui/card";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ComparisonChart } from "@/components/ComparisonChart";
import { PdfExportButton } from "@/components/PdfExportButton";
import { getComparisonData } from "@/utils/metricsHelpers";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ResultContainerProps {
  formData: any;
  diagnostics: any;
  hasErrors?: boolean;
  errorMessage?: string;
}

export const ResultContainer = ({ 
  formData, 
  diagnostics, 
  hasErrors,
  errorMessage 
}: ResultContainerProps) => {
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

      <Card className="p-6 mt-6">
        <PdfExportButton 
          formData={formData} 
          diagnostics={diagnostics} 
          comparisonData={getComparisonData(formData)}
        />
      </Card>
    </>
  );
};
