
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

const idealMetrics = {
  salesPageConversion: 0.4,
  checkoutConversion: 0.4,
  comboRate: 0.35,
  orderBumpRate: 0.3,
  upsellRate: 0.05,
};

const formSchema = z.object({
  totalClicks: z.number().min(0),
  salesPageVisits: z.number().min(0),
  checkoutVisits: z.number().min(0),
  mainProductSales: z.number().min(0),
  comboSales: z.number().min(0),
  orderBumpSales: z.number().min(0),
  upsellSales: z.number().min(0),
  mainProductPrice: z.number().min(0),
  comboPrice: z.number().min(0),
  orderBumpPrice: z.number().min(0),
  upsellPrice: z.number().min(0),
  targetROI: z.number().min(1),
  monthlyRevenue: z.number().min(0).optional(),
  adSpend: z.number().min(0).optional(),
  hasUpsell: z.boolean().default(false),
});

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const formatPercentage = (value: number) => {
  return `${(value * 100).toFixed(1)}%`;
};

const Index = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalClicks: 0,
      salesPageVisits: 0,
      checkoutVisits: 0,
      mainProductSales: 0,
      comboSales: 0,
      orderBumpSales: 0,
      upsellSales: 0,
      mainProductPrice: 0,
      comboPrice: 0,
      orderBumpPrice: 0,
      upsellPrice: 0,
      targetROI: 1.5,
      monthlyRevenue: 0,
      adSpend: 0,
      hasUpsell: false,
    },
  });

  const [diagnostics, setDiagnostics] = useState<{
    totalRevenue: number;
    currentROI?: number;
    maxCPC?: number;
    salesPageConversion: number;
    checkoutConversion: number;
    finalConversion: number;
    monthlyGoalProgress?: number;
    adSpend?: number;
    messages: Array<{ type: "success" | "warning" | "error"; message: string }>;
  }>({
    totalRevenue: 0,
    salesPageConversion: 0,
    checkoutConversion: 0,
    finalConversion: 0,
    messages: [],
  });

  const calculateMetrics = (values: z.infer<typeof formSchema>) => {
    const messages = [];
    
    const salesPageConversion = values.salesPageVisits > 0 ? (values.checkoutVisits / values.salesPageVisits) * 100 : 0;
    const checkoutConversion = values.checkoutVisits > 0 ? ((values.mainProductSales + values.comboSales) / values.checkoutVisits) * 100 : 0;
    
    // Correto cálculo da taxa de combo: vendas de combo dividido pelo total de vendas (principal + combo)
    const totalSales = values.mainProductSales + values.comboSales;
    const comboRate = totalSales > 0 ? (values.comboSales / totalSales) * 100 : 0;
    
    const orderBumpRate = totalSales > 0 ? (values.orderBumpSales / totalSales) * 100 : 0;
    const upsellRate = totalSales > 0 ? (values.upsellSales / totalSales) * 100 : 0;
    const finalConversion = values.totalClicks > 0 ? ((values.mainProductSales + values.comboSales) / values.totalClicks) * 100 : 0;

    // Cálculo da receita total (considerando upsell apenas se habilitado)
    const totalRevenue = 
      values.mainProductSales * values.mainProductPrice +
      values.comboSales * values.comboPrice +
      values.orderBumpSales * values.orderBumpPrice +
      (values.hasUpsell ? values.upsellSales * values.upsellPrice : 0);

    const monthlyGoalProgress = values.monthlyRevenue ? totalRevenue / values.monthlyRevenue : undefined;

    if (salesPageConversion < idealMetrics.salesPageConversion * 100) {
      messages.push({
        type: "error",
        message: "❌ Sua taxa de conversão da página de vendas está abaixo do ideal (40%). Revise sua página de vendas."
      });
    } else {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de conversão da página de vendas está ótima!"
      });
    }

    if (checkoutConversion < idealMetrics.checkoutConversion * 100) {
      messages.push({
        type: "error",
        message: "❌ Sua taxa de conversão do checkout está abaixo do ideal (40%). Revise seu processo de checkout."
      });
    } else {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de conversão do checkout está excelente!"
      });
    }

    if (comboRate < idealMetrics.comboRate * 100) {
      messages.push({
        type: "warning",
        message: "⚠️ Sua taxa de combo está abaixo do ideal (35%). Considere revisar sua oferta de combo."
      });
    } else {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de combo está dentro ou acima do ideal. Parabéns!"
      });
    }

    if (values.hasUpsell && upsellRate < idealMetrics.upsellRate * 100) {
      messages.push({
        type: "warning",
        message: "⚠️ Sua taxa de upsell está abaixo do ideal (5%). Considere melhorar sua estratégia de upsell."
      });
    } else if (values.hasUpsell) {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de upsell está dentro ou acima do ideal!"
      });
    }

    let currentROI, maxCPC;
    if (values.adSpend && values.adSpend > 0) {
      currentROI = totalRevenue / values.adSpend;
      maxCPC = (totalRevenue / values.targetROI) / values.totalClicks;
    }

    setDiagnostics({
      totalRevenue,
      currentROI,
      maxCPC,
      salesPageConversion,
      checkoutConversion,
      finalConversion,
      monthlyGoalProgress,
      adSpend: values.adSpend,
      messages
    });
  };

  const getComparisonData = (values: z.infer<typeof formSchema>) => {
    const salesPageConversion = values.salesPageVisits > 0 ? (values.checkoutVisits / values.salesPageVisits) * 100 : 0;
    const checkoutConversion = values.checkoutVisits > 0 ? ((values.mainProductSales + values.comboSales) / values.checkoutVisits) * 100 : 0;
    
    // Correto cálculo da taxa de combo
    const totalSales = values.mainProductSales + values.comboSales;
    const comboRate = totalSales > 0 ? (values.comboSales / totalSales) * 100 : 0;
    
    const upsellRate = totalSales > 0 ? (values.upsellSales / totalSales) * 100 : 0;

    const data = [
      {
        name: "Página de Vendas",
        actual: Number(salesPageConversion.toFixed(1)),
        ideal: idealMetrics.salesPageConversion * 100,
      },
      {
        name: "Checkout",
        actual: Number(checkoutConversion.toFixed(1)),
        ideal: idealMetrics.checkoutConversion * 100,
      },
      {
        name: "Taxa Combo",
        actual: Number(comboRate.toFixed(1)),
        ideal: idealMetrics.comboRate * 100,
      },
    ];
    
    // Adiciona upsell apenas se habilitado
    if (values.hasUpsell) {
      data.push({
        name: "Taxa Upsell",
        actual: Number(upsellRate.toFixed(1)),
        ideal: idealMetrics.upsellRate * 100,
      });
    }
    
    return data;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    calculateMetrics(values);
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).every((v) => v !== undefined)) {
        calculateMetrics(value as z.infer<typeof formSchema>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const hasUpsell = form.watch("hasUpsell");

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

        <Card className="p-6 bg-blue-50/50">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            🔵 Métricas Ideais
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-600">Conversão da Página de Vendas</p>
              <p className="font-semibold">40%</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Conversão do Checkout</p>
              <p className="font-semibold">40%</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Taxa de Combo</p>
              <p className="font-semibold">35%</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Taxa de Order Bump</p>
              <p className="font-semibold">30%</p>
            </div>
            {hasUpsell && (
              <div>
                <p className="text-sm text-blue-600">Taxa de Upsell</p>
                <p className="font-semibold">5%</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">✍️ Seus Números</h2>
          <Form {...form}>
            <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Opção de Upsell */}
              <div className="flex items-center space-x-2 my-4">
                <FormField
                  control={form.control}
                  name="hasUpsell"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          id="hasUpsell"
                        />
                      </FormControl>
                      <FormLabel htmlFor="hasUpsell" className="cursor-pointer font-medium">
                        Você tem Upsell?
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Preços primeiro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 shadow-sm">
                  <h3 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
                    Preços
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Para Upsell, use a média entre Upsell e Downsell.<br/>Ex: Upsell R$97 + Downsell R$67 = R$82 (média)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mainProductPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produto Principal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              placeholder="R$ 0,00"
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comboPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Combo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              placeholder="R$ 0,00"
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="orderBumpPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Bump</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              placeholder="R$ 0,00"
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {hasUpsell && (
                      <FormField
                        control={form.control}
                        name="upsellPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upsell (média)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                                placeholder="R$ 0,00"
                                className="text-right"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </Card>

                <Card className="p-4 shadow-sm">
                  <h3 className="font-medium text-blue-700 mb-3">Objetivos e Investimentos</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="targetROI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ROI Desejado</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta de Faturamento Mensal</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              placeholder="R$ 0,00"
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adSpend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gasto em Anúncios</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                              placeholder="R$ 0,00"
                              className="text-right"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 shadow-sm">
                  <h3 className="font-medium text-blue-700 flex items-center gap-2 mb-3">
                    Métricas de Tráfego
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Métricas para análise do seu funil de vendas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="totalClicks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total de Cliques</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salesPageVisits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visitas na Página de Vendas</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="checkoutVisits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visitas no Checkout</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                <Card className="p-4 shadow-sm">
                  <h3 className="font-medium text-blue-700 mb-3">Vendas (unidades)</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="mainProductSales"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Produto Principal</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="comboSales"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Combo</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="orderBumpSales"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Bump</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {hasUpsell && (
                      <FormField
                        control={form.control}
                        name="upsellSales"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upsell</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </Card>
              </div>
            </form>
          </Form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Diagnóstico</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-blue-600">Faturamento Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(diagnostics.totalRevenue)}
                </p>
              </div>

              {diagnostics.monthlyGoalProgress !== undefined && (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-blue-600">Progresso da Meta Mensal</p>
                  <p className="text-2xl font-bold">
                    {formatPercentage(diagnostics.monthlyGoalProgress)}
                  </p>
                </div>
              )}

              {diagnostics.maxCPC && (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    CPC Máximo Recomendado
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Valor máximo que você pode pagar por clique mantendo seu ROI desejado</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(diagnostics.maxCPC)}
                  </p>
                </div>
              )}

              {diagnostics.currentROI && (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-blue-600">CPC Atual</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(form.getValues().totalClicks > 0 && diagnostics.adSpend ? diagnostics.adSpend / form.getValues().totalClicks : 0)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {diagnostics.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    msg.type === "success"
                      ? "bg-green-50 text-green-700"
                      : msg.type === "warning"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
          </Card>

          <ComparisonChart actualData={getComparisonData(form.getValues())} />
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <p className="text-xl text-center font-medium">
            "Você agora tem clareza de onde ajustar. Otimização constante é o caminho do Oceano Azul. Continue testando, melhorando e crescendo!"
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
