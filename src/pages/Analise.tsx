
import { MainLayout } from "@/components/MainLayout";
import { FunnelDashboard } from "@/components/FunnelDashboard";
import { TrendVisualization } from "@/components/TrendVisualization";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { EmptyState } from "@/components/EmptyState";
import { motion } from "framer-motion";

const Analise = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  
  useEffect(() => {
    // Get data from location state or localStorage
    if (location.state?.formData && location.state?.diagnostics) {
      setFormData(location.state.formData);
      setDiagnostics(location.state.diagnostics);
    } else {
      // Try to get from localStorage
      const savedFormData = localStorage.getItem("currentFormData");
      const savedDiagnostics = localStorage.getItem("currentDiagnostics");
      
      if (savedFormData && savedDiagnostics) {
        setFormData(JSON.parse(savedFormData));
        setDiagnostics(JSON.parse(savedDiagnostics));
      }
    }
  }, [location]);

  if (!formData || !diagnostics) {
    return (
      <MainLayout>
        <EmptyState
          title="Nenhuma análise disponível"
          description="Por favor, preencha o formulário na página inicial para visualizar sua análise detalhada."
          actionLabel="Ir para formulário"
          onAction={() => window.location.href = '/'}
          icon={
            <img 
              src="/lovable-uploads/2da50e89-1402-421c-8c73-60efe5119215.png" 
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
      >
        <motion.h1 
          className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Análise Detalhada
        </motion.h1>
        
        <FunnelDashboard 
          formData={formData}
          diagnostics={diagnostics}
        />
        
        <div className="mt-8">
          <TrendVisualization 
            formData={formData} 
          />
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Analise;
