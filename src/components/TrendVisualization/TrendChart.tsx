
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MetricConfig } from "./utils";

interface TrendChartProps {
  trendData: any[];
  currentConfig: MetricConfig;
}

export function TrendChart({ trendData, currentConfig }: TrendChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickMargin={8}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tickFormatter={currentConfig.yAxisFormatter}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            axisLine={{ stroke: '#e0e0e0' }}
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border rounded shadow-md text-xs">
                    <p className="font-medium">{data.date}</p>
                    <p className="text-gray-900 font-medium">
                      {currentConfig.valuePrefix}{payload[0].value}{currentConfig.valueSuffix}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={currentConfig.color} 
            strokeWidth={2}
            dot={{ r: 2, strokeWidth: 2, fill: "white" }}
            activeDot={{ r: 4, strokeWidth: 0 }}
            name={currentConfig.title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
