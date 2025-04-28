
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save } from "lucide-react";

interface SaveHistoryButtonProps {
  formData: FormValues;
  diagnostics: any;
  disabled?: boolean;
}

export const SaveHistoryButton = ({ formData, diagnostics, disabled }: SaveHistoryButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveHistory = async () => {
    setLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast({
          title: "É necessário fazer login",
          description: "Faça login para salvar seu histórico",
          variant: "destructive",
        });
        return;
      }
      
      // Preparar dados para envio ao Supabase (converter Date para string)
      const formDataForDb = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null
      };
      
      const { error } = await supabase
        .from("user_analyses")
        .insert({
          user_id: session.session.user.id,
          form_data: formDataForDb,
          diagnostics: diagnostics,
        });
      
      if (error) throw error;
      
      toast({
        title: "Análise salva com sucesso!",
        description: "Você pode ver seu histórico de análises clicando em 'Ver Histórico'",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar análise",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={saveHistory} 
      disabled={loading || disabled}
      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 py-6 h-auto text-base"
      size="lg"
    >
      <Save className="h-5 w-5" />
      {loading ? "Salvando..." : "Salvar no Histórico"}
    </Button>
  );
};
