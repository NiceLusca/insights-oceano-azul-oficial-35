
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SaveHistoryButtonProps {
  formData: any;
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
      
      const { error } = await supabase
        .from("user_analyses")
        .insert({
          user_id: session.session.user.id,
          form_data: formData,
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
      className="w-full mt-4"
    >
      {loading ? "Salvando..." : "Salvar no Histórico"}
    </Button>
  );
};
