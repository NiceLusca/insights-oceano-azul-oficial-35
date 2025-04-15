
import { ReactNode } from "react";
import { AuthButton } from "./AuthButton";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">
          Funil Diagnóstico
        </h1>
        <AuthButton />
      </header>
      <main className="space-y-6">{children}</main>
      <footer className="text-center text-sm text-gray-600 pt-8">
        © {new Date().getFullYear()} Funil Diagnóstico - Oceano Azul
      </footer>
    </div>
  );
};
