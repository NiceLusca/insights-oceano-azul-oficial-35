
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "./ui/card";
import { useTheme } from "@/hooks/useTheme";

interface ComparisonChartProps {
  actualData: {
    name: string;
    actual: number;
    ideal: number;
    isMoney?: boolean;
  }[];
}

export const ComparisonChart = ({ actualData }: ComparisonChartProps) => {
  const { theme } = useTheme();
  
  const chartConfig = {
    actual: {
      color: theme === "dark" ? "#60A5FA" : "#0EA5E9",
    },
    ideal: {
      color: theme === "dark" ? "#A78BFA" : "#8B5CF6",
    },
  };

  return (
    <Card className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
      <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-400">Comparação de Métricas</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={actualData}
            margin={{ top: 20, right: 20, bottom: 80, left: 40 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="name" 
              tickSize={5}
              tickMargin={20}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <YAxis 
              tickSize={5}
              tickFormatter={(value) => `${value}%`}
              stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, ""]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF", 
                color: theme === "dark" ? "#E5E7EB" : "#111827",
                border: theme === "dark" ? "1px solid #374151" : "1px solid #E5E7EB",
                padding: '8px', 
                borderRadius: '6px' 
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 30 }}
              align="center"
              verticalAlign="bottom"
              layout="horizontal"
            />
            <Bar dataKey="actual" name="Atual" fill={chartConfig.actual.color} barSize={20} />
            <Bar dataKey="ideal" name="Ideal" fill={chartConfig.ideal.color} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
