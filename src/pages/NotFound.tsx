
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    console.error(
      "Erro 404: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="text-center p-8 max-w-md mx-auto rounded-2xl shadow-lg border border-gray-100 dark:border-blue-900/20">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 oceano-azul-logo"></div>
        </div>
        <h1 className="text-6xl font-bold mb-4 text-blue-600 dark:text-blue-400">404</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">Ops! Página não encontrada</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou talvez nunca tenha existido.
        </p>
        <Button 
          asChild
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors rounded-xl"
        >
          <a href="/" className="flex items-center justify-center gap-2">
            <Home className="h-4 w-4" />
            Voltar para o Início
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
