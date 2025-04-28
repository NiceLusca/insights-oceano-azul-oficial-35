
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  
  const handleExportPDF = async () => {
    try {
      setLoading(true);
      
      // Validar dados de entrada
      if (!formData || !diagnostics) {
        toast.error("Dados insuficientes para gerar o PDF");
        return;
      }
      
      // Criar cópias seguras dos dados para evitar referências mutáveis
      const safeFormData = JSON.parse(JSON.stringify(formData || {}));
      const safeDiagnostics = JSON.parse(JSON.stringify(diagnostics || {}));
      
      // Gerar dados de comparação com métricas ideais
      const comparisonData = getComparisonData(safeFormData);
      
      // Exportar o PDF com dados validados
      await exportToPdf(safeFormData, safeDiagnostics, comparisonData);
      
      toast.success("Relatório exportado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error(`Erro ao exportar o relatório: ${error instanceof Error ? error.message : 'Falha desconhecida'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 h-auto shadow-sm transition-all hover:shadow-md rounded-xl text-sm font-medium w-full sm:w-auto flex items-center justify-center"
    >
      <FileText className="mr-2 h-4 w-4" />
      {loading ? "Gerando PDF..." : "Exportar PDF"}
    </Button>
  );
};
