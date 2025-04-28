
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface TrendHeaderProps {
  title: string;
  trendPercentage: number;
}

export function TrendHeader({ title, trendPercentage }: TrendHeaderProps) {
  const isPositiveTrend = trendPercentage >= 0;
  
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-2 items-center">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <Badge variant={isPositiveTrend ? "success" : "destructive"} className="h-6">
          {isPositiveTrend ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {Math.abs(trendPercentage).toFixed(1)}%
        </Badge>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xs text-gray-500 flex items-center gap-1 cursor-help">
            <HelpCircle className="h-3 w-3" />
            <span className="hidden sm:inline">Dados baseados em performance estimada</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">
            Este gráfico mostra uma estimativa da tendência baseada nos dados fornecidos. 
            Os resultados podem variar de acordo com as condições reais do mercado.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
