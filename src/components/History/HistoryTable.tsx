
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { exportToPdf } from "@/utils/pdfExport";
import { toast } from "sonner";
import { getComparisonData } from "@/utils/metricsHelpers";

interface HistoryTableProps {
  analyses: any[];
  onLoadAnalysis: (analysis: any) => void;
}

export const HistoryTable = ({ analyses, onLoadAnalysis }: HistoryTableProps) => {
  const handleExportPDF = async (analysis: any) => {
    try {
      toast.promise(
        new Promise(async (resolve) => {
          const formData = analysis.form_data;
          const diagnostics = analysis.diagnostics;
          const comparisonData = getComparisonData(formData);
          
          const result = exportToPdf(formData, diagnostics, comparisonData);
          resolve(result);
        }),
        {
          loading: 'Gerando PDF...',
          success: 'Relatório exportado com sucesso!',
          error: 'Erro ao exportar relatório.',
        }
      );
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    }
  };

  const formatPeriod = (formData: any) => {
    if (!formData.startDate || !formData.endDate) return "Período não especificado";
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    return `${format(startDate, "dd/MM/yyyy", { locale: ptBR })} - ${format(endDate, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <div className="overflow-x-auto mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Faturamento</TableHead>
            <TableHead className="text-right">ROI</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => {
            const formData = analysis.form_data || {};
            const diagnostics = analysis.diagnostics || {};
            const date = new Date(analysis.created_at);
            const formattedDate = format(date, "PPp", { locale: ptBR });
            const period = formatPeriod(formData);
            
            // Garantir valores default para evitar problemas de exibição
            const totalRevenue = diagnostics.totalRevenue || 0;
            const currentROI = diagnostics.currentROI;
            
            return (
              <TableRow key={analysis.id}>
                <TableCell className="font-medium">{formattedDate}</TableCell>
                <TableCell>{period}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalRevenue)}
                </TableCell>
                <TableCell className="text-right">
                  {currentROI !== undefined && currentROI !== null ? `${currentROI.toFixed(2)}x` : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => onLoadAnalysis(analysis)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Visualizar</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleExportPDF(analysis)}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
