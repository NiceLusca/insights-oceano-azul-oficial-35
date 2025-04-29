
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, History, CircleDollarSign, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Início",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      title: "Análise Detalhada",
      icon: FileText,
      path: "/analise",
    },
    {
      title: "Métricas Financeiras",
      icon: CircleDollarSign,
      path: "/financas",
    },
    {
      title: "Histórico",
      icon: History,
      path: "/history",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="bg-white dark:bg-gray-900 dark:border-r dark:border-blue-800/80">
        <div className="flex items-center gap-2 px-4 py-2">
          <img
            src="/lovable-uploads/72cd2286-ac0e-4d70-a2ad-c43412ffe8e7.png"
            alt="Oceano Azul Logo"
            className="h-8 w-auto"
          />
          <div>
            <h2 className="text-base font-bold text-blue-800 dark:text-blue-300">Insights Oceano Azul</h2>
            <p className="text-xs text-blue-500 dark:text-blue-400">Diagnóstico de Funil</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white dark:bg-gray-900 dark:border-r dark:border-blue-800/80">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={location.pathname === item.path}
                className="dark:text-gray-300 dark:hover:bg-blue-800/30 dark:data-[active=true]:bg-blue-800 dark:data-[active=true]:text-white dark:data-[active=true]:font-medium"
              >
                <Link to={item.path}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-white dark:bg-gray-900 dark:border-r dark:border-blue-800/80">
        <div className="p-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} Oceano Azul
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
