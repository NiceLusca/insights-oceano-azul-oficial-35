
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
    <div className="text-center">
      <h3 className="text-lg font-medium text-blue-800 mb-3">Exportar Análise Completa</h3>
      <p className="text-gray-600 mb-4">
        Exporte um relatório detalhado com todas as métricas, diagnósticos e recomendações para seu funil de vendas.
      </p>
      <Button
        onClick={handleExportPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 h-auto"
        size="lg"
      >
        <FileText className="mr-2 h-5 w-5" />
        Exportar Relatório PDF
      </Button>
    </div>
  );
};
