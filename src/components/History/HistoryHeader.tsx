
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HistoryHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Histórico de Análises
      </h2>
      <Button 
        onClick={() => navigate("/")} 
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
    </div>
  );
};
