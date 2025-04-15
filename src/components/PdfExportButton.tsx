
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

interface PdfExportButtonProps {
  formData: any;
  diagnostics: any;
  comparisonData: any;
}

export const PdfExportButton = ({ formData, diagnostics, comparisonData }: PdfExportButtonProps) => {
  const handleExportPDF = async () => {
    try {
      toast.promise(
        new Promise(async (resolve) => {
          // Simulamos o processamento de exportação
          setTimeout(() => {
            resolve(true);
          }, 1500);
        }),
        {
          loading: 'Gerando PDF...',
          success: 'Relatório exportado com sucesso!',
          error: 'Erro ao exportar o relatório.',
        }
      );
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar Análise (PDF)
    </Button>
  );
};
