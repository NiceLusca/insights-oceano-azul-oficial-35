
import { MainLayout } from "@/components/MainLayout";
import { FunnelDashboard } from "@/components/FunnelDashboard";
import { TrendVisualization } from "@/components/TrendVisualization";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">Nenhuma análise disponível</h2>
          <p className="mt-2 text-gray-500">
            Por favor, preencha o formulário na página inicial para visualizar sua análise detalhada.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Análise Detalhada</h1>
      
      <FunnelDashboard 
        formData={formData}
        diagnostics={diagnostics}
      />
      
      <div className="mt-8">
        <TrendVisualization 
          formData={formData} 
          diagnostics={diagnostics}
        />
      </div>
    </MainLayout>
  );
};

export default Analise;
