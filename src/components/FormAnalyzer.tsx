import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormContainer } from "@/components/FormContainer";
import { ResultContainer } from "@/components/ResultContainer";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { FormValues } from "@/schemas/formSchema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface FormAnalyzerProps {
  form: UseFormReturn<FormValues>;
  isAuthenticated: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FormAnalyzer = ({ form, isAuthenticated, activeTab, onTabChange }: FormAnalyzerProps) => {
  const [diagnostics, setDiagnostics] = useState({
    totalRevenue: 0,
    salesPageConversion: 0,
    checkoutConversion: 0,
    finalConversion: 0,
    messages: [],
  });
  const [saving, setSaving] = useState(false);
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  
  const onSubmit = (values: FormValues) => {
    // Validate required fields
    if (!validateRequiredFields()) {
      setHasFormErrors(true);
      setErrorMessage("Por favor, preencha todos os campos obrigatórios antes de analisar os resultados.");
      return;
    }
    
    setHasFormErrors(false);
    const metrics = calculateMetrics(values);
    setDiagnostics(metrics);
    
    // Muda para a guia de resultados
    onTabChange("results");
    
    // Se estiver autenticado, salva os últimos dados do usuário
    if (isAuthenticated) {
      saveUserLastAnalysis(values);
    }
    
    toast({
      title: "Análise realizada",
      description: "Seus dados foram analisados com sucesso. Veja os resultados!",
    });
  };

  const validateRequiredFields = () => {
    // Check if all required numeric fields have values > 0
    const values = form.getValues();
    const requiredFields = [
      'totalClicks', 
      'salesPageVisits', 
      'checkoutVisits', 
      'mainProductSales',
      'mainProductPrice'
    ];
    
    for (const field of requiredFields) {
      if (!values[field] || values[field] === 0) {
        form.setError(field as any, {
          type: 'required',
          message: 'Este campo é obrigatório'
        });
        return false;
      }
    }
    
    return true;
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

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsContent value="form" className="space-y-6">
        <FormContainer 
          form={form} 
          onSubmit={onSubmit} 
          formSchema={form.formState.defaultValues} 
          onAnalyze={() => onTabChange("results")} 
        />
      </TabsContent>
      
      <TabsContent value="results" className="space-y-6">
        <ResultContainer 
          formData={form.getValues()} 
          diagnostics={diagnostics} 
          hasErrors={hasFormErrors}
          errorMessage={errorMessage}
        />
        
        <div className="flex justify-end mt-6">
          <Button 
            className="flex items-center gap-2" 
            onClick={saveToHistory}
            disabled={saving || hasFormErrors}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Salvando..." : "Salvar no Histórico"}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};
