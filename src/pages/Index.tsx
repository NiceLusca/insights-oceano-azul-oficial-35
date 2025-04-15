
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateMetrics } from "@/utils/metricsHelpers";
import { MainLayout } from "@/components/MainLayout";
import { IdealMetricsCard } from "@/components/IdealMetricsCard";
import { FormContainer } from "@/components/FormContainer";
import { ResultContainer } from "@/components/ResultContainer";
import { QuoteCard } from "@/components/QuoteCard";
import { formSchema, defaultFormValues } from "@/schemas/formSchema";

const Index = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const [diagnostics, setDiagnostics] = useState({
    totalRevenue: 0,
    salesPageConversion: 0,
    checkoutConversion: 0,
    finalConversion: 0,
    messages: [],
  });

  const onSubmit = (values: any) => {
    const metrics = calculateMetrics(values);
    setDiagnostics(metrics);
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).every((v) => v !== undefined)) {
        const metrics = calculateMetrics(value as any);
        setDiagnostics(metrics);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const hasUpsell = form.watch("hasUpsell");

  return (
    <MainLayout>
      <IdealMetricsCard hasUpsell={hasUpsell} />
      <FormContainer form={form} onSubmit={onSubmit} formSchema={formSchema} />
      <ResultContainer formData={form.getValues()} diagnostics={diagnostics} />
      <QuoteCard />
    </MainLayout>
  );
};

export default Index;
