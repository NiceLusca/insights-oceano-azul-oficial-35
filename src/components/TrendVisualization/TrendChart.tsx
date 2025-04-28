
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Dot } from "recharts";
import { MetricConfig } from "./utils";

interface TrendChartProps {
  trendData: any[];
  currentConfig: MetricConfig;
}

export function TrendChart({ trendData, currentConfig }: TrendChartProps) {
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    
    // If the point is from historical data, show a different style
    if (payload.historical) {
      return (
        <Dot 
          cx={cx} 
          cy={cy} 
          r={4} 
          fill="#fff" 
          stroke={currentConfig.color} 
          strokeWidth={2}
        />
      );
    }
    
    // Default dot for simulated data
    return (
      <Dot 
        cx={cx} 
        cy={cy} 
        r={2} 
        fill={currentConfig.color} 
        stroke="#fff" 
        strokeWidth={1}
      />
    );
  };

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
                    {data.historical && (
                      <p className="text-blue-600 text-xs mt-1">
                        Dado histórico real
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            content={(props) => (
              <div className="flex items-center justify-center mt-2 text-sm">
                <div className="flex items-center mr-6">
                  <span className="inline-block w-3 h-3 bg-blue-500 mr-1 rounded-full"></span>
                  <span>Dados simulados</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-white border-2 border-blue-500 mr-1 rounded-full"></span>
                  <span>Dados históricos</span>
                </div>
              </div>
            )}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={currentConfig.color} 
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4, strokeWidth: 0 }}
            name={currentConfig.title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
