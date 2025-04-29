
import { ReactNode } from "react";
import { AuthButton } from "./AuthButton";
import { SidebarProvider, SidebarTrigger, SidebarRail, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Calendar, NotebookPen } from "lucide-react";
import { Separator } from "./ui/separator";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarRail />
        <SidebarInset className="bg-gradient-to-br from-blue-50/30 to-white dark:from-gray-900/95 dark:to-gray-950">
          <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
            <header className="flex justify-between items-center bg-white dark:bg-gray-800/95 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <NotebookPen className="h-5 w-5" />
                  <span className="font-medium hidden sm:block">Diagnóstico de Funil</span>
                </div>
                <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block dark:bg-gray-700" />
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hidden sm:flex">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <AuthButton />
              </div>
            </header>
            <main className="space-y-6">{children}</main>
            <footer className="text-center text-sm text-gray-600 dark:text-gray-400 pt-8 pb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent"></span>
                <img 
                  src="/lovable-uploads/72cd2286-ac0e-4d70-a2ad-c43412ffe8e7.png" 
                  alt="Oceano Azul Logo" 
                  className="h-5 w-auto opacity-70 dark:opacity-50"
                />
                <span className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent"></span>
              </div>
              © {new Date().getFullYear()} Insights Oceano Azul - Diagnóstico de Funil
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
