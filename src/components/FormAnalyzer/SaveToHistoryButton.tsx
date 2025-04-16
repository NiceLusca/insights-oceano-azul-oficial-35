
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save, Loader2, ShareIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

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
  const { theme } = useTheme();

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

  // Função para compartilhar análise
  const shareAnalysis = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Análise de Conversão',
        text: `ROI: ${diagnostics.currentROI?.toFixed(2)}x | Faturamento: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(diagnostics.totalRevenue)}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      // Fallback para navegadores que não suportam a API Web Share
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "URL da análise copiada para a área de transferência",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <Button 
        onClick={saveToHistory}
        className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'} transition-colors flex-1`}
        disabled={saving}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Salvando..." : "Salvar no Histórico"}
      </Button>
      
      <Button
        onClick={shareAnalysis}
        variant="outline"
        className="flex items-center gap-2 flex-1"
      >
        <ShareIcon className="h-4 w-4" />
        Compartilhar Análise
      </Button>
    </div>
  );
};
