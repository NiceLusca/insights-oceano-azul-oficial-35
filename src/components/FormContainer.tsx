
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GoalsInvestmentsSection */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Metas e Investimentos</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta de Faturamento Mensal (R$)
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Digite sua meta de faturamento"
                      {...form.register("monthlyRevenue", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Investimento em Anúncios (R$)
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Valor investido"
                      {...form.register("adSpend", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total de Cliques
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Número de cliques"
                      {...form.register("totalClicks", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ROI Desejado (multiplicador)
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      step="0.1"
                      placeholder="Ex: 1.5 para ROI de 1.5x"
                      {...form.register("targetROI", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
              
              {/* TrafficMetricsSection */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Métricas de Tráfego</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Visitantes na Página de Vendas
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Número de visitantes"
                      {...form.register("salesPageVisits", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Visitantes no Checkout
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Número de visitantes"
                      {...form.register("checkoutVisits", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* PriceSection */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Preços</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço do Produto Principal (R$)
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder="Preço unitário"
                    {...form.register("mainProductPrice", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço do Combo (R$)
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder="Preço do combo"
                    {...form.register("comboPrice", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço do Order Bump (R$)
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder="Preço do order bump"
                    {...form.register("orderBumpPrice", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
            
            {/* SalesSection */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Vendas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendas do Produto Principal
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder="Quantidade vendida"
                    {...form.register("mainProductSales", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendas do Combo
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder="Quantidade vendida"
                    {...form.register("comboSales", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vendas com Order Bump
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder="Quantidade vendida"
                    {...form.register("orderBumpSales", { valueAsNumber: true })}
                  />
                </div>
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  id="hasUpsell"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  {...form.register("hasUpsell")}
                />
                <label htmlFor="hasUpsell" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Meu funil possui Upsell
                </label>
              </div>
              
              {form.watch("hasUpsell") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preço do Upsell (R$)
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Preço do upsell"
                      {...form.register("upsellPrice", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Vendas com Upsell
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      type="number"
                      placeholder="Quantidade vendida"
                      {...form.register("upsellSales", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
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
