
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">Nenhuma análise disponível</h2>
          <p className="mt-2 text-gray-500">
            Por favor, preencha o formulário na página inicial para visualizar seu dashboard.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Dashboard Inteligente</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DiagnosticSection diagnostics={diagnostics} />
        <ComparisonChart actualData={comparisonData} />
      </div>
      
      <Card className="p-6 mt-6 border border-blue-100 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-blue-800 mb-3">Exportar e Salvar Análise</h3>
            <p className="text-gray-600 mb-4 md:mb-0">
              Exporte um relatório detalhado em PDF ou salve esta análise no seu histórico para consultas futuras.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <SaveHistoryButton 
              formData={formData}
              diagnostics={diagnostics}
              disabled={!isAuthenticated}
            />
            <PdfExportButton 
              formData={formData}
              diagnostics={diagnostics}
            />
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default Dashboard;
