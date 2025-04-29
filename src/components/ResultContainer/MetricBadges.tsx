
import { Badge } from "@/components/ui/badge";

interface MetricBadgesProps {
  formData: any;
  diagnostics: any;
}

export function MetricBadges({ formData, diagnostics }: MetricBadgesProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="px-2 py-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {formData.startDate && formData.endDate ? (
          <>
            {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
          </>
        ) : (
          "Período não especificado"
        )}
      </Badge>
      <Badge variant="outline" className="px-2 py-1 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        ROI: {diagnostics?.currentROI?.toFixed(2) || 0}x
      </Badge>
    </div>
  );
}
