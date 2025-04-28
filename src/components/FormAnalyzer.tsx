
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormContainer } from "@/components/FormContainer";
import { ResultContainer } from "@/components/ResultContainer";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { FormValues } from "@/schemas/formSchema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaveToHistoryButton } from "@/components/FormAnalyzer/SaveToHistoryButton";
import { UserDataService } from "@/components/FormAnalyzer/UserDataService";
import { useFormValidation } from "@/components/FormAnalyzer/FormValidation";
import { MetricsExplainer } from "@/components/ChatBot/MetricsExplainer";
import { FileText, BarChart3 } from "lucide-react";

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
  
  // Initialize diagnostics from initialDiagnostics if provided
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
    // Skip if we already have initialDiagnostics
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
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsContent value="form" className="space-y-6 animate-fade-in">
          <FormContainer 
            form={form} 
            onSubmit={onSubmit} 
            formSchema={form.getValues()}
            onAnalyze={() => onTabChange("results")} 
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
        </TabsContent>
      </Tabs>
      <MetricsExplainer />
    </>
  );
};
