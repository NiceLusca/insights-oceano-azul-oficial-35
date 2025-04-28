
import { useState } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface IdealMetricsCompactProps {
  hasUpsell?: boolean;
}

export function IdealMetricsCompact({ hasUpsell = false }: IdealMetricsCompactProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <CardContent className="p-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Métricas Ideais para Referência
              </h3>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <MetricItem 
                  label="Página de Vendas" 
                  value="40% ou mais" 
                  tooltip="Porcentagem de visitantes que vão da página de vendas para o checkout" 
                />
                
                <MetricItem 
                  label="Checkout" 
                  value="40% ou mais" 
                  tooltip="Porcentagem de visitantes do checkout que realizam uma compra" 
                />
                
                <MetricItem 
                  label="Order Bump" 
                  value="30% ou mais" 
                  tooltip="Porcentagem das vendas que incluem um order bump" 
                />
                
                <MetricItem 
                  label="Combo" 
                  value="35% ou mais" 
                  tooltip="Porcentagem das vendas que incluem a opção combo" 
                />
                
                {hasUpsell && (
                  <MetricItem 
                    label="Upsell" 
                    value="5% ou mais" 
                    tooltip="Porcentagem das vendas que incluem um upsell" 
                  />
                )}
                
                <MetricItem 
                  label="CPC" 
                  value="Até R$2,00" 
                  tooltip="Custo por clique ideal em anúncios" 
                />
                
                <MetricItem 
                  label="ROI" 
                  value="1,5x ou mais" 
                  tooltip="Retorno sobre investimento ideal para escala" 
                />
                
                <MetricItem 
                  label="LTV:CAC" 
                  value="3x ou mais" 
                  tooltip="Relação ideal entre valor do cliente e custo de aquisição" 
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MetricItem({ label, value, tooltip }: { label: string; value: string; tooltip: string }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-gray-400 dark:text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[200px]">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
}
