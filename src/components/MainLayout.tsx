import { AuthButton } from "@/components/AuthButton";
import { MainLayoutProps } from "@/types/MainLayoutProps";
import { ThemeToggle } from "@/components/ThemeToggle";

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/placeholder.svg" 
            alt="Logo" 
            className="w-8 h-8 mr-2"
          />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Análise de Conversão
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
        <p>© {new Date().getFullYear()} Análise de Conversão - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};
