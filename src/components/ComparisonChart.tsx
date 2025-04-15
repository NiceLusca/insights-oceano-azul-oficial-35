
import { ResponsiveBar } from "recharts";
import { Card } from "./ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Info } from "lucide-react";
import {
  Tooltip,
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
        <ChartContainer config={chartConfig}>
          <ResponsiveBar
            data={actualData}
            keys={["actual", "ideal"]}
            indexBy="name"
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: "linear" }}
            colors={({ id }) => chartConfig[id as keyof typeof chartConfig].color}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: (value) => `${value}%`,
            }}
          />
        </ChartContainer>
      </div>
    </Card>
  );
};
