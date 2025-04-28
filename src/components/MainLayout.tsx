
import { ReactNode } from "react";
import { AuthButton } from "./AuthButton";
import { SidebarProvider, SidebarTrigger, SidebarRail, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarRail />
        <SidebarInset className="bg-gradient-to-br from-blue-50/30 to-white">
          <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
            <header className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
              <div className="flex-1"></div>
              <SidebarTrigger className="md:hidden mr-3" />
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
