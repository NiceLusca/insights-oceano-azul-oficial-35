
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9 opacity-50">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 bg-white dark:bg-gray-800 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-blue-500 dark:text-blue-300"
    >
      <Sun className={`h-5 w-5 text-yellow-500 rotate-0 scale-100 transition-all ${theme === "dark" ? "hidden" : "block"}`} />
      <Moon className={`h-5 w-5 text-blue-500 rotate-90 scale-0 transition-all ${theme === "dark" ? "block rotate-0 scale-100" : "hidden"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
