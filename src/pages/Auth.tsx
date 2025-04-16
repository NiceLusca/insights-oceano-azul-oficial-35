
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuthentication } from "@/hooks/useAuthentication";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp } = useAuthentication();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Informação incompleta",
        description: "Por favor, informe email e senha",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (isSignUp) {
        const result = await signUp(email, password);
        
        if (result.success) {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: result.message,
          });
          
          // Auto sign in after successful signup
          await signIn(email, password);
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await signIn(email, password);
        
        if (!result.success) {
          throw new Error(result.error);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no processo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0b131f]">
      <div className="flex justify-center items-center min-h-screen py-10">
        <Card className="w-full max-w-md p-8 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center mb-4">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V18Z" fill="currentColor" />
                <path d="M6 13.5C6 12.8438 6.37967 12.253 6.9643 11.9663L16.9643 6.96634C17.6314 6.65301 18.4221 6.89568 18.8127 7.53442L18.9559 7.78318C19.318 8.37114 19.1038 9.12224 18.5299 9.50193L8.5299 16.5019C7.91093 16.9116 7.08901 16.6302 6.88586 15.9393L6.74302 15.4251C6.58362 14.9294 6.5 14.4152 6.5 13.8976L6 13.5Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-blue-800 dark:text-blue-400">
              {isSignUp ? "Criar Conta" : "Entrar"}
            </h2>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </span>
              ) : (
                isSignUp ? "Cadastrar" : "Entrar"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="p-0 text-blue-600 dark:text-blue-400"
              disabled={loading}
            >
              {isSignUp ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
