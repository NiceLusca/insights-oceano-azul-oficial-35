
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
import { UseFormReturn } from "react-hook-form";
import { handlePriceChange } from "@/utils/formatters";

interface GoalsInvestmentsSectionProps {
  form: UseFormReturn<any>;
}

export const GoalsInvestmentsSection = ({ form }: GoalsInvestmentsSectionProps) => {
  return (
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
                  type="text"
                  className="text-right"
                  placeholder="R$ 0,00"
                  value={field.value === 0 ? '' : `R$ ${field.value.toString().replace('.', ',')}`}
                  onChange={(e) => handlePriceChange(e, field.onChange)}
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
                  type="text"
                  className="text-right"
                  placeholder="R$ 0,00"
                  value={field.value === 0 ? '' : `R$ ${field.value.toString().replace('.', ',')}`}
                  onChange={(e) => handlePriceChange(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};
