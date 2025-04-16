
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center p-8 max-w-md mx-auto glass-morphism rounded-2xl">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/7d27fa6e-d0b6-4bbe-ab3a-cee5c3cca10f.png" 
            alt="Oceano Azul Logo" 
            className="h-20 w-auto"
          />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-blue-600 dark:text-blue-400">404</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">Ops! Página não encontrada</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou talvez nunca tenha existido.
        </p>
        <Button 
          asChild
          className={`${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
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
