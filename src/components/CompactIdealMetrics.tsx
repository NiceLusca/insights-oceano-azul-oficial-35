
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompactIdealMetricsProps {
  hasUpsell?: boolean;
}

export function CompactIdealMetrics({ hasUpsell = false }: CompactIdealMetricsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card className="shadow-sm bg-white/60 backdrop-blur mb-6">
      <CardContent className="p-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">Métricas Ideais para Referência</div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 p-1 hover:bg-blue-50">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <Separator className="my-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>Página de Vendas</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Taxa de conversão ideal da página de vendas para checkout</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">40% ou mais</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>Checkout</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Taxa de conversão ideal do checkout para venda</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">40% ou mais</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>Order Bump</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Taxa de aceitação do order bump sobre o total de vendas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">30% ou mais</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>Combo</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Taxa de conversão do combo sobre o total de vendas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">35% ou mais</div>
              </div>
              
              {hasUpsell && (
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <span>Upsell</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-48 text-xs">Taxa de aceitação do upsell sobre o total de vendas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-medium">5% ou mais</div>
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>CPC</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Custo por clique ideal em anúncios</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">Até R$2,00</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>ROI</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Retorno sobre investimento ideal para escala</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">1,5x ou mais</div>
              </div>
              
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <span>LTV:CAC</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48 text-xs">Relação ideal entre valor do cliente e custo de aquisição</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-medium">3x ou mais</div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
