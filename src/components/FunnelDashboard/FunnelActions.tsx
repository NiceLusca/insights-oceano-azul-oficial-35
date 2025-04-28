
import { Card } from "@/components/ui/card";
import { RecommendationCard } from "@/components/RecommendationCard";

interface FunnelActionsProps {
  formData: any;
  diagnostics: any;
}

export function FunnelActions({ formData, diagnostics }: FunnelActionsProps) {
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

  return (
    <>
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
    </>
  );
}
