
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
    <Card className="shadow-sm border-blue-100 dark:border-blue-600 dark:bg-gray-600/95 dark:shadow-blue-900/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-gray-800 dark:text-white flex items-center gap-2">
            <span className="bg-blue-50 dark:bg-blue-800 p-1 rounded">
              <CircleDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </span>
            Métricas Financeiras Avançadas
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 dark:bg-gray-700 dark:text-gray-300">
            <TabsTrigger value="overview" className="dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white dark:data-[state=active]:font-medium">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white dark:data-[state=active]:font-medium">
              Eficiência
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white dark:data-[state=active]:font-medium">
              Breakdown
            </TabsTrigger>
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
