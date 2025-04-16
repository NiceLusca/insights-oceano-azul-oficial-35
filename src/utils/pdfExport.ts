import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { formatCurrency, formatPercentage } from "./formatters";

export const exportToPdf = (data: any, diagnostics: any, comparisonData: any) => {
  const doc = new jsPDF();
  
  // Use the new logo base64
  const logoBase64 = 'data:image/png;base64,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';
  
  // Adicionar logo
  doc.addImage(logoBase64, 'PNG', 15, 15, 30, 30);
  
  // Add title with logo
  doc.setTextColor(0, 51, 153);
  doc.setFontSize(22);
  doc.text("Diagnóstico de Funil de Vendas", 50, 25);
  
  doc.setTextColor(0, 102, 204);
  doc.setFontSize(16);
  doc.text("Oceano Azul", 50, 35);
  
  // Report date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  const today = format(new Date(), "dd/MM/yyyy");
  doc.text(`Relatório gerado em: ${today}`, 15, 50);
  
  // Analysis period (if available)
  if (data.startDate && data.endDate) {
    const startDate = format(new Date(data.startDate), "dd/MM/yyyy");
    const endDate = format(new Date(data.endDate), "dd/MM/yyyy");
    doc.text(`Período da análise: ${startDate} a ${endDate}`, 15, 55);
  }
  
  // Main metrics
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Métricas Principais", 15, 65);
  
  const metrics = [
    ["Faturamento Total", formatCurrency(diagnostics.totalRevenue)],
    ["Conversão da Página de Vendas", `${diagnostics.salesPageConversion.toFixed(1)}%`],
    ["Conversão do Checkout", `${diagnostics.checkoutConversion.toFixed(1)}%`],
    ["Conversão Final", `${diagnostics.finalConversion.toFixed(1)}%`],
    ["Taxa de Order Bump", `${diagnostics.orderBumpRate ? diagnostics.orderBumpRate.toFixed(1) : 0}%`],
  ];
  
  if (diagnostics.currentROI) {
    metrics.push(["ROI Atual", `${diagnostics.currentROI.toFixed(2)}x`]);
  }
  
  if (diagnostics.maxCPC) {
    metrics.push(["CPC Máximo Recomendado", formatCurrency(diagnostics.maxCPC)]);
  }
  
  if (diagnostics.currentCPC) {
    metrics.push(["CPC Atual", formatCurrency(diagnostics.currentCPC)]);
  }
  
  autoTable(doc, {
    startY: 70,
    head: [["Métrica", "Valor"]],
    body: metrics,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
  });
  
  // Diagnostics
  const tableHeight = (doc as any).lastAutoTable?.finalY || 130;
  doc.setFontSize(14);
  doc.text("Diagnóstico", 15, tableHeight + 10);
  
  const diagnosisRows = diagnostics.messages.map((msg: any) => [msg.message]);
  
  autoTable(doc, {
    startY: tableHeight + 15,
    head: [["Insights e Recomendações"]],
    body: diagnosisRows,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
  });
  
  // Comparison with ideal metrics
  const comparisonStartY = (doc as any).lastAutoTable?.finalY || 200;
  doc.setFontSize(14);
  doc.text("Comparação com Métricas Ideais", 15, comparisonStartY + 10);
  
  const comparisonRows = comparisonData.map((item: any) => [
    item.name, 
    `${item.actual}%`, 
    `${item.ideal}%`
  ]);
  
  autoTable(doc, {
    startY: comparisonStartY + 15,
    head: [["Métrica", "Seu Valor", "Valor Ideal"]],
    body: comparisonRows,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(100, 100, 100);
    
    // Adicionar logo pequeno no rodapé
    doc.addImage(logoBase64, 'PNG', 10, doc.internal.pageSize.height - 18, 10, 10);
    
    doc.text(
      "© Oceano Azul - Otimização constante é o caminho.",
      25,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  doc.save("diagnostico-funil-vendas-oceano-azul.pdf");
  
  return true;
};
