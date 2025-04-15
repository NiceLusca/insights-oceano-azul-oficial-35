
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { exportToPdf } from "@/utils/pdfExport";

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
          const result = exportToPdf(formData, diagnostics, comparisonData);
          resolve(result);
        }),
        {
          loading: 'Gerando PDF...',
          success: 'Relatório exportado com sucesso!',
          error: 'Erro ao exportar o relatório.',
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
      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar Análise (PDF)
    </Button>
  );
};
