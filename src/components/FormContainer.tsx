
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormInputFields } from "@/components/FormInputFields";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface FormContainerProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  formSchema: any;
  onAnalyze: () => void;
}

export function FormContainer({ form, onSubmit, formSchema, onAnalyze }: FormContainerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    toast({
      title: "Analisando dados",
      description: "Processando informações do funil...",
    });
    
    // Simulate loading for better UX feedback
    setTimeout(() => {
      onAnalyze();
      setIsAnalyzing(false);
      
      toast({
        title: "Análise concluída",
        description: "Resultados processados com sucesso!",
      });
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormInputFields form={form} formSchema={formSchema} />
          
          <motion.div
            className="flex justify-end"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium py-2 px-8 shadow-md"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analisando...
                </>
              ) : (
                "Gerar Análise"
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
