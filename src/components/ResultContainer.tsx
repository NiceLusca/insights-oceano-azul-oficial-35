
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { AdvancedFinanceMetrics } from "@/components/AdvancedFinanceMetrics";
import { ActionableInsight } from "@/components/ActionableInsight";
import { TrendVisualization } from "@/components/TrendVisualization";
import { CompactIdealMetrics } from "@/components/CompactIdealMetrics";
import { SaveToHistoryButton } from "@/components/FormAnalyzer/SaveToHistoryButton";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
    analytics: false,
    financial: false,
  });
  const { toast } = useToast();

  const handleButtonClick = (buttonType: string, path: string) => {
    setIsLoading(prev => ({ ...prev, [buttonType]: true }));
    
    // Simulate loading time
    setTimeout(() => {
      onNavigateTo(path);
      setIsLoading(prev => ({ ...prev, [buttonType]: false }));
    }, 300);
  };

  if (hasErrors) {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-red-700">Atenção</h3>
        <p className="text-red-600 mt-2">{errorMessage}</p>
      </motion.div>
    );
  }
  
  if (!formData || !diagnostics) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/lovable-uploads/2da50e89-1402-421c-8c73-60efe5119215.png" 
          alt="Oceano Azul" 
          className="w-32 h-32 mb-8 opacity-30" 
        />
        <h3 className="text-xl font-medium text-gray-400">Nenhum dado para analisar</h3>
        <p className="text-gray-400 mt-2 max-w-md text-center">
          Preencha o formulário de análise para visualizar os resultados e métricas detalhadas do seu funil de vendas.
        </p>
        <Button 
          className="mt-6"
          onClick={() => window.location.reload()}
        >
          Iniciar Nova Análise
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <CompactIdealMetrics hasUpsell={formData.hasUpsell} />
      
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
            <Badge variant="outline" className="px-2 py-1">
              {formData.startDate && formData.endDate ? (
                <>
                  {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
                </>
              ) : (
                "Período não especificado"
              )}
            </Badge>
            <Badge variant="outline" className="px-2 py-1">
              ROI: {diagnostics?.currentROI?.toFixed(2) || 0}x
            </Badge>
          </div>
          
          <div className="flex gap-3 ml-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg"
                className="flex gap-2 bg-white hover:bg-gray-50 shadow-sm border-blue-200 text-blue-700 hover:text-blue-800"
                onClick={() => {
                  handleButtonClick("analytics", "/analise");
                }}
                disabled={isLoading.analytics}
              >
                {isLoading.analytics ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
                Análise Detalhada
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                className="flex gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md border-0"
                onClick={() => {
                  handleButtonClick("financial", "/financas");
                }}
                disabled={isLoading.financial}
              >
                {isLoading.financial ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="h-5 w-5" />
                )}
                Métricas Financeiras
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <SaveToHistoryButton 
            formData={formData} 
            diagnostics={diagnostics}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>
    </div>
  );
}
