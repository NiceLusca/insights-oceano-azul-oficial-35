
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HistoryEmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8 bg-muted rounded-md p-6">
      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
      <p className="text-lg font-medium mb-2">
        Você ainda não tem análises salvas
      </p>
      <p className="text-muted-foreground mb-4">
        Faça sua primeira análise e clique em "Salvar no Histórico".
      </p>
      <Button onClick={() => navigate("/")}>
        Criar Nova Análise
      </Button>
    </div>
  );
};
