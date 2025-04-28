
import { ReactNode } from "react";
import { AuthButton } from "./AuthButton";
import { MoveRight } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white">
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        <header className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <img 
                src="/lovable-uploads/72cd2286-ac0e-4d70-a2ad-c43412ffe8e7.png" 
                alt="Oceano Azul Logo" 
                className="h-12 w-auto"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
                Insights Oceano Azul
              </h1>
              <p className="text-[#0EA5E9] font-medium flex items-center gap-1.5">
                Diagnóstico de Funil
                <MoveRight className="h-3.5 w-3.5" />
              </p>
            </div>
          </div>
          <AuthButton />
        </header>
        <main className="space-y-6">{children}</main>
        <footer className="text-center text-sm text-gray-600 pt-8 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></span>
            <img 
              src="/lovable-uploads/72cd2286-ac0e-4d70-a2ad-c43412ffe8e7.png" 
              alt="Oceano Azul Logo" 
              className="h-5 w-auto opacity-70"
            />
            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></span>
          </div>
          © {new Date().getFullYear()} Insights Oceano Azul - Diagnóstico de Funil
        </footer>
      </div>
    </div>
  );
};
