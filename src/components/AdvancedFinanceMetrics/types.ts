
import { Json } from "@/integrations/supabase/types";

export interface AdvancedFinanceMetricsProps {
  formData: any;
  diagnostics: any;
}

export interface HistoricalMetrics {
  revenue: number;
  profit: number;
  roi: number;
  cac: number;
  ltv: number;
  averageOrderValue: number;
}

// Define interfaces for working with Json data from Supabase
export interface HistoricalFormData {
  startDate?: string;
  endDate?: string;
  adSpend?: number;
  mainProductSales?: number;
  comboSales?: number;
  mainProductPrice?: number;
  hasUpsell?: boolean;
  upsellSales?: number;
  upsellPrice?: number;
  [key: string]: any;
}

export interface HistoricalDiagnostics {
  totalRevenue?: number;
  currentROI?: number;
  [key: string]: any;
}

export interface RevenueBreakdownItem {
  name: string;
  value: number;
  percentage: number;
}
