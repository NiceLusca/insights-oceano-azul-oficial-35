
import { ReactNode } from "react";
import { AuthButton } from "./AuthButton";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-3">
            <img 
              src="/lovable-uploads/72cd2286-ac0e-4d70-a2ad-c43412ffe8e7.png" 
              alt="Oceano Azul Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
              Funil Diagnóstico
            </h1>
            <p className="text-[#0EA5E9] font-medium">Oceano Azul</p>
          </div>
        </div>
        <AuthButton />
      </header>
      <main className="space-y-6">{children}</main>
      <footer className="text-center text-sm text-gray-600 pt-8">
        © {new Date().getFullYear()} Funil Diagnóstico - Oceano Azul
      </footer>
    </div>
  );
};
