
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { HistoryHeader } from "@/components/History/HistoryHeader";
import { HistoryLoading } from "@/components/History/HistoryLoading";
import { HistoryEmptyState } from "@/components/History/HistoryEmptyState";
import { HistoryTable } from "@/components/History/HistoryTable";
import { toast } from "sonner";

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
  const { toast: uiToast } = useToast();

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
        
        // Ensure dates are properly formatted for any stored analyses
        const processedData = data?.map(analysis => {
          const formData = analysis.form_data;
          if (formData) {
            if (formData.startDate) formData.startDate = formData.startDate;
            if (formData.endDate) formData.endDate = formData.endDate;
          }
          return analysis;
        });
        
        setAnalyses(processedData || []);
      } catch (error: any) {
        uiToast({
          title: "Erro ao carregar histórico",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [navigate, uiToast]);

  const loadAnalysis = (analysis: Analysis) => {
    try {
      // Garantir que as datas sejam devidamente processadas
      const processedAnalysis = {...analysis};
      
      if (processedAnalysis.form_data) {
        // As datas já estão em string no banco, mas o form no frontend espera objetos Date
        if (processedAnalysis.form_data.startDate) {
          processedAnalysis.form_data.startDate = new Date(processedAnalysis.form_data.startDate);
        }
        if (processedAnalysis.form_data.endDate) {
          processedAnalysis.form_data.endDate = new Date(processedAnalysis.form_data.endDate);
        }
      }
      
      // Copiamos a análise para o localStorage para ser lida na página principal
      localStorage.setItem("selectedAnalysis", JSON.stringify(processedAnalysis));
      toast.success("Análise selecionada com sucesso");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao selecionar análise");
      console.error("Erro ao selecionar análise:", error);
    }
  };

  return (
    <MainLayout>
      <Card className="p-6">
        <HistoryHeader />

        {loading ? (
          <HistoryLoading />
        ) : analyses.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          <HistoryTable analyses={analyses} onLoadAnalysis={loadAnalysis} />
        )}
      </Card>
    </MainLayout>
  );
};

export default History;
