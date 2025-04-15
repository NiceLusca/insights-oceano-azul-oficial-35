
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/MainLayout";
import { IdealMetricsCard } from "@/components/IdealMetricsCard";
import { QuoteCard } from "@/components/QuoteCard";
import { formSchema, defaultFormValues, FormValues } from "@/schemas/formSchema";
import { supabase } from "@/integrations/supabase/client";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, History as HistoryIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAnalyzer } from "@/components/FormAnalyzer";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  // Verifica se há uma análise selecionada no localStorage (da página de histórico)
  useEffect(() => {
    const selectedAnalysis = localStorage.getItem("selectedAnalysis");
    
    if (selectedAnalysis) {
      const analysis = JSON.parse(selectedAnalysis);
      // Converter datas de string para objeto Date
      const formData = analysis.form_data as FormValues;
      if (formData.startDate) formData.startDate = new Date(formData.startDate);
      if (formData.endDate) formData.endDate = new Date(formData.endDate);
      
      form.reset(formData);
      
      // Limpa o localStorage após carregar
      localStorage.removeItem("selectedAnalysis");
      
      // Muda para a guia de resultados
      setActiveTab("results");
    }
  }, [form]);

  // Verifica autenticação e carrega últimos dados do usuário
  useEffect(() => {
    const checkAuth = async () => {
      setLoadingUserData(true);
      
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (session.session) {
          setIsAuthenticated(true);
          
          // Busca os últimos dados do usuário
          const { data } = await supabase
            .from("user_last_analysis")
            .select("*")
            .maybeSingle();
          
          if (data) {
            // Converter datas de string para objeto Date
            const formData = data.form_data as any;
            if (formData.startDate) formData.startDate = new Date(formData.startDate);
            if (formData.endDate) formData.endDate = new Date(formData.endDate);
            
            form.reset(formData as FormValues);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setLoadingUserData(false);
      }
    };
    
    checkAuth();
    
    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, [form]);

  const hasUpsell = form.watch("hasUpsell");

  return (
    <MainLayout>
      <IdealMetricsCard hasUpsell={hasUpsell} />
      {loadingUserData ? (
        <div className="space-y-4 p-8 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <>
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="form" className="flex items-center gap-2" onClick={() => setActiveTab("form")}>
              <FileText className="h-4 w-4" />
              <span>Formulário</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" onClick={() => setActiveTab("results")}>
              <BarChart3 className="h-4 w-4" />
              <span>Resultados</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2"
              onClick={() => navigate("/history")}
            >
              <HistoryIcon className="h-4 w-4" />
              <span>Histórico</span>
            </TabsTrigger>
          </TabsList>
          
          <FormAnalyzer 
            form={form}
            isAuthenticated={isAuthenticated}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {activeTab === "results" && <QuoteCard />}
        </>
      )}
    </MainLayout>
  );
};

export default Index;
