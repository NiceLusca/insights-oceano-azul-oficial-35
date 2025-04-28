
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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
        new Promise(async (resolve, reject) => {
          try {
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
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-6 h-auto shadow-md transition-all hover:shadow-lg text-base w-full sm:w-auto whitespace-nowrap"
      size="lg"
    >
      <FileText className="mr-2 h-5 w-5" />
      Exportar PDF
    </Button>
  );
};
