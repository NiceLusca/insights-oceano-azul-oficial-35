
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ComparisonChartProps {
  actualData: {
    name: string;
    actual: number;
    ideal: number;
  }[];
}

export const ComparisonChart = ({ actualData }: ComparisonChartProps) => {
  const chartConfig = {
    actual: {
      color: "#0EA5E9",
    },
    ideal: {
      color: "#8B5CF6",
    },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Comparação de Métricas</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={actualData}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tickSize={5}
              tickPadding={5}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              tickSize={5}
              tickPadding={5}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, ""]}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="actual" name="Atual" fill={chartConfig.actual.color} barSize={20} />
            <Bar dataKey="ideal" name="Ideal" fill={chartConfig.ideal.color} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
