
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
        title: "Login required",
        description: "Please login to save to history",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    setSaving(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        throw new Error("No active session found");
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
        title: "Analysis saved successfully!",
        description: "You can view your analysis history by clicking on the 'History' tab",
      });
    } catch (error: any) {
      console.error("Error saving analysis:", error);
      toast({
        title: "Error saving analysis",
        description: error.message || "An unexpected error occurred",
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
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
        disabled={saving}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {saving ? "Saving..." : "Save to History"}
      </Button>
    </div>
  );
};
