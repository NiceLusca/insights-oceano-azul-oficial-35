
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { AdvancedFinanceMetricsProps } from "./types";
import { useHistoricalMetrics } from "./useHistoricalMetrics";
import { useFinanceCalculations } from "./useFinanceCalculations";
import { OverviewTab } from "./OverviewTab";
import { EfficiencyTab } from "./EfficiencyTab";
import { BreakdownTab } from "./BreakdownTab";

export function AdvancedFinanceMetrics({ formData, diagnostics }: AdvancedFinanceMetricsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { historicalMetrics, isLoadingHistorical } = useHistoricalMetrics(formData);
  const metrics = useFinanceCalculations(formData, diagnostics);

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
          
          <TabsContent value="overview">
            <OverviewTab 
              metrics={metrics} 
              historicalMetrics={historicalMetrics} 
              isLoadingHistorical={isLoadingHistorical} 
            />
          </TabsContent>
          
          <TabsContent value="efficiency">
            <EfficiencyTab 
              metrics={metrics}
              historicalMetrics={historicalMetrics} 
              isLoadingHistorical={isLoadingHistorical} 
            />
          </TabsContent>
          
          <TabsContent value="breakdown">
            <BreakdownTab 
              metrics={metrics} 
              historicalMetrics={historicalMetrics} 
              isLoadingHistorical={isLoadingHistorical} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
