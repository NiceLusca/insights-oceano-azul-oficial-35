
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

  return (
    <MainLayout>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-800">
            📊 Histórico de Análises
          </h2>
          <Button onClick={() => navigate("/")}>Voltar</Button>
        </div>

        {loading ? (
          <p className="text-center py-8">Carregando histórico...</p>
        ) : analyses.length === 0 ? (
          <p className="text-center py-8">
            Você ainda não tem análises salvas. Faça sua primeira análise e salve-a.
          </p>
        ) : (
          <Table>
            <TableCaption>Lista de análises salvas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Receita Total</TableHead>
                <TableHead>Visitas na Página</TableHead>
                <TableHead>Visitas no Checkout</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses.map((analysis) => (
                <TableRow key={analysis.id}>
                  <TableCell>
                    {format(new Date(analysis.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(analysis.diagnostics.totalRevenue || 0)}
                  </TableCell>
                  <TableCell>{analysis.form_data.salesPageVisits || 0}</TableCell>
                  <TableCell>{analysis.form_data.checkoutVisits || 0}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => loadAnalysis(analysis)}>
                      Carregar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </MainLayout>
  );
};

export default History;
