
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../formatters";

export const createMetricsTable = (doc: jsPDF, formData: any, diagnostics: any) => {
  doc.setFont("helvetica", "bold");
  doc.text("Métricas Principais", 20, 35);
  doc.setFont("helvetica", "normal");
  
  const metricsData = [
    ["Faturamento Total", formatCurrency(diagnostics.totalRevenue || 0)],
    ["ROI Atual", diagnostics.currentROI ? `${diagnostics.currentROI.toFixed(2)}x` : "N/A"],
    ["CPC Atual", diagnostics.currentCPC ? formatCurrency(diagnostics.currentCPC) : "N/A"],
    ["CPC Máx. Recomendado", diagnostics.maxCPC ? formatCurrency(diagnostics.maxCPC) : "N/A"],
    ["Conversão Página de Vendas", `${diagnostics.salesPageConversion?.toFixed(1) || 0}%`],
    ["Conversão Checkout", `${diagnostics.checkoutConversion?.toFixed(1) || 0}%`],
    ["Taxa de Order Bump", `${(diagnostics.orderBumpRate || 0).toFixed(1)}%`],
  ];
  
  autoTable(doc, {
    startY: 40,
    head: [["Métrica", "Valor"]],
    body: metricsData,
    theme: "grid",
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255]
    }
  });
};
