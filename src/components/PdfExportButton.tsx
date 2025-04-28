
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
      
      // Garantir que todos os valores numéricos sejam válidos
      Object.keys(safeDiagnostics).forEach(key => {
        if (typeof safeDiagnostics[key] === 'number' && !isFinite(safeDiagnostics[key])) {
          safeDiagnostics[key] = 0;
        }
      });
      
      // Verificar valores críticos
      if (typeof safeDiagnostics.totalRevenue !== 'number' || isNaN(safeDiagnostics.totalRevenue)) {
        safeDiagnostics.totalRevenue = 0;
      }
      
      if (typeof safeDiagnostics.currentROI !== 'number' || isNaN(safeDiagnostics.currentROI)) {
        safeDiagnostics.currentROI = 0;
      }
      
      // Gerar dados de comparação com métricas ideais
      const comparisonData = getComparisonData(safeFormData);
      
      // Verificar dados de comparação
      if (!Array.isArray(comparisonData)) {
        toast.error("Erro ao gerar dados de comparação");
        return;
      }
      
      // Validar cada item de comparação
      const validComparisonData = comparisonData.filter(item => {
        return item && 
               typeof item.name === 'string' && 
               typeof item.actual === 'number' && !isNaN(item.actual) &&
               typeof item.ideal === 'number' && !isNaN(item.ideal);
      });
      
      console.log("Exportando PDF com dados validados:", {
        formData: safeFormData,
        diagnostics: safeDiagnostics,
        comparisonData: validComparisonData
      });
      
      // Exportar o PDF com dados validados
      const success = await exportToPdf(safeFormData, safeDiagnostics, validComparisonData);
      
      if (success) {
        toast.success("Relatório exportado com sucesso!");
      } else {
        toast.error("Não foi possível gerar o relatório");
      }
      
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
