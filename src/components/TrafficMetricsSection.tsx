
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
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UseFormReturn } from "react-hook-form";

interface TrafficMetricsSectionProps {
  form: UseFormReturn<any>;
}

export const TrafficMetricsSection = ({ form }: TrafficMetricsSectionProps) => {
  return (
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
  );
};
