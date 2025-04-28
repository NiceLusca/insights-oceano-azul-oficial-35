
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, TrendingUp, TrendingDown, BarChart2, PieChart, HistoryIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { periodsOverlap } from "@/components/TrendVisualization/utils";

interface AdvancedFinanceMetricsProps {
  formData: any;
  diagnostics: any;
}

interface HistoricalMetrics {
  revenue: number;
  profit: number;
  roi: number;
  cac: number;
  ltv: number;
  averageOrderValue: number;
}

export function AdvancedFinanceMetrics({ formData, diagnostics }: AdvancedFinanceMetricsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [historicalMetrics, setHistoricalMetrics] = useState<HistoricalMetrics | null>(null);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState(true);
  
  // Fetch historical metrics from previous analyses
  useEffect(() => {
    const fetchHistoricalMetrics = async () => {
      try {
        setIsLoadingHistorical(true);
        
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          return;
        }
        
        const { data, error } = await supabase
          .from("user_analyses")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        if (!data || data.length === 0) return;
        
        // Get current period dates
        const currentStartDate = formData?.startDate ? new Date(formData.startDate) : null;
        const currentEndDate = formData?.endDate ? new Date(formData.endDate) : null;
        
        // Filter out analyses with overlapping periods
        const nonOverlappingAnalyses = data.filter((analysis) => {
          if (!currentStartDate || !currentEndDate) return true;
          
          const analysisStartDate = analysis.form_data?.startDate 
            ? new Date(analysis.form_data.startDate) 
            : null;
          
          const analysisEndDate = analysis.form_data?.endDate 
            ? new Date(analysis.form_data.endDate) 
            : null;
            
          if (!analysisStartDate || !analysisEndDate) return true;
          
          return !periodsOverlap(
            currentStartDate, 
            currentEndDate, 
            analysisStartDate, 
            analysisEndDate
          );
        });
        
        // Calculate average metrics from historical data
        if (nonOverlappingAnalyses.length > 0) {
          let totalRevenue = 0;
          let totalProfit = 0;
          let totalRoi = 0;
          let totalCac = 0;
          let totalLtv = 0;
          let totalAov = 0;
          let validCount = 0;
          
          nonOverlappingAnalyses.forEach((analysis) => {
            if (analysis.diagnostics) {
              validCount++;
              
              // Calculate basic metrics
              const revenue = analysis.diagnostics.totalRevenue || 0;
              const adSpend = analysis.form_data?.adSpend || 0;
              const profit = revenue - adSpend;
              const roi = analysis.diagnostics.currentROI || 0;
              
              // Calculate sales metrics
              const totalSales = (analysis.form_data?.mainProductSales || 0) + 
                                (analysis.form_data?.comboSales || 0);
              const aov = totalSales > 0 ? revenue / totalSales : 0;
              const cac = totalSales > 0 ? adSpend / totalSales : 0;
              const ltv = aov * 1.5;
              
              // Add to totals
              totalRevenue += revenue;
              totalProfit += profit;
              totalRoi += roi;
              totalCac += cac;
              totalLtv += ltv;
              totalAov += aov;
            }
          });
          
          if (validCount > 0) {
            setHistoricalMetrics({
              revenue: totalRevenue / validCount,
              profit: totalProfit / validCount,
              roi: totalRoi / validCount,
              cac: totalCac / validCount,
              ltv: totalLtv / validCount,
              averageOrderValue: totalAov / validCount
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar métricas históricas:", error);
      } finally {
        setIsLoadingHistorical(false);
      }
    };
    
    fetchHistoricalMetrics();
  }, [formData]);
  
  // Calcular métricas financeiras avançadas
  const totalRevenue = diagnostics?.totalRevenue || 0;
  const adSpend = formData?.adSpend || 0;
  const profit = totalRevenue - adSpend;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  
  // Calcular métricas de eficiência de marketing
  const totalSales = (formData?.mainProductSales || 0) + (formData?.comboSales || 0);
  const aov = totalSales > 0 ? totalRevenue / totalSales : 0; // Average Order Value
  const cac = totalSales > 0 ? adSpend / totalSales : 0; // Customer Acquisition Cost
  const ltv = aov * 1.5; // LTV simulado (multiplicador simples)
  const ltvToCAC = cac > 0 ? ltv / cac : 0;
  
  // Calcular breakdown de receita
  const mainProductRevenue = (formData?.mainProductSales || 0) * (formData?.mainProductPrice || 0);
  const comboRevenue = (formData?.comboSales || 0) * (formData?.comboPrice || 0);
  const orderBumpRevenue = (formData?.orderBumpSales || 0) * (formData?.orderBumpPrice || 0);
  const upsellRevenue = formData?.hasUpsell ? (formData?.upsellSales || 0) * (formData?.upsellPrice || 0) : 0;
  
  // Calcular percentuais de contribuição para receita
  const revenueBreakdown = [
    { name: "Produto Principal", value: mainProductRevenue, percentage: totalRevenue > 0 ? (mainProductRevenue / totalRevenue) * 100 : 0 },
    { name: "Combo", value: comboRevenue, percentage: totalRevenue > 0 ? (comboRevenue / totalRevenue) * 100 : 0 },
    { name: "Order Bump", value: orderBumpRevenue, percentage: totalRevenue > 0 ? (orderBumpRevenue / totalRevenue) * 100 : 0 }
  ];
  
  // Adicionar upsell se existir
  if (formData?.hasUpsell && upsellRevenue > 0) {
    revenueBreakdown.push({
      name: "Upsell",
      value: upsellRevenue,
      percentage: totalRevenue > 0 ? (upsellRevenue / totalRevenue) * 100 : 0
    });
  }
  
  // Calcular projeções financeiras
  const monthlyProjection = totalRevenue * 30; // Projeção simples para 30 dias
  const monthlyTarget = formData?.monthlyRevenue || 0;
  const targetProgress = monthlyTarget > 0 ? (monthlyProjection / monthlyTarget) * 100 : 0;
  
  // Definir cores para status de métricas
  const getROIStatus = (roi: number) => {
    if (roi >= 1.5) return "success";
    if (roi >= 1) return "secondary";
    return "destructive";
  };
  
  const getLtvCacStatus = (ratio: number) => {
    if (ratio >= 3) return "success";
    if (ratio >= 1.5) return "secondary";
    return "destructive";
  };

  // Calculate percentage change between current and historical metrics
  const getPercentageChange = (current: number, historical: number) => {
    if (!historical) return 0;
    return ((current - historical) / historical) * 100;
  };

  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <span className="bg-blue-50 p-1 rounded">
              <CircleDollarSign className="h-5 w-5 text-blue-600" />
            </span>
            Métricas Financeiras Avançadas
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiência</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Receita Total</div>
                <div className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                  <span>{totalSales} pedidos • {formatCurrency(aov)} ticket médio</span>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <Badge variant={totalRevenue > historicalMetrics.revenue ? "success" : "destructive"}>
                      {getPercentageChange(totalRevenue, historicalMetrics.revenue).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Lucro</div>
                <div className="text-2xl font-semibold">{formatCurrency(profit)}</div>
                <div className="flex items-center mt-1 justify-between">
                  <Badge 
                    variant={profit >= 0 ? "success" : "destructive"}
                    className="text-xs font-normal"
                  >
                    Margem: {profitMargin.toFixed(1)}%
                  </Badge>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <Badge variant={profit > historicalMetrics.profit ? "success" : "destructive"}>
                      {getPercentageChange(profit, historicalMetrics.profit).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm text-gray-500 mb-1">ROI</div>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  {diagnostics?.currentROI?.toFixed(2) || "0.00"}x
                  <Badge variant={getROIStatus(diagnostics?.currentROI || 0)}>
                    {diagnostics?.currentROI >= 1.5 ? "Ótimo" : 
                     diagnostics?.currentROI >= 1 ? "Aceitável" : "Preocupante"}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                  <span>{formatCurrency(adSpend)} investido em anúncios</span>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <Badge 
                      variant={(diagnostics?.currentROI || 0) > historicalMetrics.roi ? "success" : "destructive"}
                    >
                      {getPercentageChange(diagnostics?.currentROI || 0, historicalMetrics.roi).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Card className="border-dashed border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-sm text-gray-700">Projeção Mensal</h3>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <div className="flex items-center text-xs text-gray-500">
                      <HistoryIcon className="h-3.5 w-3.5 mr-1" />
                      Comparado com a média histórica
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Meta: {formatCurrency(monthlyTarget)}</span>
                  <span className="text-sm">Projeção: {formatCurrency(monthlyProjection)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      targetProgress >= 100 ? 'bg-green-500' : 
                      targetProgress >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                    }`} 
                    style={{ width: `${Math.min(targetProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {targetProgress.toFixed(1)}% da meta mensal
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="efficiency" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm text-gray-500 mb-1">CAC (Custo de Aquisição)</div>
                <div className="text-2xl font-semibold">{formatCurrency(cac)}</div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                  <span>Gasto para adquirir cada cliente</span>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <Badge variant={cac < historicalMetrics.cac ? "success" : "destructive"}>
                      {getPercentageChange(cac, historicalMetrics.cac).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm text-gray-500 mb-1">LTV (Valor do Cliente)</div>
                <div className="text-2xl font-semibold">{formatCurrency(ltv)}</div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                  <span>Valor estimado no ciclo de vida</span>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <Badge variant={ltv > historicalMetrics.ltv ? "success" : "destructive"}>
                      {getPercentageChange(ltv, historicalMetrics.ltv).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm text-gray-500 mb-1">LTV:CAC</div>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  {ltvToCAC.toFixed(2)}x
                  <Badge variant={getLtvCacStatus(ltvToCAC)}>
                    {ltvToCAC >= 3 ? "Excelente" : 
                     ltvToCAC >= 1.5 ? "Bom" : "Insuficiente"}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Ideal: 3x ou mais
                </div>
              </div>
            </div>
            
            <Card className="border-dashed border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-3 text-gray-700">Insights de Eficiência</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded-full ${diagnostics?.currentROI >= 1.5 ? 'bg-green-100' : 'bg-amber-100'}`}>
                      {diagnostics?.currentROI >= 1.5 ? 
                        <TrendingUp className="h-4 w-4 text-green-600" /> : 
                        <TrendingDown className="h-4 w-4 text-amber-600" />
                      }
                    </div>
                    <div className="text-sm">
                      {diagnostics?.currentROI >= 1.5 ?
                        <span>Seu ROI atual permite escala. Considere aumentar o orçamento em 20%.</span> :
                        <span>Seu ROI ainda é baixo para escala. Foque em otimizar os criativos e página de vendas.</span>
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className={`p-1 rounded-full ${ltvToCAC >= 3 ? 'bg-green-100' : 'bg-amber-100'}`}>
                      <BarChart2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      {ltvToCAC >= 3 ?
                        <span>Sua relação LTV:CAC está saudável. Você pode aumentar os gastos com aquisição.</span> :
                        <span>Busque aumentar o LTV com ações de retenção ou diminua o CAC com testes em criativos.</span>
                      }
                    </div>
                  </div>
                  
                  {!isLoadingHistorical && historicalMetrics && (
                    <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-md">
                      <div className="p-1 rounded-full bg-blue-100">
                        <HistoryIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">Comparação histórica:</span> Seu CAC atual está 
                          {cac < historicalMetrics.cac ? (
                            <span className="text-green-600"> {Math.abs(getPercentageChange(cac, historicalMetrics.cac)).toFixed(1)}% menor </span>
                          ) : (
                            <span className="text-red-600"> {Math.abs(getPercentageChange(cac, historicalMetrics.cac)).toFixed(1)}% maior </span>
                          )}
                          que a média histórica, enquanto seu ROI está 
                          {(diagnostics?.currentROI || 0) > historicalMetrics.roi ? (
                            <span className="text-green-600"> {Math.abs(getPercentageChange(diagnostics?.currentROI || 0, historicalMetrics.roi)).toFixed(1)}% melhor.</span>
                          ) : (
                            <span className="text-red-600"> {Math.abs(getPercentageChange(diagnostics?.currentROI || 0, historicalMetrics.roi)).toFixed(1)}% pior.</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="breakdown" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-medium text-sm mb-3 text-gray-700">Distribuição de Receita</h3>
                
                <div className="space-y-3">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span>{formatCurrency(item.value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-green-500' : 
                            index === 2 ? 'bg-amber-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-right text-gray-500 mt-1">{item.percentage.toFixed(1)}% da receita</div>
                      {index < revenueBreakdown.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Valor Médio do Pedido</div>
                  <div className="text-2xl font-semibold">{formatCurrency(aov)}</div>
                  <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                    <span>{totalSales} pedidos totais</span>
                    
                    {!isLoadingHistorical && historicalMetrics && (
                      <Badge 
                        variant={aov > historicalMetrics.averageOrderValue ? "success" : "destructive"}
                      >
                        {getPercentageChange(aov, historicalMetrics.averageOrderValue).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Incremento por Add-ons</div>
                  <div className="text-2xl font-semibold flex items-center">
                    {formatCurrency(orderBumpRevenue + upsellRevenue)}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({((orderBumpRevenue + upsellRevenue) / totalRevenue * 100).toFixed(1)}% da receita)
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Order Bumps + Upsells
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
