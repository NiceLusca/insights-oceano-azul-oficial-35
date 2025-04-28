
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, AlertCircle, ArrowRight } from "lucide-react";

interface ActionableInsightProps {
  title: string;
  insight: string;
  action: string;
  status: "success" | "warning" | "error";
}

export function ActionableInsight({ title, insight, action, status }: ActionableInsightProps) {
  return (
    <Card className={`border-l-4 overflow-hidden ${
      status === "success" 
        ? "border-l-green-500" 
        : status === "warning" 
          ? "border-l-amber-500" 
          : "border-l-red-500"
    }`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-1.5 rounded-full ${
            status === "success" 
              ? "bg-green-100" 
              : status === "warning" 
                ? "bg-amber-100" 
                : "bg-red-100"
          }`}>
            {status === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : status === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-gray-600 mt-1">{insight}</p>
            
            <div className="mt-4 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
              <p className="text-blue-800 font-medium">{action}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
