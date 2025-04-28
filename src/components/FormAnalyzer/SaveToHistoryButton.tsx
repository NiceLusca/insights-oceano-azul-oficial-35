
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SaveToHistoryButtonProps {
  formData: FormValues;
  diagnostics: any;
  isAuthenticated: boolean;
}

export const SaveToHistoryButton = ({ 
  formData, 
  diagnostics, 
  isAuthenticated 
}: SaveToHistoryButtonProps) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveToHistory = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Por favor, faça login para salvar no histórico",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setSaving(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error("Nenhuma sessão ativa encontrada");
      }
      
      // Prepare data for Supabase (convert Date to string)
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
        description: "Você pode ver seu histórico de análises clicando na aba 'Histórico'",
      });
    } catch (error: any) {
      console.error("Erro ao salvar análise:", error);
      toast({
        title: "Erro ao salvar análise",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-end mt-6">
      <Button 
        onClick={saveToHistory}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6 py-6 h-auto text-base shadow-md transition-all hover:shadow-lg"
        disabled={saving}
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {saving ? "Salvando..." : "Salvar no Histórico"}
      </Button>
    </div>
  );
};
