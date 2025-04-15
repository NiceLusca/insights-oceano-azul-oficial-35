
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { MainLayout } from "@/components/MainLayout";
import { IdealMetricsCard } from "@/components/IdealMetricsCard";
import { FormContainer } from "@/components/FormContainer";
import { ResultContainer } from "@/components/ResultContainer";
import { QuoteCard } from "@/components/QuoteCard";
import { formSchema, defaultFormValues, FormValues } from "@/schemas/formSchema";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, FileText, History as HistoryIcon, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const [diagnostics, setDiagnostics] = useState({
    totalRevenue: 0,
    salesPageConversion: 0,
    checkoutConversion: 0,
    finalConversion: 0,
    messages: [],
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
      setDiagnostics(analysis.diagnostics);
      
      // Limpa o localStorage após carregar
      localStorage.removeItem("selectedAnalysis");
      
      // Muda para a guia de resultados
      setActiveTab("results");
      
      toast({
        title: "Análise carregada",
        description: "Os dados da análise selecionada foram carregados com sucesso.",
      });
    }
  }, [form, toast]);

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
            const metrics = calculateMetrics(formData as FormValues);
            setDiagnostics(metrics);
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

  const onSubmit = (values: FormValues) => {
    const metrics = calculateMetrics(values);
    setDiagnostics(metrics);
    
    // Muda para a guia de resultados
    setActiveTab("results");
    
    // Se estiver autenticado, salva os últimos dados do usuário
    if (isAuthenticated) {
      saveUserLastAnalysis(values);
    }
    
    toast({
      title: "Análise realizada",
      description: "Seus dados foram analisados com sucesso. Veja os resultados!",
    });
  };

  const saveUserLastAnalysis = async (values: FormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) return;
      
      // Preparar dados para envio ao Supabase (converter Date para string)
      const formDataForDb = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null
      };
      
      // Verificar se já existe um registro para o usuário
      const { data } = await supabase
        .from("user_last_analysis")
        .select("user_id")
        .eq("user_id", session.session.user.id)
        .maybeSingle();
      
      if (data) {
        // Atualiza registro existente
        await supabase
          .from("user_last_analysis")
          .update({
            form_data: formDataForDb,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", session.session.user.id);
      } else {
        // Cria novo registro
        await supabase
          .from("user_last_analysis")
          .insert({
            user_id: session.session.user.id,
            form_data: formDataForDb,
          });
      }
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  };

  const saveToHistory = async () => {
    if (!isAuthenticated) {
      toast({
        title: "É necessário fazer login",
        description: "Faça login para salvar seu histórico",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const values = form.getValues();
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) return;
      
      // Preparar dados para envio ao Supabase (converter Date para string)
      const formDataForDb = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null
      };
      
      const { error } = await supabase
        .from("user_analyses")
        .insert({
          user_id: session.session.user.id,
          form_data: formDataForDb,
          diagnostics: diagnostics,
        });
      
      if (error) throw error;
      
      toast({
        title: "Análise salva com sucesso!",
        description: "Você pode ver seu histórico de análises clicando na guia 'Histórico'",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar análise",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).every((v) => v !== undefined)) {
        const metrics = calculateMetrics(value as FormValues);
        setDiagnostics(metrics);
        
        // Se estiver autenticado, salva os últimos dados do usuário (debounced)
        if (isAuthenticated) {
          const timeoutId = setTimeout(() => {
            saveUserLastAnalysis(value as FormValues);
          }, 2000);
          
          return () => clearTimeout(timeoutId);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, isAuthenticated]);

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Formulário</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
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
          
          <TabsContent value="form" className="space-y-6">
            <FormContainer 
              form={form} 
              onSubmit={onSubmit} 
              formSchema={formSchema} 
              onAnalyze={() => setActiveTab("results")} 
            />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <ResultContainer formData={form.getValues()} diagnostics={diagnostics} />
            <div className="flex justify-end mt-6">
              <Button 
                className="flex items-center gap-2" 
                onClick={saveToHistory}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Salvando..." : "Salvar no Histórico"}
              </Button>
            </div>
            <QuoteCard />
          </TabsContent>
        </Tabs>
      )}
    </MainLayout>
  );
};

export default Index;
