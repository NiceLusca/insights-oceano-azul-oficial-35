
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/MainLayout";
import { QuoteCard } from "@/components/QuoteCard";
import { formSchema, defaultFormValues, FormValues } from "@/schemas/formSchema";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAnalyzer } from "@/components/FormAnalyzer";
import { useAuthentication } from "@/hooks/useAuthentication";
import { calculateMetrics, getComparisonData } from "@/utils/metricsHelpers";
import { toast } from "sonner";

const Index = () => {
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [activeTab, setActiveTab] = useState("form");
  const [diagnosticsData, setDiagnosticsData] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const selectedAnalysis = localStorage.getItem("selectedAnalysis");
    
    if (selectedAnalysis) {
      try {
        const analysis = JSON.parse(selectedAnalysis);
        const formData = analysis.form_data as FormValues;
        
        if (formData.startDate) formData.startDate = new Date(formData.startDate);
        if (formData.endDate) formData.endDate = new Date(formData.endDate);
        
        form.reset(formData);
        
        if (analysis.diagnostics && Object.keys(analysis.diagnostics).length > 0) {
          setDiagnosticsData(analysis.diagnostics);
        } else {
          const calculatedMetrics = calculateMetrics(formData);
          setDiagnosticsData(calculatedMetrics);
        }
        
        const compData = getComparisonData(formData);
        setComparisonData(compData);
        
        localStorage.removeItem("selectedAnalysis");
        
        setActiveTab("results");
        
        toast.success("Análise carregada com sucesso");
      } catch (error) {
        console.error("Erro ao processar análise selecionada:", error);
        toast.error("Erro ao processar análise selecionada");
      }
    }
  }, [form]);

  useEffect(() => {
    const loadUserData = async () => {
      setLoadingUserData(true);
      
      try {
        if (isAuthenticated) {
          const { data } = await supabase
            .from("user_last_analysis")
            .select("*")
            .maybeSingle();
          
          if (data) {
            const formData = data.form_data as any;
            if (formData.startDate) formData.startDate = new Date(formData.startDate);
            if (formData.endDate) formData.endDate = new Date(formData.endDate);
            
            form.reset(formData as FormValues);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoadingUserData(false);
      }
    };
    
    loadUserData();
  }, [form, isAuthenticated]);

  // Quando os dados do formulário mudam e temos diagnostics, atualizamos os dados de comparação
  useEffect(() => {
    if (diagnosticsData) {
      const formData = form.getValues();
      const compData = getComparisonData(formData);
      setComparisonData(compData);
    }
  }, [diagnosticsData, form]);

  return (
    <MainLayout>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-full bg-slate-100 p-1 rounded-xl shadow-sm">
              <TabsTrigger 
                value="form" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium py-3"
              >
                <FileText className="h-4 w-4" />
                <span>Formulário</span>
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm data-[state=active]:font-medium py-3"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Resultados</span>
              </TabsTrigger>
            </TabsList>
          
            <FormAnalyzer 
              form={form}
              isAuthenticated={isAuthenticated}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              initialDiagnostics={diagnosticsData}
            />
          </Tabs>
        </>
      )}
    </MainLayout>
  );
};

export default Index;
