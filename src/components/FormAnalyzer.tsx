import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormContainer } from "@/components/FormContainer";
import { ResultContainer } from "@/components/ResultContainer";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { FormValues } from "@/schemas/formSchema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SaveToHistoryButton } from "@/components/SaveToHistoryButton";
import { useFormValidation } from "@/components/FormAnalyzer/FormValidation";
import { UserDataService } from "@/components/FormAnalyzer/UserDataService";
import { IdealMetricsCard } from "@/components/IdealMetricsCard";

interface FormAnalyzerProps {
  form: UseFormReturn<FormValues>;
  isAuthenticated: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const FormAnalyzer = ({ 
  form, 
  isAuthenticated, 
  activeTab, 
  onTabChange 
}: FormAnalyzerProps) => {
  const [diagnostics, setDiagnostics] = useState({
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
      description: "Seus dados foram analisados com sucesso. Veja os resultados!",
    });
  };

  useEffect(() => {
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
  }, [form.watch, isAuthenticated]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsContent value="form" className="space-y-6">
        <IdealMetricsCard hasUpsell={form.watch("hasUpsell")} />
        <FormContainer 
          form={form} 
          onSubmit={onSubmit} 
          formSchema={form.getValues()}
          onAnalyze={() => onTabChange("results")} 
        />
      </TabsContent>
      
      <TabsContent value="results" className="space-y-6">
        <ResultContainer 
          formData={form.getValues()} 
          diagnostics={diagnostics} 
          hasErrors={hasFormErrors}
          errorMessage={errorMessage}
          isAuthenticated={isAuthenticated}
        />
      </TabsContent>
    </Tabs>
  );
};
