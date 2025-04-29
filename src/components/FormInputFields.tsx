
import { UseFormReturn } from "react-hook-form";
import { PriceSection } from "@/components/PriceSection";
import { SalesSection } from "@/components/SalesSection";
import { TrafficMetricsSection } from "@/components/TrafficMetricsSection";
import { GoalsInvestmentsSection } from "@/components/GoalsInvestmentsSection";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { FormValues } from "@/schemas/formSchema";

interface FormInputFieldsProps {
  form: UseFormReturn<any>;
  formSchema: any;
}

export function FormInputFields({ form, formSchema }: FormInputFieldsProps) {
  const [hasUpsell, setHasUpsell] = useState<boolean>(form.getValues().hasUpsell || false);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PriceSection form={form} formSchema={formSchema} hasUpsell={hasUpsell} />
          <SalesSection form={form} hasUpsell={hasUpsell} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrafficMetricsSection form={form} />
          <GoalsInvestmentsSection form={form} />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <FormField
            control={form.control}
            name="hasUpsell"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg p-3">
                <div className="space-y-0.5">
                  <FormLabel className="dark:text-gray-200">Incluir Upsell</FormLabel>
                  <FormDescription className="dark:text-gray-400">
                    Ative se seu funil possui upsell/downsell
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setHasUpsell(checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
}
