
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { AdvancedFinanceMetrics } from "@/components/AdvancedFinanceMetrics";
import { ActionableInsight } from "@/components/ActionableInsight";
import { TrendVisualization } from "@/components/TrendVisualization";
import { IdealMetricsCompact } from "@/components/IdealMetricsCompact";
import { SaveToHistoryButton } from "@/components/FormAnalyzer/SaveToHistoryButton";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, Loader2, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";

interface ResultContainerProps {
  formData: any;
  diagnostics: any;
  hasErrors: boolean;
  errorMessage: string;
  isAuthenticated: boolean;
  onNavigateTo: (path: string) => void;
}

export function ResultContainer({ 
  formData, 
  diagnostics, 
  hasErrors, 
  errorMessage,
  isAuthenticated,
  onNavigateTo
}: ResultContainerProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    financial: false,
    analysis: false
  });
  const { toast } = useToast();

  const handleButtonClick = (buttonType: string, path: string) => {
    setIsLoading(prev => ({ ...prev, [buttonType]: true }));
    
    // Simulate loading time
    setTimeout(() => {
      toast({
        title: "Navegando...",
        description: `Indo para ${path === "/analise" ? "análise detalhada" : "métricas financeiras"}`,
      });
      onNavigateTo(path);
      setIsLoading(prev => ({ ...prev, [buttonType]: false }));
    }, 300);
  };

  if (hasErrors) {
    return (
      <motion.div 
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Atenção</h3>
        <p className="text-red-600 dark:text-red-300 mt-2">{errorMessage}</p>
      </motion.div>
    );
  }
  
  if (!formData || !diagnostics) {
    return (
      <EmptyState
        title="Nenhum dado para analisar"
        description="Preencha o formulário de análise para visualizar os resultados e métricas detalhadas do seu funil de vendas."
        actionLabel="Iniciar Nova Análise"
        onAction={() => window.location.reload()}
        icon={
          <img 
            src="/lovable-uploads/2da50e89-1402-421c-8c73-60efe5119215.png" 
            alt="Oceano Azul" 
            className="w-32 h-32 opacity-30 dark:opacity-20" 
          />
        }
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <IdealMetricsCompact hasUpsell={formData.hasUpsell} />
        
        <div className="grid grid-cols-1 gap-6">
          <DiagnosticSection diagnostics={diagnostics} />
          
          <TrendVisualization
            formData={formData}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {diagnostics?.actionableInsights?.map((insight: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ActionableInsight
                  title={insight.title}
                  insight={insight.content}
                  action={insight.action}
                  status={insight.status}
                />
              </motion.div>
            ))}
          </div>
          
          <AdvancedFinanceMetrics
            formData={formData}
            diagnostics={diagnostics}
          />
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1 dark:border-gray-700 dark:bg-gray-800">
                {formData.startDate && formData.endDate ? (
                  <>
                    {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                  </>
                ) : (
                  "Período não especificado"
                )}
              </Badge>
              <Badge variant="outline" className="px-2 py-1 dark:border-gray-700 dark:bg-gray-800">
                ROI: {diagnostics?.currentROI?.toFixed(2) || 0}x
              </Badge>
            </div>
            
            <div className="flex gap-4 ml-auto">
              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium py-3 px-5 shadow-md"
                    onClick={() => handleButtonClick("analysis", "/analise")}
                    disabled={isLoading.analysis}
                  >
                    {isLoading.analysis ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-5 w-5 mr-2" />
                    )}
                    Análise Detalhada
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium py-3 px-5 shadow-md"
                    onClick={() => handleButtonClick("financial", "/financas")}
                    disabled={isLoading.financial}
                  >
                    {isLoading.financial ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <BarChart3 className="h-5 w-5 mr-2" />
                    )}
                    Métricas Financeiras
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <SaveToHistoryButton 
              formData={formData} 
              diagnostics={diagnostics}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
