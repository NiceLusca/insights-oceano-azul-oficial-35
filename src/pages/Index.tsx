
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

const idealMetrics = {
  salesPageConversion: 0.4,
  checkoutConversion: 0.4,
  comboRate: 0.25,
  orderBumpRate: 0.3,
  upsellRate: 0.1,
};

const formSchema = z.object({
  // Sales numbers
  mainProductSales: z.number().min(0),
  comboSales: z.number().min(0),
  orderBumpSales: z.number().min(0),
  upsellSales: z.number().min(0),
  
  // Prices
  mainProductPrice: z.number().min(0),
  comboPrice: z.number().min(0),
  orderBumpPrice: z.number().min(0),
  upsellPrice: z.number().min(0),
  
  // Goals
  targetROI: z.number().min(1),
  monthlyRevenue: z.number().optional(),
  adSpend: z.number().optional(),
});

const Index = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainProductSales: 0,
      comboSales: 0,
      orderBumpSales: 0,
      upsellSales: 0,
      mainProductPrice: 0,
      comboPrice: 0,
      orderBumpPrice: 0,
      upsellPrice: 0,
      targetROI: 1.5,
    },
  });

  const [diagnostics, setDiagnostics] = useState<{
    totalRevenue: number;
    currentROI?: number;
    maxCPC?: number;
    messages: Array<{ type: "success" | "warning" | "error"; message: string }>;
  }>({
    totalRevenue: 0,
    messages: [],
  });

  const calculateMetrics = (values: z.infer<typeof formSchema>) => {
    const totalSales = values.mainProductSales + values.comboSales;
    const messages = [];
    
    // Calculate actual rates
    const comboRate = totalSales > 0 ? values.comboSales / totalSales : 0;
    const orderBumpRate = totalSales > 0 ? values.orderBumpSales / totalSales : 0;
    const upsellRate = totalSales > 0 ? values.upsellSales / totalSales : 0;

    // Calculate total revenue
    const totalRevenue = 
      values.mainProductSales * values.mainProductPrice +
      values.comboSales * values.comboPrice +
      values.orderBumpSales * values.orderBumpPrice +
      values.upsellSales * values.upsellPrice;

    // Compare rates with ideal metrics
    if (comboRate < idealMetrics.comboRate) {
      messages.push({
        type: "error",
        message: "❌ Sua taxa de combo está abaixo do ideal (25%). Considere revisar sua oferta ou copy de venda."
      });
    } else {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de combo está dentro ou acima do ideal. Excelente!"
      });
    }

    if (orderBumpRate < idealMetrics.orderBumpRate) {
      messages.push({
        type: "warning",
        message: "⚠️ Sua taxa de Order Bump está abaixo do ideal (30%). Teste diferentes ofertas complementares."
      });
    } else {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de Order Bump está ótima! Continue com o bom trabalho."
      });
    }

    if (upsellRate < idealMetrics.upsellRate) {
      messages.push({
        type: "error",
        message: "❌ Sua taxa de Upsell está abaixo do ideal (10%). Revise sua estratégia de vendas incrementais."
      });
    } else {
      messages.push({
        type: "success",
        message: "✅ Sua taxa de Upsell está dentro ou acima do ideal. Parabéns!"
      });
    }

    // Calculate ROI and max CPC if ad spend is provided
    let currentROI, maxCPC;
    if (values.adSpend && values.adSpend > 0) {
      currentROI = totalRevenue / values.adSpend;
      // Assuming 1000 clicks per campaign for CPC calculation
      maxCPC = (totalRevenue / values.targetROI) / 1000;
    }

    setDiagnostics({
      totalRevenue,
      currentROI,
      maxCPC,
      messages
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    calculateMetrics(values);
  };

  // Watch form values for real-time updates
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).every((v) => v !== undefined)) {
        calculateMetrics(value as z.infer<typeof formSchema>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-blue-900 text-center">
          Diagnóstico de Funil de Vendas
        </h1>

        {/* Bloco 1 - Métricas Ideais */}
        <Card className="p-6 bg-blue-50/50">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">🔵 Métricas Ideais</h2>
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
              <p className="font-semibold">25%</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Taxa de Order Bump</p>
              <p className="font-semibold">30%</p>
            </div>
            <div>
              <p className="text-sm text-blue-600">Taxa de Upsell</p>
              <p className="font-semibold">10%</p>
            </div>
          </div>
        </Card>

        {/* Bloco 2 - Input do Usuário */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">✍️ Seus Números</h2>
          <Form {...form}>
            <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vendas */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-700">Vendas (unidades)</h3>
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
                </div>

                {/* Preços */}
                <div className="space-y-4">
                  <h3 className="font-medium text-blue-700">Preços (R$)</h3>
                  <FormField
                    control={form.control}
                    name="mainProductPrice"
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
                    name="comboPrice"
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
                    name="orderBumpPrice"
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
                  <FormField
                    control={form.control}
                    name="upsellPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upsell (média)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Objetivos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <FormField
                  control={form.control}
                  name="targetROI"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ROI Desejado</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                      <FormLabel>Meta de Faturamento Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                      <FormLabel>Gasto em Anúncios (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </Card>

        {/* Bloco 3 - Resultados */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">📊 Diagnóstico</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-blue-600">Faturamento Total</p>
              <p className="text-2xl font-bold">
                R$ {diagnostics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            {diagnostics.currentROI && (
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-blue-600">ROI Atual</p>
                <p className="text-2xl font-bold">
                  {diagnostics.currentROI.toFixed(2)}x
                </p>
              </div>
            )}
            {diagnostics.maxCPC && (
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm text-blue-600">CPC Máximo Recomendado</p>
                <p className="text-2xl font-bold">
                  R$ {diagnostics.maxCPC.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Mensagens de Diagnóstico */}
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

        {/* Bloco 4 - Mensagem Final */}
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
