import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormContainer } from "@/components/FormContainer";
import { ResultContainer } from "@/components/ResultContainer";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { FormValues } from "@/schemas/formSchema";
import { useToast } from "@/hooks/use-toast";
import { TabsContent } from "@/components/ui/tabs";
import { SaveToHistoryButton } from "@/components/FormAnalyzer/SaveToHistoryButton";
import { UserDataService } from "@/components/FormAnalyzer/UserDataService";
import { useFormValidation } from "@/components/FormAnalyzer/FormValidation";
import { MetricsExplainer } from "@/components/ChatBot/MetricsExplainer";
import { TrendVisualization } from "@/components/TrendVisualization";
import { AdvancedFinanceMetrics } from "@/components/AdvancedFinanceMetrics";
import { QuoteCard } from "@/components/QuoteCard";

interface FormAnalyzerProps {
  form: UseFormReturn<FormValues>;
  isAuthenticated: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  initialDiagnostics?: any;
}

export const FormAnalyzer = ({ 
  form, 
  isAuthenticated, 
  activeTab, 
  onTabChange,
  initialDiagnostics = null
}: FormAnalyzerProps) => {
  const [diagnostics, setDiagnostics] = useState(initialDiagnostics || {
    totalRevenue: 0,
    salesPageConversion: 0,
    checkoutConversion: 0,
    finalConversion: 0,
    messages: [],
  });
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();
  const { validateRequiredFields } = useFormValidation({ form });
  
  useEffect(() => {
    if (initialDiagnostics) {
      setDiagnostics(initialDiagnostics);
    }
  }, [initialDiagnostics]);
  
  const onSubmit = (values: FormValues) => {
    if (!validateRequiredFields()) {
      setHasFormErrors(true);
      setErrorMessage("Por favor, preencha todos os campos obrigatórios antes de analisar os resultados.");
      return;
    }
    
    setHasFormErrors(false);
    const metrics = calculateMetrics(values);
    setDiagnostics(metrics);
    
    onTabChange("results");
    
    if (isAuthenticated) {
      UserDataService.saveUserLastAnalysis(values);
    }
    
    toast({
      title: "Análise realizada",
      description: "Seus dados foram analisados com sucesso. Veja os resultados detalhados e recomendações.",
    });
  };

  useEffect(() => {
    if (initialDiagnostics) return;
    
    const subscription = form.watch((value) => {
      if (Object.values(value).every((v) => v !== undefined)) {
        const metrics = calculateMetrics(value as FormValues);
        setDiagnostics(metrics);
        
        if (isAuthenticated) {
          const timeoutId = setTimeout(() => {
            UserDataService.saveUserLastAnalysis(value as FormValues);
          }, 2000);
          
          return () => clearTimeout(timeoutId);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, isAuthenticated, initialDiagnostics]);

  return (
    <>
      <TabsContent value="form" className="space-y-6 animate-fade-in">
        <FormContainer 
          form={form} 
          onSubmit={onSubmit} 
          formSchema={form.getValues()}
          onAnalyze={() => {
            onSubmit(form.getValues());
          }} 
        />
      </TabsContent>
      
      <TabsContent value="results" className="space-y-6 animate-fade-in">
        <ResultContainer 
          formData={form.getValues()} 
          diagnostics={diagnostics} 
          hasErrors={hasFormErrors}
          errorMessage={errorMessage}
          isAuthenticated={isAuthenticated}
        />
        
        <TrendVisualization 
          formData={form.getValues()} 
          diagnostics={diagnostics}
        />
        
        <AdvancedFinanceMetrics 
          formData={form.getValues()} 
          diagnostics={diagnostics}
        />
        
        <QuoteCard />
      </TabsContent>
      
      <MetricsExplainer />
    </>
  );
};
