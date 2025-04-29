
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormValues } from "@/schemas/formSchema";
import { Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
        title: "Análise salva",
        description: "Sua análise foi salva com sucesso no histórico",
      });
    } catch (error) {
      console.error("Erro ao salvar no histórico:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar sua análise no histórico",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Button 
        onClick={saveToHistory}
        variant="outline"
        disabled={saving}
        className="flex items-center gap-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-200 bg-white dark:bg-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-800/70 px-6 py-2 shadow-sm dark:shadow-blue-900/20"
        size="lg"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Salvando..." : "Salvar no Histórico"}
      </Button>
    </motion.div>
  );
}
