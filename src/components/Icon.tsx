
import { LucideProps } from "lucide-react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Search, 
  Settings, 
  Scale, 
  Maximize, 
  Minimize, 
  Folder, 
  FolderOpen,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ChartLine,
  ChartPie
} from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const icons: Record<string, any> = {
    "arrow-down": ArrowDown,
    "arrow-up": ArrowUp,
    "arrow-left": ArrowLeft,
    "arrow-right": ArrowRight,
    "trending-up": TrendingUp,
    "trending-down": TrendingDown,
    "chart-bar": BarChart3,
    "chart-line": ChartLine,
    "chart-pie": ChartPie,
    "check": Check,
    "x": X,
    "plus": Plus,
    "minus": Minus,
    "search": Search,
    "settings": Settings,
    "scale": Scale,
    "maximize": Maximize,
    "minimize": Minimize,
    "folder": Folder,
    "folder-open": FolderOpen
  };

  const LucideIcon = icons[name] || BarChart3;
  return <LucideIcon {...props} />;
}
