
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Menu, BarChart3, CircleDollarSign, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const MainNavigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const routes = [
    {
      title: "Início",
      path: "/",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />
    },
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="h-5 w-5 mr-2" />
    },
    {
      title: "Análise",
      path: "/analise",
      icon: <FileText className="h-5 w-5 mr-2" />
    },
    {
      title: "Finanças",
      path: "/financas",
      icon: <CircleDollarSign className="h-5 w-5 mr-2" />
    },
    {
      title: "Histórico",
      path: "/history",
      icon: <History className="h-5 w-5 mr-2" />
    }
  ];
  
  const NavItem = ({ route, mobile = false }: { route: typeof routes[0], mobile?: boolean }) => {
    const isActive = location.pathname === route.path;
    
    return (
      <Link 
        to={route.path} 
        className={cn(
          mobile ? "flex items-center py-3 px-4 text-base font-medium hover:bg-blue-50 dark:hover:bg-blue-800/50 rounded-md" : "",
          isActive 
            ? "text-blue-700 dark:text-blue-300 font-medium" 
            : "text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300"
        )}
        onClick={() => mobile && setIsOpen(false)}
      >
        {route.icon}
        {route.title}
      </Link>
    );
  };
  
  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 relative border-2 border-blue-300 dark:border-blue-600 shadow-sm dark:bg-blue-800 dark:hover:bg-blue-700">
              <Menu className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] bg-white dark:bg-gray-900 dark:border-r dark:border-blue-800">
            <div className="py-4">
              <img 
                src="/lovable-uploads/72cd2286-ac0e-4d70-a2ad-c43412ffe8e7.png" 
                alt="Oceano Azul Logo" 
                className="h-10 w-auto mb-6"
              />
              <nav className="flex flex-col gap-2 mt-6">
                {routes.map((route) => (
                  <NavItem key={route.path} route={route} mobile={true} />
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 border border-gray-200 dark:border-blue-700">
        <NavigationMenuList className="space-x-1">
          {routes.map((route) => (
            <NavigationMenuItem key={route.path}>
              <Link to={route.path}>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center py-2 px-4 text-base",
                    location.pathname === route.path 
                      ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 font-medium" 
                      : "hover:bg-blue-50 dark:hover:bg-blue-900"
                  )}
                >
                  {route.icon}
                  {route.title}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
