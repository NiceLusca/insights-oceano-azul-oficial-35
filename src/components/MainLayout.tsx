
import { AuthButton } from "@/components/AuthButton";
import { MainLayoutProps } from "@/types/MainLayoutProps";
import { ThemeToggle } from "@/components/ThemeToggle";

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/7d27fa6e-d0b6-4bbe-ab3a-cee5c3cca10f.png" 
            alt="Oceano Azul Logo" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Insights Oceano Azul - Análises de Funil
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <AuthButton />
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl">
        <div className="space-y-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Oceano Azul - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};
