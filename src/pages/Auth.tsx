
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
    <MainLayout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/lovable-uploads/7d27fa6e-d0b6-4bbe-ab3a-cee5c3cca10f.png" 
              alt="Oceano Azul Logo" 
              className="h-20 w-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-center text-blue-800 dark:text-blue-400">
              {isSignUp ? "Criar Conta" : "Entrar"}
            </h2>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="focus:border-blue-500"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
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
              className="p-0 text-blue-600"
              disabled={loading}
            >
              {isSignUp ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Auth;
