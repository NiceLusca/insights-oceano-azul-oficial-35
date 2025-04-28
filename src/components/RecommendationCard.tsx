
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Icon } from "@/components/Icon";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  recommendations: string[];
  icon: string;
}

export function RecommendationCard({ title, recommendations, icon }: RecommendationCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Icon name={icon} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-white font-medium">{title}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 bg-blue-100 rounded-full p-0.5">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
