
import { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
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
  icon?: string;
  className?: string;
  statusIcon?: ReactNode;
}

export const DiagnosticCard = ({ 
  title, 
  value, 
  valueColor, 
  tooltip,
  icon,
  className,
  statusIcon
}: DiagnosticCardProps) => {
  return (
    <div className={cn(
      "p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all hover:shadow-md dark:shadow-blue-900/10", 
      className
    )}>
      <div className="flex justify-between items-start">
        <p className="text-sm text-blue-600 dark:text-blue-300 flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-medium">{title}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-blue-400 dark:text-blue-300" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-52">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </p>
        {statusIcon && (
          <span className="ml-1">
            {statusIcon}
          </span>
        )}
      </div>
      <p className={`text-xl sm:text-2xl font-bold flex items-center gap-2 mt-1.5 ${valueColor || 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
};
