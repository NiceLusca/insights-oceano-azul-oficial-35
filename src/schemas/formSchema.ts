
import * as z from "zod";

export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>;

export const defaultFormValues: FormValues = {
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
};
