
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SaveHistoryButtonProps {
  formData: FormValues;
  diagnostics: any;
  disabled?: boolean;
}

export const SaveHistoryButton = ({ 
  formData, 
  diagnostics, 
  disabled 
}: SaveHistoryButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        navigate("/auth");
        return;
      }
      
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
        description: "Você pode ver seu histórico de análises na aba 'Histórico'",
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
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 h-auto shadow-md transition-all hover:shadow-lg text-base w-full sm:w-auto whitespace-nowrap"
      size="lg"
    >
      {loading ? (
        "Salvando..."
      ) : (
        <>
          <Save className="mr-2 h-5 w-5" />
          Salvar Análise
        </>
      )}
    </Button>
  );
};
