
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b131f] transition-colors duration-300">
      <div className="text-center p-8 max-w-md mx-auto glass-morphism bg-white/80 dark:bg-gray-900/50 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V18Z" fill="currentColor" />
              <path d="M6 13.5C6 12.8438 6.37967 12.253 6.9643 11.9663L16.9643 6.96634C17.6314 6.65301 18.4221 6.89568 18.8127 7.53442L18.9559 7.78318C19.318 8.37114 19.1038 9.12224 18.5299 9.50193L8.5299 16.5019C7.91093 16.9116 7.08901 16.6302 6.88586 15.9393L6.74302 15.4251C6.58362 14.9294 6.5 14.4152 6.5 13.8976L6 13.5Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-4 text-blue-600 dark:text-blue-400">404</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">Ops! Página não encontrada</p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou talvez nunca tenha existido.
        </p>
        <Button 
          asChild
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
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
