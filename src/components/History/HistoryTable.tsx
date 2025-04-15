
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Percent, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/utils/formatters";

interface Analysis {
  id: string;
  created_at: string;
  form_data: any;
  diagnostics: any;
}

interface HistoryTableProps {
  analyses: Analysis[];
  onLoadAnalysis: (analysis: Analysis) => void;
}

export const HistoryTable = ({ analyses, onLoadAnalysis }: HistoryTableProps) => {
  const formatPeriod = (formData: any) => {
    if (!formData.startDate && !formData.endDate) {
      return "Período não especificado";
    }
    
    let periodText = "";
    
    if (formData.startDate) {
      periodText += format(new Date(formData.startDate), "dd/MM/yyyy", { locale: ptBR });
    }
    
    periodText += " a ";
    
    if (formData.endDate) {
      periodText += format(new Date(formData.endDate), "dd/MM/yyyy", { locale: ptBR });
    } else {
      periodText += "atual";
    }
    
    return periodText;
  };

  const calculateROI = (diagnostics: any) => {
    if (!diagnostics.adSpend || diagnostics.adSpend <= 0) {
      return "N/A";
    }
    
    const roi = diagnostics.totalRevenue / diagnostics.adSpend;
    return `${roi.toFixed(2)}x`;
  };

  const calculateConversionRate = (diagnostics: any) => {
    if (!diagnostics.finalConversion) {
      return "N/A";
    }
    
    const conversionRate = diagnostics.finalConversion * 100;
    return `${conversionRate.toFixed(2)}%`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Lista de análises salvas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Data da Análise</TableHead>
            <TableHead>Período Analisado</TableHead>
            <TableHead>Faturamento Total</TableHead>
            <TableHead>Valor Gasto</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>Taxa de Conversão</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => (
            <TableRow key={analysis.id} className="hover:bg-muted/50">
              <TableCell>
                {format(new Date(analysis.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="truncate">{formatPeriod(analysis.form_data)}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(analysis.diagnostics.totalRevenue || 0)}
              </TableCell>
              <TableCell>
                {analysis.form_data.adSpend ? formatCurrency(analysis.form_data.adSpend) : "N/A"}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={calculateROI(analysis.diagnostics) !== "N/A" && 
                          parseFloat(calculateROI(analysis.diagnostics)) >= 1.5 ? 
                          "success" : "outline"}
                  className={calculateROI(analysis.diagnostics) !== "N/A" && 
                            parseFloat(calculateROI(analysis.diagnostics)) >= 1.5 ? 
                            "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {calculateROI(analysis.diagnostics)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Percent className="h-4 w-4 mr-1 text-blue-500" />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {calculateConversionRate(analysis.diagnostics)}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => onLoadAnalysis(analysis)}
                        className="hover:bg-blue-50 flex items-center gap-1"
                      >
                        <Search className="h-4 w-4" />
                        <span>Analisar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Carregar esta análise para visualização</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
