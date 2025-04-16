
import { AuthButton } from "@/components/AuthButton";
import { MainLayoutProps } from "@/types/MainLayoutProps";
import { ThemeToggle } from "@/components/ThemeToggle";

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-12 h-12 oceano-azul-logo"></div>
            <div className="flex flex-col ml-3">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Insights Oceano Azul
              </h1>
              <p className="text-sm text-blue-400 dark:text-blue-300">
                Análises de Funil
              </p>
            </div>
          </div>
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
      
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-6 h-6 oceano-azul-logo"></div>
          <p>© {new Date().getFullYear()} Oceano Azul - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};
