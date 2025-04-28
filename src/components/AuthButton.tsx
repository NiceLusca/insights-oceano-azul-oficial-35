
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

  if (loading) {
    return <Button disabled>Carregando...</Button>;
  }

  return (
    <Button onClick={handleAuth}>
      {user ? "Sair" : "Entrar / Cadastrar"}
    </Button>
  );
};
