
import { Badge } from "@/components/ui/badge";

interface MetricBadgesProps {
  formData: any;
  diagnostics: any;
}

export function MetricBadges({ formData, diagnostics }: MetricBadgesProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="px-2 py-1 border-gray-300 dark:border-blue-500 bg-white dark:bg-blue-800 text-gray-700 dark:text-white">
        {formData.startDate && formData.endDate ? (
          <>
            {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
          </>
        ) : (
          "Período não especificado"
        )}
      </Badge>
      <Badge variant="outline" className="px-2 py-1 border-gray-300 dark:border-blue-500 bg-white dark:bg-blue-800 text-gray-700 dark:text-white">
        ROI: {diagnostics?.currentROI?.toFixed(2) || 0}x
      </Badge>
    </div>
  );
}
