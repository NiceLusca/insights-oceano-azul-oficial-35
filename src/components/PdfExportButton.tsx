
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { exportToPdf } from "@/utils/pdf";
import { getComparisonData } from "@/utils/metricsHelpers";

interface PdfExportButtonProps {
  formData: any;
  diagnostics: any;
}

export const PdfExportButton = ({ formData, diagnostics }: PdfExportButtonProps) => {
  const handleExportPDF = async () => {
    try {
      toast.promise(
        new Promise<boolean>((resolve, reject) => {
          try {
            // Verificar se os dados necessários estão disponíveis
            if (!formData || !diagnostics) {
              throw new Error("Dados insuficientes para gerar o PDF");
            }
            
            // Gerar dados de comparação com métricas ideais
            const comparisonData = getComparisonData(formData);
            
            // Exportar o PDF
            const result = exportToPdf(formData, diagnostics, comparisonData);
            resolve(result);
          } catch (error) {
            console.error("Erro na geração do PDF:", error);
            reject(error);
          }
        }),
        {
          loading: 'Gerando PDF...',
          success: 'Relatório exportado com sucesso!',
          error: (err) => `Erro ao exportar o relatório: ${err instanceof Error ? err.message : 'Falha desconhecida'}`,
        }
      );
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar o relatório.");
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 h-auto shadow-sm transition-all hover:shadow-md rounded-xl text-sm font-medium w-full sm:w-auto flex items-center justify-center"
    >
      <FileText className="mr-2 h-4 w-4" />
      Exportar PDF
    </Button>
  );
};
