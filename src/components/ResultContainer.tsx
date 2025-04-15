
import { Card } from "@/components/ui/card";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ComparisonChart } from "@/components/ComparisonChart";
import { PdfExportButton } from "@/components/PdfExportButton";
import { getComparisonData } from "@/utils/metricsHelpers";

interface ResultContainerProps {
  formData: any;
  diagnostics: any;
}

export const ResultContainer = ({ formData, diagnostics }: ResultContainerProps) => {
  return (
    <>
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
