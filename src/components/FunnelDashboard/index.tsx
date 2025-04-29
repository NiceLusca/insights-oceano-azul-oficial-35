
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { FunnelOverview } from "./FunnelOverview";
import { FunnelIssues } from "./FunnelIssues";
import { FunnelActions } from "./FunnelActions";
import { motion, AnimatePresence } from "framer-motion";

interface FunnelDashboardProps {
  formData: any;
  diagnostics: any;
}

export function FunnelDashboard({ formData, diagnostics }: FunnelDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-blue-200 dark:border-blue-500/80 shadow-sm dark:bg-gray-700/95 dark:shadow-blue-900/10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-600 dark:to-blue-500 h-1.5"></div>
        <CardContent className="p-4 md:p-6">
          <motion.h2 
            className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span 
              className="bg-blue-100 dark:bg-blue-700 p-1.5 rounded-md"
              whileHover={{ scale: 1.1 }}
            >
              <TrendingUp className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </motion.span>
            Análise Detalhada
          </motion.h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-gray-100 dark:bg-gray-600/90 p-1 rounded-xl">
              <TabsTrigger 
                value="overview"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-300"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="issues"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-300"
              >
                Problemas
              </TabsTrigger>
              <TabsTrigger 
                value="actions"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-blue-600 data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-300"
              >
                Ações Recomendadas
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "overview" && (
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <FunnelOverview formData={formData} diagnostics={diagnostics} />
                  </TabsContent>
                )}
                
                {activeTab === "issues" && (
                  <TabsContent value="issues" className="space-y-4 mt-0">
                    <FunnelIssues formData={formData} diagnostics={diagnostics} />
                  </TabsContent>
                )}
                
                {activeTab === "actions" && (
                  <TabsContent value="actions" className="space-y-4 mt-0">
                    <FunnelActions formData={formData} diagnostics={diagnostics} />
                  </TabsContent>
                )}
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
