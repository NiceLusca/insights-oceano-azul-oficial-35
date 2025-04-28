
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
import { generatePDF } from "@/utils/pdf";
import { getComparisonData } from "@/utils/metricsHelpers";

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

const History = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

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
      
      // Type assertion to ensure we're working with an array of Analysis objects
      const typedData = data as Analysis[];
      
      // Ensure dates are properly formatted for any stored analyses
      const processedData = typedData?.map(analysis => {
        if (analysis.form_data && typeof analysis.form_data === 'object') {
          // Create a shallow copy to avoid modifying the original
          const formData = { ...analysis.form_data };
          
          // Handle date fields if they exist
          if ('startDate' in formData && formData.startDate) {
            formData.startDate = formData.startDate;
          }
          
          if ('endDate' in formData && formData.endDate) {
            formData.endDate = formData.endDate;
          }
          
          return { ...analysis, form_data: formData };
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

  useEffect(() => {
    fetchHistory();
  }, [navigate, uiToast]);

  const handleDeleteAnalysis = (analysisId: string) => {
    // Filter out the deleted analysis from the local state
    setAnalyses(analyses.filter(analysis => analysis.id !== analysisId));
  };

  const loadAnalysis = (analysis: Analysis) => {
    try {
      // Create a new object to avoid modifying the original
      const processedAnalysis = {
        ...analysis,
        form_data: { ...analysis.form_data },
        diagnostics: { ...analysis.diagnostics }
      };
      
      // Convert date strings to Date objects if they exist
      if (processedAnalysis.form_data) {
        if ('startDate' in processedAnalysis.form_data && processedAnalysis.form_data.startDate) {
          processedAnalysis.form_data.startDate = new Date(processedAnalysis.form_data.startDate.toString());
        }
        
        if ('endDate' in processedAnalysis.form_data && processedAnalysis.form_data.endDate) {
          processedAnalysis.form_data.endDate = new Date(processedAnalysis.form_data.endDate.toString());
        }
      }
      
      // Ensure we're passing the complete diagnostics data
      if (!processedAnalysis.diagnostics) {
        processedAnalysis.diagnostics = {};
      }
      
      // Store the processed analysis in localStorage
      localStorage.setItem("selectedAnalysis", JSON.stringify(processedAnalysis));
      toast.success("Análise selecionada com sucesso");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao selecionar análise");
      console.error("Erro ao selecionar análise:", error);
    }
  };

  const handleGeneratePdf = (formData: any, diagnostics: any) => {
    try {
      // Generate comparison data for the third parameter
      const comparisonData = getComparisonData(formData);
      
      // Call generatePDF with all three required parameters
      generatePDF(formData, diagnostics, comparisonData);
      toast.success("PDF gerado com sucesso");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
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
          <HistoryTable 
            analyses={analyses} 
            onLoadAnalysis={loadAnalysis} 
            onDelete={handleDeleteAnalysis}
            onGenPdf={handleGeneratePdf}
            onRefresh={fetchHistory}
          />
        )}
      </Card>
    </MainLayout>
  );
};

export default History;
