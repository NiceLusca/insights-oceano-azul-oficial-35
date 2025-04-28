
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { exportToPdf } from "@/utils/pdf";
import { toast } from "sonner";
import { getComparisonData } from "@/utils/metricsHelpers";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HistoryTableProps {
  analyses: any[];
  onLoadAnalysis: (analysis: any) => void;
  onDelete?: (analysisId: string) => void;
}

export const HistoryTable = ({ analyses, onLoadAnalysis, onDelete }: HistoryTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleExportPDF = async (analysis: any) => {
    try {
      toast.promise(
        new Promise<boolean>(async (resolve, reject) => {
          try {
            if (!analysis.form_data || !analysis.diagnostics) {
              throw new Error("Dados insuficientes para gerar o relatório");
            }
            
            const formData = analysis.form_data;
            const diagnostics = analysis.diagnostics;
            const comparisonData = getComparisonData(formData);
            
            const result = exportToPdf(formData, diagnostics, comparisonData);
            resolve(result);
          } catch (error) {
            console.error("Erro ao exportar PDF:", error);
            reject(error instanceof Error ? error : new Error("Falha desconhecida"));
          }
        }),
        {
          loading: 'Gerando PDF...',
          success: 'Relatório exportado com sucesso!',
          error: (err) => `Erro ao exportar relatório: ${err.message}`,
        }
      );
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar o relatório.");
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("user_analyses")
        .delete()
        .eq("id", analysisId);
      
      if (error) throw error;
      
      toast.success("Análise removida com sucesso");
      
      // If onDelete callback is provided, call it to refresh the list
      if (onDelete) {
        onDelete(analysisId);
      }
    } catch (error: any) {
      toast.error(`Erro ao remover análise: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
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
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAnalysis(analysis.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                          >
                            {isDeleting && deletingId === analysis.id ? "Excluindo..." : "Sim, excluir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
