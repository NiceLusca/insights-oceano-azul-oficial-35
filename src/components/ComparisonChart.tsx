
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "./ui/card";

interface ComparisonChartProps {
  actualData: {
    name: string;
    actual: number;
    ideal: number;
    isMoney?: boolean;
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
    <Card className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-blue-800">Comparação de Métricas</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={actualData}
            margin={{ top: 20, right: 20, bottom: 80, left: 40 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tickSize={5}
              tickMargin={20}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#6B7280"
            />
            <YAxis 
              tickSize={5}
              tickFormatter={(value) => `${value}%`}
              stroke="#6B7280"
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, ""]}
              labelFormatter={(label) => `${label}`}
              contentStyle={{ 
                backgroundColor: "#FFFFFF", 
                color: "#111827",
                border: "1px solid #E5E7EB",
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
