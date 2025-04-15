
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

interface SalesSectionProps {
  form: UseFormReturn<any>;
  hasUpsell: boolean;
}

export const SalesSection = ({ form, hasUpsell }: SalesSectionProps) => {
  return (
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
  );
};
