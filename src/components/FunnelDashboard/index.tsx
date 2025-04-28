
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FunnelOverview } from "./FunnelOverview";
import { FunnelIssues } from "./FunnelIssues";
import { FunnelActions } from "./FunnelActions";

interface FunnelDashboardProps {
  formData: any;
  diagnostics: any;
}

export function FunnelDashboard({ formData, diagnostics }: FunnelDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden border-blue-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5"></div>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 p-1.5 rounded-md">
              <TrendingUp className="h-5 w-5 text-blue-700" />
            </span>
            Análise Detalhada
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="issues">Problemas</TabsTrigger>
              <TabsTrigger value="actions">Ações Recomendadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <FunnelOverview formData={formData} diagnostics={diagnostics} />
            </TabsContent>
            
            <TabsContent value="issues" className="space-y-4">
              <FunnelIssues formData={formData} diagnostics={diagnostics} />
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              <FunnelActions formData={formData} diagnostics={diagnostics} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
