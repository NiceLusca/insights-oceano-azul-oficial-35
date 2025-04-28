
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface MetricBoxProps {
  title: string;
  value: string;
  idealValue: string;
  status: "success" | "warning" | "error";
}

export function MetricBox({ title, value, idealValue, status }: MetricBoxProps) {
  return (
    <div className={`p-4 rounded-lg border ${
      status === "success" 
        ? "border-l-4 border-l-green-500 bg-white" 
        : status === "warning" 
          ? "border-l-4 border-l-amber-500 bg-white" 
          : "border-l-4 border-l-red-500 bg-white"
    } shadow-sm`}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {status === "success" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : status === "warning" ? (
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </div>
      <p className={`text-2xl font-bold mt-2 ${
        status === "success" 
          ? "text-green-600" 
          : status === "warning" 
            ? "text-amber-600" 
            : "text-red-600"
      }`}>
        {value}
      </p>
      <div className="mt-1 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Ideal: {idealValue}
        </span>
        <span className={`text-xs font-medium ${
          status === "success" 
            ? "text-green-500" 
            : status === "warning" 
              ? "text-amber-500" 
              : "text-red-500"
        }`}>
          {status === "success" 
            ? "Ótimo" 
            : status === "warning" 
              ? "Atenção" 
              : "Crítico"}
        </span>
      </div>
    </div>
  );
}
