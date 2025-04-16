
import { AuthButton } from "@/components/AuthButton";
import { MainLayoutProps } from "@/types/MainLayoutProps";
import { ThemeToggle } from "@/components/ThemeToggle";

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0b131f]">
      <header className="bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 dark:text-blue-400">
              <path d="M3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V18Z" fill="currentColor" />
              <path d="M6 13.5C6 12.8438 6.37967 12.253 6.9643 11.9663L16.9643 6.96634C17.6314 6.65301 18.4221 6.89568 18.8127 7.53442L18.9559 7.78318C19.318 8.37114 19.1038 9.12224 18.5299 9.50193L8.5299 16.5019C7.91093 16.9116 7.08901 16.6302 6.88586 15.9393L6.74302 15.4251C6.58362 14.9294 6.5 14.4152 6.5 13.8976L6 13.5Z" fill="currentColor" />
            </svg>
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Insights Oceano Azul - Análises de Funil
            </h1>
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
      
      <footer className="bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Oceano Azul - Todos os direitos reservados</p>
      </footer>
    </div>
  );
};
