
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface Analysis {
  id: string;
  created_at: string;
  form_data: {
    startDate?: string | Date;
    endDate?: string | Date;
    [key: string]: any;
  };
  diagnostics: any;
}

interface HistoryTableProps {
  analyses: Analysis[];
  onLoadAnalysis: (analysis: Analysis) => void;
  onDelete: (analysisId: string) => void;
  onGenPdf?: (formData: any, diagnostics: any) => void;
  onRefresh?: () => void;
}

export function HistoryTable({ 
  analyses, 
  onLoadAnalysis, 
  onDelete,
  onGenPdf,
  onRefresh = () => {} 
}: HistoryTableProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const viewAnalysis = (analysis: any) => {
    onLoadAnalysis(analysis);
  };
  
  const handleDeleteAnalysis = async (id: string) => {
    setAnalysisToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!analysisToDelete) return;
    
    try {
      setIsLoading({...isLoading, [analysisToDelete]: true});
      
      const { error } = await supabase
        .from("user_analyses")
        .delete()
        .eq("id", analysisToDelete);
      
      if (error) throw error;
      
      toast.success("Análise excluída com sucesso");
      onDelete(analysisToDelete);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao excluir análise:", error);
      toast.error("Erro ao excluir análise");
    } finally {
      setIsLoading({...isLoading, [analysisToDelete]: false});
      setDeleteConfirmOpen(false);
      setAnalysisToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead className="text-right">ROI</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => {
            const startDate = analysis.form_data?.startDate ? new Date(analysis.form_data.startDate).toLocaleDateString('pt-BR') : '-';
            const endDate = analysis.form_data?.endDate ? new Date(analysis.form_data.endDate).toLocaleDateString('pt-BR') : '-';
            
            return (
              <TableRow key={analysis.id}>
                <TableCell className="font-medium">
                  {new Date(analysis.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {startDate} até {endDate}
                </TableCell>
                <TableCell>
                  {formatCurrency(analysis.diagnostics?.totalRevenue || 0)}
                </TableCell>
                <TableCell className="text-right">
                  {analysis.diagnostics?.currentROI?.toFixed(2) || 0}x
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => viewAnalysis(analysis)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                    {onGenPdf && (
                      <Button size="icon" variant="ghost" onClick={() => onGenPdf(analysis.form_data, analysis.diagnostics)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDeleteAnalysis(analysis.id)}
                      disabled={isLoading[analysis.id]}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir análise</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
