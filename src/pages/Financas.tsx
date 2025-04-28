
import { MainLayout } from "@/components/MainLayout";
import { AdvancedFinanceMetrics } from "@/components/AdvancedFinanceMetrics";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Financas = () => {
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
            Por favor, preencha o formulário na página inicial para visualizar suas métricas financeiras.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Métricas Financeiras</h1>
      
      <AdvancedFinanceMetrics 
        formData={formData}
        diagnostics={diagnostics}
      />
    </MainLayout>
  );
};

export default Financas;
