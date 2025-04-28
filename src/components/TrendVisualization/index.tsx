
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { generateTrendData, getMetricConfigs, fetchHistoricalData } from "./utils";
import { TrendChart } from "./TrendChart";
import { TrendHeader } from "./TrendHeader";

interface TrendVisualizationProps {
  formData?: any;
  diagnostics?: any;
}

export function TrendVisualization({ formData, diagnostics }: TrendVisualizationProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("roi");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  
  // Generate trend data based on current metrics
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get metric configurations
  const metricConfigs = getMetricConfigs(diagnostics);
  
  // Generate data based on selected period and metric
  useEffect(() => {
    const days = selectedPeriod === "7d" ? 7 : selectedPeriod === "30d" ? 30 : 90;
    const config = metricConfigs[selectedMetric as keyof typeof metricConfigs];
    
    setIsLoading(true);
    
    generateTrendData(days, config.baseValue, config.volatility, config.trend, formData)
      .then(data => {
        setTrendData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao gerar dados de tendência:", error);
        setIsLoading(false);
      });
  }, [selectedMetric, selectedPeriod, diagnostics, formData]);
  
  // Get current configuration
  const currentConfig = metricConfigs[selectedMetric as keyof typeof metricConfigs];
  
  // Calculate trend (comparing last value with first)
  const trendPercentage = trendData.length >= 2 
    ? ((trendData[trendData.length-1].value - trendData[0].value) / trendData[0].value) * 100
    : 0;
    
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <span className="bg-blue-50 p-1 rounded">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </span>
            Visualização de Tendências
            {isLoading && <span className="text-xs text-gray-500 ml-2">(Carregando dados...)</span>}
          </CardTitle>
          
          <div className="flex gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder="Métrica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi">ROI</SelectItem>
                <SelectItem value="revenue">Receita</SelectItem>
                <SelectItem value="cpa">Custo p/ Aquisição</SelectItem>
                <SelectItem value="conversion">Taxa de Conversão</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[100px] h-8 text-sm">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-2">
          <TrendHeader 
            title={currentConfig.title}
            trendPercentage={trendPercentage}
          />
          
          {isLoading ? (
            <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-md">
              <div className="animate-pulse text-blue-500">Carregando dados históricos...</div>
            </div>
          ) : (
            <TrendChart 
              trendData={trendData} 
              currentConfig={currentConfig} 
            />
          )}
          
          <div className="mt-4 px-3 py-2 bg-blue-50 rounded-md text-sm text-blue-700">
            <p>
              <strong>Nota:</strong> Esta visualização combina dados históricos reais (quando disponíveis) 
              e projeções para períodos sem histórico. Os pontos maiores indicam dados reais de análises anteriores.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
