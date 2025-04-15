
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
import { handlePriceChange, formatPriceDisplay } from "@/utils/formatters";
import { FormValues } from "@/schemas/formSchema";

interface PriceSectionProps {
  form: UseFormReturn<any>;
  formSchema: FormValues;
  hasUpsell: boolean;
}

export const PriceSection = ({ form, formSchema, hasUpsell }: PriceSectionProps) => {
  return (
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
                  type="text"
                  className="text-right"
                  placeholder="R$ 0,00"
                  value={formatPriceDisplay(field.value)}
                  onChange={(e) => handlePriceChange(e, field.onChange)}
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
                  type="text"
                  className="text-right"
                  placeholder="R$ 0,00"
                  value={formatPriceDisplay(field.value)}
                  onChange={(e) => handlePriceChange(e, field.onChange)}
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
                  type="text"
                  className="text-right"
                  placeholder="R$ 0,00"
                  value={formatPriceDisplay(field.value)}
                  onChange={(e) => handlePriceChange(e, field.onChange)}
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
                    type="text"
                    className="text-right"
                    placeholder="R$ 0,00"
                    value={formatPriceDisplay(field.value)}
                    onChange={(e) => handlePriceChange(e, field.onChange)}
                  />
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
