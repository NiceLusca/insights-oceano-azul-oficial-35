
import { MainLayout } from "@/components/MainLayout";
import { AdvancedFinanceMetrics } from "@/components/AdvancedFinanceMetrics";
import { FunnelDashboard } from "@/components/FunnelDashboard";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { EmptyState } from "@/components/EmptyState";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Financas = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Get data from location state or localStorage
    if (location.state?.formData && location.state?.diagnostics) {
      setFormData(location.state.formData);
      setDiagnostics(location.state.diagnostics);
      
      // Store in localStorage for persistence
      localStorage.setItem("currentFormData", JSON.stringify(location.state.formData));
      localStorage.setItem("currentDiagnostics", JSON.stringify(location.state.diagnostics));
      
      toast({
        title: "Dados carregados",
        description: "Métricas financeiras prontas para visualização",
      });
    } else {
      // Try to get from localStorage
      const savedFormData = localStorage.getItem("currentFormData");
      const savedDiagnostics = localStorage.getItem("currentDiagnostics");
      
      if (savedFormData && savedDiagnostics) {
        setFormData(JSON.parse(savedFormData));
        setDiagnostics(JSON.parse(savedDiagnostics));
      }
    }
  }, [location, toast]);

  if (!formData || !diagnostics) {
    return (
      <MainLayout>
        <EmptyState
          title="Nenhuma análise disponível"
          description="Por favor, preencha o formulário na página inicial para visualizar suas métricas financeiras."
          actionLabel="Ir para formulário"
          onAction={() => window.location.href = '/'}
          icon={
            <img 
              src="/lovable-uploads/7f2461fb-0a54-45e5-bef3-63dd7b5b9971.png" 
              alt="Oceano Azul" 
              className="w-32 h-32 opacity-30 dark:opacity-20" 
            />
          }
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <motion.h1 
          className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Métricas Financeiras
        </motion.h1>
        
        <AdvancedFinanceMetrics 
          formData={formData}
          diagnostics={diagnostics}
        />
        
        <Separator className="my-6 bg-blue-100 dark:bg-blue-800" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FunnelDashboard formData={formData} diagnostics={diagnostics} />
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Financas;
