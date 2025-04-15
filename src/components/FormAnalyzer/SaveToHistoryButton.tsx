
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save, Loader2 } from "lucide-react";

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

  const saveToHistory = async () => {
    if (!isAuthenticated) {
      toast({
        title: "É necessário fazer login",
        description: "Faça login para salvar seu histórico",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) return;
      
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
        description: "Você pode ver seu histórico de análises clicando na guia 'Histórico'",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar análise",
        description: error.message,
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
        className="flex items-center gap-2"
        disabled={saving}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Salvando..." : "Salvar no Histórico"}
      </Button>
    </div>
  );
};
