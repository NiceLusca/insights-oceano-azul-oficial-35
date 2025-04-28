
import { useMemo } from "react";
import { RevenueBreakdownItem } from "./types";

export const useFinanceCalculations = (formData: any, diagnostics: any) => {
  return useMemo(() => {
    // Basic financial metrics
    const totalRevenue = diagnostics?.totalRevenue || 0;
    const adSpend = formData?.adSpend || 0;
    const profit = totalRevenue - adSpend;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
    
    // Marketing efficiency metrics
    const totalSales = (formData?.mainProductSales || 0) + (formData?.comboSales || 0);
    const aov = totalSales > 0 ? totalRevenue / totalSales : 0; // Average Order Value
    
    // Customer Acquisition Cost
    const cac = totalSales > 0 ? adSpend / totalSales : 0;
    
    // Fix for LTV calculation - ensure it's always at least 100 or 1.5x AOV, whichever is greater
    const ltv = aov > 0 ? Math.max(aov * 1.5, 100) : 100;
    
    // LTV:CAC ratio
    const ltvToCAC = cac > 0 ? ltv / cac : 0;
    
    // Revenue breakdown by product type
    const mainProductRevenue = (formData?.mainProductSales || 0) * (formData?.mainProductPrice || 0);
    const comboRevenue = (formData?.comboSales || 0) * (formData?.comboPrice || 0);
    const orderBumpRevenue = (formData?.orderBumpSales || 0) * (formData?.orderBumpPrice || 0);
    const upsellRevenue = formData?.hasUpsell ? (formData?.upsellSales || 0) * (formData?.upsellPrice || 0) : 0;
    
    // Revenue breakdown as array of items
    const revenueBreakdown: RevenueBreakdownItem[] = [
      { name: "Produto Principal", value: mainProductRevenue, percentage: totalRevenue > 0 ? (mainProductRevenue / totalRevenue) * 100 : 0 },
      { name: "Combo", value: comboRevenue, percentage: totalRevenue > 0 ? (comboRevenue / totalRevenue) * 100 : 0 },
      { name: "Order Bump", value: orderBumpRevenue, percentage: totalRevenue > 0 ? (orderBumpRevenue / totalRevenue) * 100 : 0 }
    ];
    
    // Add upsell if it exists
    if (formData?.hasUpsell && upsellRevenue > 0) {
      revenueBreakdown.push({
        name: "Upsell",
        value: upsellRevenue,
        percentage: totalRevenue > 0 ? (upsellRevenue / totalRevenue) * 100 : 0
      });
    }
    
    // Projections and targets
    const monthlyProjection = totalRevenue * 30;
    const monthlyTarget = formData?.monthlyRevenue || 0;
    const targetProgress = monthlyTarget > 0 ? (monthlyProjection / monthlyTarget) * 100 : 0;
    
    return {
      // Basic metrics
      totalRevenue,
      adSpend,
      profit,
      profitMargin,
      
      // Sales metrics
      totalSales,
      aov,
      
      // Marketing metrics
      cac,
      ltv,
      ltvToCAC,
      
      // Revenue breakdown
      revenueBreakdown,
      orderBumpRevenue,
      upsellRevenue,
      
      // Projections
      monthlyProjection,
      monthlyTarget,
      targetProgress,
      
      // Raw data
      currentROI: diagnostics?.currentROI || 0
    };
  }, [formData, diagnostics]);
};

// Helper functions for status indicators
export const getROIStatus = (roi: number) => {
  if (roi >= 1.5) return "success";
  if (roi >= 1) return "secondary";
  return "destructive";
};

export const getLtvCacStatus = (ratio: number) => {
  if (ratio >= 3) return "success";
  if (ratio >= 1.5) return "secondary";
  return "destructive";
};

export const getPercentageChange = (current: number, historical: number) => {
  if (!historical) return 0;
  return ((current - historical) / historical) * 100;
};
