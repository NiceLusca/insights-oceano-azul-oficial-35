
import { Database as GeneratedDatabase } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

// Extend the generated database types with our custom tables
export interface Database extends GeneratedDatabase {
  public: {
    Tables: {
      user_analyses: {
        Row: {
          id: string;
          user_id: string;
          form_data: Json;
          diagnostics: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          form_data: Json;
          diagnostics: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          form_data?: Json;
          diagnostics?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_analyses_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_last_analysis: {
        Row: {
          user_id: string;
          form_data: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          form_data: Json;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          form_data?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_last_analysis_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    } & GeneratedDatabase["public"]["Tables"];
    Views: GeneratedDatabase["public"]["Views"];
    Functions: GeneratedDatabase["public"]["Functions"];
    Enums: GeneratedDatabase["public"]["Enums"];
    CompositeTypes: GeneratedDatabase["public"]["CompositeTypes"];
  };
}
