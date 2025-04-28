
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast as sonnerToast } from "sonner";

interface SaveAnalysisButtonProps {
  formData: FormValues;
  diagnostics: any;
  disabled?: boolean;
  variant?: "default" | "compact";
  onSuccess?: () => void;
}

export const SaveAnalysisButton = ({ 
  formData, 
  diagnostics, 
  disabled = false,
  variant = "default",
  onSuccess
}: SaveAnalysisButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveAnalysis = async () => {
    setLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        // Use the appropriate toast based on the component's context
        if (variant === "default") {
          toast({
            title: "É necessário fazer login",
            description: "Faça login para salvar seu histórico",
            variant: "destructive",
          });
        } else {
          sonnerToast.error("Login necessário", {
            description: "Por favor, faça login para salvar no histórico"
          });
        }
        navigate("/auth");
        return;
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
      
      // Use the appropriate toast based on the component's context
      if (variant === "default") {
        toast({
          title: "Análise salva com sucesso!",
          description: "Você pode ver seu histórico de análises na aba 'Histórico'",
        });
      } else {
        sonnerToast.success("Análise salva com sucesso!", {
          description: "Você pode ver seu histórico de análises clicando na aba 'Histórico'"
        });
      }

      // Call the success callback if provided
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Erro ao salvar análise:", error);
      
      // Use the appropriate toast based on the component's context
      if (variant === "default") {
        toast({
          title: "Erro ao salvar análise",
          description: error.message || "Ocorreu um erro inesperado",
          variant: "destructive",
        });
      } else {
        sonnerToast.error("Erro ao salvar análise", {
          description: error.message || "Ocorreu um erro inesperado"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Render different UI based on the variant
  if (variant === "compact") {
    return (
      <div className="flex justify-end mt-6">
        <Button 
          onClick={saveAnalysis}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-6 py-6 h-auto text-base shadow-md transition-all hover:shadow-lg"
          disabled={loading || disabled}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading ? "Salvando..." : "Salvar no Histórico"}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={saveAnalysis}
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
