
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
  
  // Dados para a tabela de métricas
  const metricsData = [
    ["Faturamento Total", formatCurrency(diagnostics.totalRevenue || 0)],
    ["ROI Atual", diagnostics.currentROI ? `${diagnostics.currentROI.toFixed(2)}x` : "N/A"],
    ["CPC Atual", diagnostics.currentCPC ? formatCurrency(diagnostics.currentCPC) : "N/A"],
    ["CPC Máx. Recomendado", diagnostics.maxCPC ? formatCurrency(diagnostics.maxCPC) : "N/A"],
    ["Conversão Página de Vendas", `${diagnostics.salesPageConversion?.toFixed(1) || 0}%`],
    ["Conversão Checkout", `${diagnostics.checkoutConversion?.toFixed(1) || 0}%`],
    ["Taxa de Order Bump", `${(diagnostics.orderBumpRate || 0).toFixed(1)}%`],
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
