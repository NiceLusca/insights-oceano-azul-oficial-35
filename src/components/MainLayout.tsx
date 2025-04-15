
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-32 mx-auto">
            <AspectRatio ratio={1}>
              <img
                src="/lovable-uploads/2da50e89-1402-421c-8c73-60efe5119215.png"
                alt="Oceano Azul Logo"
                className="w-full h-full object-contain"
              />
            </AspectRatio>
          </div>
          <h1 className="text-3xl font-bold text-blue-900">
            Diagnóstico de Funil de Vendas
          </h1>
          <p className="text-blue-600">Oceano Azul</p>
        </div>
        {children}
      </div>
    </div>
  );
};
