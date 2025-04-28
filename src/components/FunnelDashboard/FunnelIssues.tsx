
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { getIdealMetrics } from "./utils";

interface FunnelIssuesProps {
  formData: any;
  diagnostics: any;
}

export function FunnelIssues({ formData, diagnostics }: FunnelIssuesProps) {
  // Métricas ideais baseadas no guideline
  const idealMetrics = getIdealMetrics();
  
  // Determinar problemas do funil
  const funnelIssues = [];
  
  if (diagnostics.currentCPC > idealMetrics.cpcMaximo) {
    funnelIssues.push({
      id: "high-cpc",
      title: "CPC Elevado",
      description: `Seu CPC atual de ${formatCurrency(diagnostics.currentCPC)} está acima do ideal de ${formatCurrency(idealMetrics.cpcMaximo)}`,
      severity: "error",
      recommendation: "Pause este conjunto/campanha se não houver vendas após 2 dias"
    });
  }
  
  if (diagnostics.salesPageConversion < 40) {
    funnelIssues.push({
      id: "low-sales-page-conversion",
      title: "Conversão da Página de Vendas Baixa",
      description: `Sua taxa de conversão da página de vendas de ${diagnostics.salesPageConversion.toFixed(1)}% está abaixo do ideal (40%)`,
      severity: "error",
      recommendation: "Revise os elementos persuasivos da página e simplifique o caminho para o checkout"
    });
  }
  
  if (diagnostics.checkoutConversion < 40) {
    funnelIssues.push({
      id: "low-checkout-conversion",
      title: "Conversão do Checkout Baixa",
      description: `Sua conversão de checkout de ${diagnostics.checkoutConversion.toFixed(1)}% está abaixo do ideal (40%)`,
      severity: "error",
      recommendation: "Simplifique o processo de checkout e adicione elementos de confiança"
    });
  }
  
  if ((diagnostics.orderBumpRate || 0) < 30) {
    funnelIssues.push({
      id: "low-order-bump",
      title: "Taxa de Order Bump Baixa",
      description: `Sua taxa de order bump de ${(diagnostics.orderBumpRate || 0).toFixed(1)}% está abaixo do ideal (30%)`,
      severity: "warning",
      recommendation: "Melhore a oferta do order bump e sua apresentação no checkout"
    });
  }
  
  // Recomendações baseadas no ROI
  let roiRecommendation = {};
  
  if (diagnostics.currentROI > 1.5) {
    roiRecommendation = {
      id: "roi-good",
      title: "ROI Excelente",
      description: `Seu ROI atual de ${diagnostics.currentROI.toFixed(2)}x está acima do ideal para escala`,
      severity: "success",
      recommendation: "Aumente o orçamento em 20% e continue monitorando o desempenho"
    };
  } else if (diagnostics.currentROI >= 1 && diagnostics.currentROI <= 1.5) {
    roiRecommendation = {
      id: "roi-ok",
      title: "ROI Aceitável",
      description: `Seu ROI atual de ${diagnostics.currentROI.toFixed(2)}x está na zona de manutenção`,
      severity: "warning",
      recommendation: "Mantenha o orçamento e foque na otimização dos criativos"
    };
  } else if (diagnostics.currentROI < 1) {
    roiRecommendation = {
      id: "roi-bad",
      title: "ROI Abaixo do Ideal",
      description: `Seu ROI atual de ${diagnostics.currentROI.toFixed(2)}x está gerando prejuízo`,
      severity: "error",
      recommendation: "Se persistir por 3 dias, pause a campanha e revise os criativos"
    };
  }
  
  if (Object.keys(roiRecommendation).length > 0) {
    funnelIssues.push(roiRecommendation);
  }

  return (
    <>
      {funnelIssues.length > 0 ? (
        funnelIssues.map((issue) => (
          <Alert 
            key={issue.id}
            variant={issue.severity === "error" ? "destructive" : "default"}
            className={`border-l-4 ${
              issue.severity === "error" 
                ? "border-l-red-500 bg-red-50" 
                : issue.severity === "warning" 
                  ? "border-l-amber-500 bg-amber-50" 
                  : "border-l-green-500 bg-green-50"
            }`}
          >
            <div className="flex items-start">
              {issue.severity === "error" ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              ) : issue.severity === "warning" ? (
                <HelpCircle className="h-5 w-5 text-amber-500 mr-2" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              )}
              <div>
                <AlertTitle className={`text-base ${
                  issue.severity === "error" 
                    ? "text-red-700" 
                    : issue.severity === "warning" 
                      ? "text-amber-700" 
                      : "text-green-700"
                }`}>
                  {issue.title}
                </AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  <p className="mb-1">{issue.description}</p>
                  <p className="font-medium">Recomendação: {issue.recommendation}</p>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))
      ) : (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-green-700">Parabéns!</h3>
          <p className="text-gray-600 mt-2">Não encontramos problemas críticos no seu funil.</p>
        </div>
      )}
    </>
  );
}
