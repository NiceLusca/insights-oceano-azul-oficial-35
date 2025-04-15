
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "@/schemas/formSchema";

export const UserDataService = {
  saveUserLastAnalysis: async (values: FormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) return;
      
      // Preparar dados para envio ao Supabase (converter Date para string)
      const formDataForDb = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null
      };
      
      // Verificar se já existe um registro para o usuário
      const { data } = await supabase
        .from("user_last_analysis")
        .select("user_id")
        .eq("user_id", session.session.user.id)
        .maybeSingle();
      
      if (data) {
        // Atualiza registro existente
        await supabase
          .from("user_last_analysis")
          .update({
            form_data: formDataForDb,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", session.session.user.id);
      } else {
        // Cria novo registro
        await supabase
          .from("user_last_analysis")
          .insert({
            user_id: session.session.user.id,
            form_data: formDataForDb,
          });
      }
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  }
};
