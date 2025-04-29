
import { Button } from "@/components/ui/button";
import { Loader2, FileText, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ButtonsSectionProps {
  onNavigateTo: (path: string) => void;
}

export function ButtonsSection({ onNavigateTo }: ButtonsSectionProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    financial: false,
    analysis: false
  });
  
  const { toast } = useToast();

  const handleButtonClick = (buttonType: string, path: string) => {
    setIsLoading(prev => ({ ...prev, [buttonType]: true }));
    
    // Simulate loading time
    setTimeout(() => {
      toast({
        title: "Navegando...",
        description: `Indo para ${path === "/analise" ? "análise detalhada" : "métricas financeiras"}`,
      });
      onNavigateTo(path);
      setIsLoading(prev => ({ ...prev, [buttonType]: false }));
    }, 300);
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="w-full"
      >
        <Button 
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:border dark:border-blue-500 text-white font-medium py-3 px-5 shadow-md dark:shadow-blue-900/20"
          onClick={() => handleButtonClick("analysis", "/analise")}
          disabled={isLoading.analysis}
        >
          {isLoading.analysis ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-white" />
          ) : (
            <FileText className="h-5 w-5 mr-2 text-white" />
          )}
          <span className="text-white font-medium">Análise Detalhada</span>
        </Button>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="w-full"
      >
        <Button 
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 dark:border dark:border-blue-500 text-white font-medium py-3 px-5 shadow-md dark:shadow-blue-900/20"
          onClick={() => handleButtonClick("financial", "/financas")}
          disabled={isLoading.financial}
        >
          {isLoading.financial ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin text-white" />
          ) : (
            <BarChart3 className="h-5 w-5 mr-2 text-white" />
          )}
          <span className="text-white font-medium">Métricas Financeiras</span>
        </Button>
      </motion.div>
    </div>
  );
}
