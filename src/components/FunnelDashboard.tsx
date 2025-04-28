import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { useEffect, useState } from "react";

interface FunnelDashboardProps {
  formData: any;
  diagnostics: any;
}

export function FunnelDashboard({ formData, diagnostics }: FunnelDashboardProps) {
  const [metrics, setMetrics] = useState(diagnostics);

  useEffect(() => {
    if (!diagnostics) {
      const calculatedMetrics = calculateMetrics(formData);
      setMetrics(calculatedMetrics);
    } else {
      setMetrics(diagnostics);
    }
  }, [formData, diagnostics]);

  if (!metrics) {
    return <div>Carregando...</div>;
  }

  const {
    salesPageConversion,
    checkoutConversion,
    orderBumpRate,
    currentROI,
    currentCPC,
    monthlyGoalProgress,
    totalRevenue
  } = metrics;

  const formatPercentage = (value: number) => `${value.toFixed(0)}%`;
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
        Análise Detalhada
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversão da Página de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(salesPageConversion)}</div>
            <Progress value={salesPageConversion} max={100} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Ideal: 40%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversão do Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(checkoutConversion)}</div>
            <Progress value={checkoutConversion} max={100} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Ideal: 40%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Order Bump</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(orderBumpRate)}</div>
            <Progress value={orderBumpRate} max={100} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Ideal: 30%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI (Retorno sobre Investimento)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentROI.toFixed(2)}x</div>
            <p className="text-sm text-gray-500 mt-2">Quanto você ganha para cada R$1 investido.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPC (Custo por Clique)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentCPC)}</div>
            <p className="text-sm text-gray-500 mt-2">Custo médio por clique nos anúncios.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso da Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(monthlyGoalProgress * 100)}</div>
            <Progress value={monthlyGoalProgress * 100} max={100} className="mt-2" />
            <p className="text-sm text-gray-500 mt-2">Receita Total: {formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
