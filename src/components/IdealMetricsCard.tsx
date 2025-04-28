
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface IdealMetricsCardProps {
  hasUpsell: boolean;
}

export const IdealMetricsCard = ({ hasUpsell }: IdealMetricsCardProps) => {
  const metrics = [
    {
      name: "Conversão da Página de Vendas",
      value: "40%",
      description: "Porcentagem de visitantes que vão da página de vendas para o checkout"
    },
    {
      name: "Conversão do Checkout",
      value: "40%",
      description: "Porcentagem de visitantes do checkout que realizam uma compra"
    },
    {
      name: "Taxa de Combo",
      value: "35%",
      description: "Porcentagem das vendas que incluem a opção combo"
    },
    {
      name: "Taxa de Order Bump",
      value: "30%",
      description: "Porcentagem das vendas que incluem um order bump"
    }
  ];

  if (hasUpsell) {
    metrics.push({
      name: "Taxa de Upsell",
      value: "5%",
      description: "Porcentagem das vendas que incluem um upsell"
    });
  }

  return (
    <Card className="overflow-hidden border-blue-200 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5"></div>
      <div className="p-6 bg-blue-50/50">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-100 p-1.5 rounded-md">
            <BarChart3 className="h-5 w-5 text-blue-700" />
          </span>
          <h2 className="text-xl font-semibold text-blue-800">Métricas Ideais</h2>
        </div>
        
        <p className="text-sm text-slate-500 mb-6">
          Use estas métricas de referência para comparar o desempenho do seu funil.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-3 bg-white rounded-lg border border-blue-100 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between">
                <p className="text-sm text-blue-600">{metric.name}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-blue-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-52">{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="font-semibold text-lg mt-1">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
