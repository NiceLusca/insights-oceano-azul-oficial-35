
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = () => {
    if (user) {
      supabase.auth.signOut().then(() => {
        navigate("/");
      });
    } else {
      navigate("/auth");
    }
  };

  const handleHistory = () => {
    navigate("/history");
  };

  if (loading) {
    return <Button disabled>Carregando...</Button>;
  }

  return (
    <div className="flex gap-2">
      {user && (
        <Button variant="outline" onClick={handleHistory}>
          Ver Histórico
        </Button>
      )}
      <Button onClick={handleAuth}>
        {user ? "Sair" : "Entrar / Cadastrar"}
      </Button>
    </div>
  );
};
