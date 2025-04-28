
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";

// Dados simulados para visualização de tendências
const generateTrendData = (days: number, baseValue: number, volatility: number, trend: number = 0) => {
  const data = [];
  let currentValue = baseValue;
  
  for (let i = days; i >= 0; i--) {
    // Calcular data
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    // Adicionar tendência direcional (positiva ou negativa)
    currentValue += trend;
    
    // Adicionar volatilidade aleatória
    const randomFactor = (Math.random() - 0.5) * volatility;
    currentValue = Math.max(currentValue + randomFactor, 0); // Evitar valores negativos
    
    data.push({
      date: dateStr,
      value: Number(currentValue.toFixed(2))
    });
  }
  
  return data;
};

interface TrendVisualizationProps {
  formData?: any;
  diagnostics?: any;
}

export function TrendVisualization({ formData, diagnostics }: TrendVisualizationProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>("roi");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  
  // Gerar dados de tendência com base nas métricas atuais
  const [trendData, setTrendData] = useState<any[]>([]);
  
  // Configurações para diferentes métricas
  const metricConfigs = {
    roi: {
      title: "ROI ao Longo do Tempo",
      color: "#4299E1", // azul
      dataKey: "value",
      valuePrefix: "",
      valueSuffix: "x",
      baseValue: diagnostics?.currentROI || 1.2,
      volatility: 0.15,
      trend: 0.01, // tendência levemente positiva
      yAxisFormatter: (value: number) => `${value.toFixed(1)}x`
    },
    revenue: {
      title: "Receita Diária",
      color: "#48BB78", // verde
      dataKey: "value",
      valuePrefix: "R$ ",
      valueSuffix: "",
      baseValue: (diagnostics?.totalRevenue || 1000) / 30, // receita diária média
      volatility: 200,
      trend: 5, // tendência positiva
      yAxisFormatter: (value: number) => `R$ ${value.toFixed(0)}`
    },
    cpa: {
      title: "Custo por Aquisição",
      color: "#F56565", // vermelho
      dataKey: "value",
      valuePrefix: "R$ ",
      valueSuffix: "",
      baseValue: diagnostics?.adSpend ? (diagnostics.adSpend / (diagnostics.mainProductSales + diagnostics.comboSales)) : 15,
      volatility: 3,
      trend: -0.05, // tendência negativa (melhorando com o tempo)
      yAxisFormatter: (value: number) => `R$ ${value.toFixed(2)}`
    },
    conversion: {
      title: "Taxa de Conversão",
      color: "#9F7AEA", // roxo
      dataKey: "value",
      valuePrefix: "",
      valueSuffix: "%",
      baseValue: diagnostics?.salesPageConversion || 2,
      volatility: 0.4,
      trend: 0.02, // tendência positiva leve
      yAxisFormatter: (value: number) => `${value.toFixed(1)}%`
    }
  };
  
  // Gerar dados com base no período selecionado e métrica
  useEffect(() => {
    const days = selectedPeriod === "7d" ? 7 : selectedPeriod === "30d" ? 30 : 90;
    const config = metricConfigs[selectedMetric as keyof typeof metricConfigs];
    
    setTrendData(generateTrendData(days, config.baseValue, config.volatility, config.trend));
  }, [selectedMetric, selectedPeriod, diagnostics]);
  
  // Obter a configuração atual
  const currentConfig = metricConfigs[selectedMetric as keyof typeof metricConfigs];
  
  // Calcular a tendência (comparando o último valor com o primeiro)
  const trendPercentage = trendData.length >= 2 
    ? ((trendData[trendData.length-1].value - trendData[0].value) / trendData[0].value) * 100
    : 0;
    
  const isPositiveTrend = trendPercentage >= 0;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-800 flex items-center gap-2">
            <span className="bg-blue-50 p-1 rounded">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </span>
            Visualização de Tendências
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 items-center">
              <h3 className="text-sm font-medium text-gray-700">{currentConfig.title}</h3>
              <Badge variant={isPositiveTrend ? "success" : "destructive"} className="h-6">
                {isPositiveTrend ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(trendPercentage).toFixed(1)}%
              </Badge>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              <span>Dados baseados em performance estimada</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickMargin={8}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tickFormatter={currentConfig.yAxisFormatter}
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
                  axisLine={{ stroke: '#e0e0e0' }}
                  width={50}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-md text-xs">
                          <p className="font-medium">{data.date}</p>
                          <p className="text-gray-900 font-medium">
                            {currentConfig.valuePrefix}{payload[0].value}{currentConfig.valueSuffix}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={currentConfig.color} 
                  strokeWidth={2}
                  dot={{ r: 2, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  name={currentConfig.title}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
