
import { Loader2 } from "lucide-react";

export const HistoryLoading = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <p>Carregando histórico...</p>
    </div>
  );
};
