
import { Separator } from "@/components/ui/separator";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { AdvancedFinanceMetrics } from "@/components/AdvancedFinanceMetrics";
import { TrendVisualization } from "@/components/TrendVisualization";
import { SaveToHistoryButton } from "@/components/FormAnalyzer/SaveToHistoryButton";
import { motion, AnimatePresence } from "framer-motion";
import { EmptyState } from "@/components/EmptyState";
import { ButtonsSection } from "./ButtonsSection";
import { MetricBadges } from "./MetricBadges";
import { ErrorDisplay } from "./ErrorDisplay";
import { ActionableInsightsGrid } from "./ActionableInsightsGrid";
import { FunnelDashboard } from "@/components/FunnelDashboard";

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
  if (hasErrors) {
    return <ErrorDisplay errorMessage={errorMessage} />;
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
        <div className="grid grid-cols-1 gap-6">
          <DiagnosticSection diagnostics={diagnostics} />
          
          <FunnelDashboard
            formData={formData}
            diagnostics={diagnostics}
          />
          
          <TrendVisualization formData={formData} />
          
          <Separator className="my-4 dark:bg-gray-700" />
          
          <AdvancedFinanceMetrics
            formData={formData}
            diagnostics={diagnostics}
          />
          
          <ActionableInsightsGrid insights={diagnostics?.actionableInsights} />
          
          <Separator className="my-4 dark:bg-gray-700" />
          
          <div className="flex justify-between items-center flex-wrap gap-4">
            <MetricBadges formData={formData} diagnostics={diagnostics} />
            
            <div className="flex gap-4 ml-auto">
              <ButtonsSection onNavigateTo={onNavigateTo} />
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
