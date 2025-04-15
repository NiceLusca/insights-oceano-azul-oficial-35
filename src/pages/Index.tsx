
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

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  
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
    
    // Se estiver autenticado, salva os últimos dados do usuário
    if (isAuthenticated) {
      saveUserLastAnalysis(values);
    }
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
        <div className="text-center py-8">Carregando dados...</div>
      ) : (
        <>
          <FormContainer form={form} onSubmit={onSubmit} formSchema={formSchema} />
          <ResultContainer formData={form.getValues()} diagnostics={diagnostics} />
          <QuoteCard />
        </>
      )}
    </MainLayout>
  );
};

export default Index;
