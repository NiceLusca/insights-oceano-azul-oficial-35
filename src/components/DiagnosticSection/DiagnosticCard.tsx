
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
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <p className="text-sm text-blue-600 flex items-center gap-2 mb-2">
        {title}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent className="bg-white text-gray-800 border border-gray-200 rounded-lg">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </p>
      <p className={`text-2xl font-bold flex items-center gap-2 ${valueColor || 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
};
