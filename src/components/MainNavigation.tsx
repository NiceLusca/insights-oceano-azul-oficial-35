
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Menu } from "lucide-react";
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
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />
    },
    {
      title: "Histórico",
      path: "/history",
      icon: <FileText className="h-4 w-4 mr-2" />
    }
  ];
  
  const NavItem = ({ route, mobile = false }: { route: typeof routes[0], mobile?: boolean }) => {
    const isActive = location.pathname === route.path;
    
    return (
      <Link 
        to={route.path} 
        className={cn(
          mobile ? "flex items-center py-3 px-4 text-sm font-medium hover:bg-blue-50 rounded-md" : "",
          isActive ? "text-blue-700 font-medium" : "text-gray-700 hover:text-blue-700"
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
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px]">
            <nav className="flex flex-col gap-2 mt-8">
              {routes.map((route) => (
                <NavItem key={route.path} route={route} mobile={true} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {routes.map((route) => (
            <NavigationMenuItem key={route.path}>
              <Link to={route.path}>
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center",
                    location.pathname === route.path ? "bg-blue-50 text-blue-700" : ""
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
