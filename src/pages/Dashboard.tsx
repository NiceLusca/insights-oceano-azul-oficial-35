
import { MainLayout } from "@/components/MainLayout";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { ComparisonChart } from "@/components/ComparisonChart";
import { FunnelDashboard } from "@/components/FunnelDashboard";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { calculateMetrics, getComparisonData } from "@/utils/metricsHelpers";
import { PdfExportButton } from "@/components/PdfExportButton";
import { SaveHistoryButton } from "@/components/SaveHistoryButton";
import { Card } from "@/components/ui/card";
import { useAuthentication } from "@/hooks/useAuthentication";
import { EmptyState } from "@/components/EmptyState";
import { motion } from "framer-motion";

const Dashboard = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthentication();
  const [formData, setFormData] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState([]);
  
  useEffect(() => {
    // Get data from location state or localStorage
    if (location.state?.formData && location.state?.diagnostics) {
      setFormData(location.state.formData);
      setDiagnostics(location.state.diagnostics);
      setComparisonData(getComparisonData(location.state.formData));
    } else {
      // Try to get from localStorage
      const savedFormData = localStorage.getItem("currentFormData");
      const savedDiagnostics = localStorage.getItem("currentDiagnostics");
      
      if (savedFormData && savedDiagnostics) {
        const parsedFormData = JSON.parse(savedFormData);
        const parsedDiagnostics = JSON.parse(savedDiagnostics);
        
        setFormData(parsedFormData);
        setDiagnostics(parsedDiagnostics);
        setComparisonData(getComparisonData(parsedFormData));
      }
    }
  }, [location]);

  if (!formData || !diagnostics) {
    return (
      <MainLayout>
        <EmptyState
          title="Nenhuma análise disponível"
          description="Por favor, preencha o formulário na página inicial para visualizar seu dashboard."
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
          Dashboard Inteligente
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <DiagnosticSection diagnostics={diagnostics} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ComparisonChart actualData={comparisonData} />
          </motion.div>
        </div>
        
        <Card className="p-6 mt-6 border border-blue-100 dark:border-blue-900 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-blue-800 dark:text-blue-300 mb-3">Exportar e Salvar Análise</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                Exporte um relatório detalhado em PDF ou salve esta análise no seu histórico para consultas futuras.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <SaveHistoryButton 
                  formData={formData}
                  diagnostics={diagnostics}
                  disabled={!isAuthenticated}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <PdfExportButton 
                  formData={formData}
                  diagnostics={diagnostics}
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  );
}

export default Dashboard;
