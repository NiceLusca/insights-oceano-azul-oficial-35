
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Checkbox } from "@/components/ui/checkbox";
import { DiagnosticSection } from "@/components/DiagnosticSection";
import { PriceSection } from "@/components/PriceSection";
import { GoalsInvestmentsSection } from "@/components/GoalsInvestmentsSection";
import { TrafficMetricsSection } from "@/components/TrafficMetricsSection";
import { SalesSection } from "@/components/SalesSection";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { PdfExportButton } from "@/components/PdfExportButton";
import { calculateMetrics, getComparisonData, idealMetrics } from "@/utils/metricsHelpers";

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
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

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
      startDate: undefined,
      endDate: undefined,
    },
  });

  const [diagnostics, setDiagnostics] = useState({
    totalRevenue: 0,
    salesPageConversion: 0,
    checkoutConversion: 0,
    finalConversion: 0,
    messages: [],
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const metrics = calculateMetrics(values);
    setDiagnostics(metrics);
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).every((v) => v !== undefined)) {
        const metrics = calculateMetrics(value as z.infer<typeof formSchema>);
        setDiagnostics(metrics);
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
              
              <DateRangeSelector form={form} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PriceSection form={form} formSchema={formSchema} hasUpsell={hasUpsell} />
                <GoalsInvestmentsSection form={form} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrafficMetricsSection form={form} />
                <SalesSection form={form} hasUpsell={hasUpsell} />
              </div>
            </form>
          </Form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DiagnosticSection diagnostics={diagnostics} />
          <ComparisonChart actualData={getComparisonData(form.getValues())} />
        </div>

        <Card className="p-6">
          <PdfExportButton 
            formData={form.getValues()} 
            diagnostics={diagnostics} 
            comparisonData={getComparisonData(form.getValues())}
          />
        </Card>

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
