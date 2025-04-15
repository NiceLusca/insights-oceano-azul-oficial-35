import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Clock, Loader2, Search, Calendar, Percent } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Analysis {
  id: string;
  created_at: string;
  form_data: any;
  diagnostics: any;
}

const History = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          navigate("/auth");
          return;
        }
        
        const { data, error } = await supabase
          .from("user_analyses")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        setAnalyses(data || []);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar histórico",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [navigate, toast]);

  const loadAnalysis = (analysis: Analysis) => {
    localStorage.setItem("selectedAnalysis", JSON.stringify(analysis));
    navigate("/");
  };

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
    <MainLayout>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Análises
          </h2>
          <Button 
            onClick={() => navigate("/")} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Carregando histórico...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-md p-6">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-lg font-medium mb-2">
              Você ainda não tem análises salvas
            </p>
            <p className="text-muted-foreground mb-4">
              Faça sua primeira análise e clique em "Salvar no Histórico".
            </p>
            <Button onClick={() => navigate("/")}>
              Criar Nova Análise
            </Button>
          </div>
        ) : (
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
                              onClick={() => loadAnalysis(analysis)}
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
        )}
      </Card>
    </MainLayout>
  );
};

export default History;
