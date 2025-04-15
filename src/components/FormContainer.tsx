
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { PriceSection } from "@/components/PriceSection";
import { GoalsInvestmentsSection } from "@/components/GoalsInvestmentsSection";
import { TrafficMetricsSection } from "@/components/TrafficMetricsSection";
import { SalesSection } from "@/components/SalesSection";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";

interface FormContainerProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  formSchema: z.ZodObject<any>;
}

export const FormContainer = ({ form, onSubmit, formSchema }: FormContainerProps) => {
  const hasUpsell = form.watch("hasUpsell");

  return (
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
  );
};
