
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/hooks/useAuthentication";

export const AuthButton = () => {
  const { user, loading, signOut } = useAuthentication();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (user) {
      signOut();
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
