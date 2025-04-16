
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DiagnosticCardProps {
  title: string;
  value: string;
  valueColor?: string;
  tooltip?: string;
}

export const DiagnosticCard = ({ title, value, valueColor, tooltip }: DiagnosticCardProps) => {
  return (
    <div className="p-4 bg-white dark:bg-black/90 rounded-xl shadow-sm border border-gray-100 dark:border-blue-900/20">
      <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
        {title}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </p>
      <p className={`text-2xl font-bold flex items-center gap-2 ${valueColor || 'text-gray-900 dark:text-gray-100'}`}>
        {value}
      </p>
    </div>
  );
};
