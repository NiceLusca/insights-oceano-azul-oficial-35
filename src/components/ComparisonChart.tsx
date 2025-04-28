
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "./ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonChartProps {
  actualData: {
    name: string;
    actual: number;
    ideal: number;
    isMoney?: boolean;
  }[];
}

export const ComparisonChart = ({ actualData }: ComparisonChartProps) => {
  const isMobile = useIsMobile();
  
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
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={actualData}
            margin={isMobile ? 
              { top: 20, right: 10, bottom: 80, left: 10 } : 
              { top: 20, right: 20, bottom: 80, left: 40 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tickSize={5}
              tickMargin={20}
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{fontSize: isMobile ? 10 : 12}}
            />
            <YAxis 
              tickSize={5}
              tickFormatter={(value) => `${value}%`}
              tick={{fontSize: isMobile ? 10 : 12}}
              width={isMobile ? 30 : 40}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, ""]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ padding: '8px', borderRadius: '6px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 30 }}
              align="center"
              verticalAlign="bottom"
              layout="horizontal"
            />
            <Bar dataKey="actual" name="Atual" fill={chartConfig.actual.color} barSize={isMobile ? 15 : 20} />
            <Bar dataKey="ideal" name="Ideal" fill={chartConfig.ideal.color} barSize={isMobile ? 15 : 20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
