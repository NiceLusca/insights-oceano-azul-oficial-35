
import { MetricBox } from "@/components/MetricBox";
import { MetricComparison } from "@/components/MetricComparison";
import { ActionableInsight } from "@/components/ActionableInsight";
import { formatCurrency } from "@/utils/formatters";

interface FunnelOverviewProps {
  formData: any;
  diagnostics: any;
}

export function FunnelOverview({ formData, diagnostics }: FunnelOverviewProps) {
  // Métricas ideais baseadas no guideline
  const idealMetrics = {
    cpaIdeal: 17,
    icMaximo: 6,
    cpcMaximo: 2,
    hookRateBom: 30,
    hookRatePromissor: 40,
    hookRateExcelente: 45,
    viewRate: 1
  };
  
  // Calcular status das métricas principais
  const calculateStatus = (actual: number, ideal: number, isHigherBetter: boolean = true) => {
    if (isHigherBetter) {
      if (actual >= ideal) return "success";
      if (actual >= ideal * 0.8) return "warning";
      return "error";
    } else {
      if (actual <= ideal) return "success";
      if (actual <= ideal * 1.2) return "warning";
      return "error";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricBox
          title="CPC Atual"
          value={formatCurrency(diagnostics.currentCPC || 0)}
          status={calculateStatus(diagnostics.currentCPC || 0, idealMetrics.cpcMaximo, false)}
          idealValue={formatCurrency(idealMetrics.cpcMaximo)}
        />
        <MetricBox
          title="ROI"
          value={`${diagnostics.currentROI?.toFixed(2) || 0}x`}
          status={calculateStatus(diagnostics.currentROI || 0, 1.5)}
          idealValue="1.5x+"
        />
        <MetricBox
          title="Conversão Página"
          value={`${diagnostics.salesPageConversion?.toFixed(1) || 0}%`}
          status={calculateStatus(diagnostics.salesPageConversion || 0, 40)}
          idealValue="40%+"
        />
        <MetricBox
          title="Conversão Checkout"
          value={`${diagnostics.checkoutConversion?.toFixed(1) || 0}%`}
          status={calculateStatus(diagnostics.checkoutConversion || 0, 40)}
          idealValue="40%+"
        />
      </div>
      
      <MetricComparison 
        metrics={[
          { 
            name: "CPC",
            actual: diagnostics.currentCPC || 0,
            ideal: idealMetrics.cpcMaximo,
            format: "currency",
            isHigherBetter: false
          },
          { 
            name: "ROI",
            actual: diagnostics.currentROI || 0,
            ideal: 1.5,
            format: "multiplier",
            isHigherBetter: true
          },
          { 
            name: "Conversão Página",
            actual: diagnostics.salesPageConversion || 0,
            ideal: 40,
            format: "percentage",
            isHigherBetter: true
          },
          { 
            name: "Conversão Checkout",
            actual: diagnostics.checkoutConversion || 0,
            ideal: 40,
            format: "percentage",
            isHigherBetter: true
          },
          { 
            name: "Order Bump",
            actual: diagnostics.orderBumpRate || 0,
            ideal: 30,
            format: "percentage",
            isHigherBetter: true
          }
        ]}
      />
      
      {diagnostics.currentROI && (
        <ActionableInsight 
          title="Análise de ROI" 
          insight={
            diagnostics.currentROI > 1.5 
              ? "Seu ROI está excelente e pronto para escala!" 
              : diagnostics.currentROI >= 1 
                ? "Seu ROI está aceitável, mas pode melhorar." 
                : "Seu ROI está abaixo do ideal e precisa de atenção imediata."
          }
          action={
            diagnostics.currentROI > 1.5 
              ? "Aumente o orçamento em 20% e continue monitorando o desempenho."
              : diagnostics.currentROI >= 1 
                ? "Mantenha o orçamento atual e foque na otimização dos criativos." 
                : "Se persistir por 3 dias, pause a campanha e revise os criativos."
          }
          status={
            diagnostics.currentROI > 1.5 
              ? "success" 
              : diagnostics.currentROI >= 1 
                ? "warning" 
                : "error"
          }
        />
      )}
    </>
  );
}
