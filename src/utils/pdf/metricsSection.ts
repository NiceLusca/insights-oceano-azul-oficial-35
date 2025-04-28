
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../formatters";
import { COLORS, SPACING, PdfFormData, PdfDiagnostics } from "./types";

/**
 * Cria a seção de métricas principais
 */
export const createMetricsSection = (doc: jsPDF, formData: PdfFormData, diagnostics: PdfDiagnostics, startY: number): number => {
  // Título da seção
  doc.setFont("helvetica", "bold");
  doc.text("Métricas Principais", SPACING.marginX, startY);
  doc.setFont("helvetica", "normal");
  
  // Garantir que diagnostics seja um objeto válido
  const safeData = diagnostics || {};
  
  // Tratar valores nulos ou indefinidos
  const totalRevenue = safeData.totalRevenue || 0;
  const currentROI = safeData.currentROI || 0;
  const currentCPC = safeData.currentCPC || 0;
  const maxCPC = safeData.maxCPC || 0;
  const salesPageConversion = safeData.salesPageConversion || 0;
  const checkoutConversion = safeData.checkoutConversion || 0;
  const orderBumpRate = safeData.orderBumpRate || 0;
  
  // Dados para a tabela de métricas
  const metricsData = [
    ["Faturamento Total", formatCurrency(totalRevenue)],
    ["ROI Atual", `${currentROI.toFixed(2)}x`],
    ["CPC Atual", formatCurrency(currentCPC)],
    ["CPC Máx. Recomendado", formatCurrency(maxCPC)],
    ["Conversão Página de Vendas", `${salesPageConversion.toFixed(1)}%`],
    ["Conversão Checkout", `${checkoutConversion.toFixed(1)}%`],
    ["Taxa de Order Bump", `${orderBumpRate.toFixed(1)}%`],
  ];
  
  // Renderizar tabela de métricas
  autoTable(doc, {
    startY: startY + 5,
    head: [["Métrica", "Valor"]],
    body: metricsData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: COLORS.secondary
    },
    margin: { left: SPACING.marginX, right: SPACING.marginX },
  });
  
  // Retornar posição Y após a tabela
  return (doc as any).lastAutoTable?.finalY + SPACING.sectionSpacing || startY + 130;
};
