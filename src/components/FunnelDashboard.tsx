
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, HelpCircle, TrendingUp, TrendingDown } from "lucide-react";
import { MetricBox } from "@/components/MetricBox";
import { ActionableInsight } from "@/components/ActionableInsight";
import { RecommendationCard } from "@/components/RecommendationCard";
import { MetricComparison } from "@/components/MetricComparison";
import { formatCurrency } from "@/utils/formatters";

interface FunnelDashboardProps {
  formData: any;
  diagnostics: any;
}

export function FunnelDashboard({ formData, diagnostics }: FunnelDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
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
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden border-blue-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5"></div>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 p-1.5 rounded-md">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </span>
            Dashboard Inteligente de Funil
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="issues">Problemas ({funnelIssues.length})</TabsTrigger>
              <TabsTrigger value="actions">Ações Recomendadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="issues" className="space-y-4">
              {funnelIssues.length > 0 ? (
                funnelIssues.map((issue) => (
                  <Alert 
                    key={issue.id}
                    variant={issue.severity as any}
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
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RecommendationCard
                  title="Controle de Tráfego"
                  recommendations={[
                    diagnostics.currentCPC > idealMetrics.cpcMaximo 
                      ? "Pause conjuntos com CPC > R$2 que não converteram após 2 dias" 
                      : "Seu CPC está dentro do ideal. Continue monitorando.",
                    diagnostics.currentROI > 1.5 
                      ? "Aumente orçamento em 20% aproveitando o bom ROI" 
                      : "Mantenha orçamento atual e optimize criativos.",
                    "Ligue suas campanhas manualmente às 5h da manhã para otimizar resultados.",
                    "Produza continuamente novos criativos baseados no que já funcionou."
                  ]}
                  icon="chart-bar"
                />
                
                <RecommendationCard
                  title="Otimização de Página"
                  recommendations={[
                    diagnostics.salesPageConversion < 40 
                      ? "Revise elementos persuasivos da página de vendas" 
                      : "Sua conversão de página está boa. Mantenha a estratégia.",
                    diagnostics.checkoutConversion < 40 
                      ? "Simplifique o processo de checkout" 
                      : "Seu checkout está convertendo bem. Continue monitorando.",
                    (diagnostics.orderBumpRate || 0) < 30 
                      ? "Melhore a proposta de valor do seu order bump" 
                      : "Seu order bump está performando bem."
                  ]}
                  icon="settings"
                />
              </div>
              
              <Card className="p-4">
                <h3 className="font-semibold text-lg mb-3">Plano de Ação Imediato</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  {diagnostics.currentCPC > idealMetrics.cpcMaximo && (
                    <li>Revise os criativos que estão com CPC elevado e considere pausá-los.</li>
                  )}
                  {diagnostics.salesPageConversion < 40 && (
                    <li>Otimize sua página de vendas focando em melhorar elementos persuasivos.</li>
                  )}
                  {diagnostics.checkoutConversion < 40 && (
                    <li>Simplifique seu checkout e adicione elementos de confiança.</li>
                  )}
                  {(diagnostics.orderBumpRate || 0) < 30 && (
                    <li>Reformule a proposta de order bump para torná-la mais atrativa.</li>
                  )}
                  {diagnostics.currentROI < 1 && (
                    <li>Monitore o ROI diariamente e considere pausar após 3 dias de prejuízo.</li>
                  )}
                  {diagnostics.currentROI >= 1.5 && (
                    <li>Aumente o orçamento diário em 20% para aproveitar o bom desempenho.</li>
                  )}
                  <li>Implemente testes contínuos de novos criativos com base no guideline fornecido.</li>
                </ol>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
