
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { formatCurrency, formatPercentage } from "./formatters";

export const exportToPdf = (data: any, diagnostics: any, comparisonData: any) => {
  const doc = new jsPDF();
  
  // Add logo
  doc.setTextColor(0, 102, 204);
  const svgLogo = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18C3 16.3431 4.34315 15 6 15H18C19.6569 15 21 16.3431 21 18V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V18Z" fill="#0066CC" />
      <path d="M6 13.5C6 12.8438 6.37967 12.253 6.9643 11.9663L16.9643 6.96634C17.6314 6.65301 18.4221 6.89568 18.8127 7.53442L18.9559 7.78318C19.318 8.37114 19.1038 9.12224 18.5299 9.50193L8.5299 16.5019C7.91093 16.9116 7.08901 16.6302 6.88586 15.9393L6.74302 15.4251C6.58362 14.9294 6.5 14.4152 6.5 13.8976L6 13.5Z" fill="#0066CC" />
    </svg>
  `;
  const svgWidth = 30;
  const svgHeight = 30;
  
  // Add title with logo
  doc.setTextColor(0, 51, 153);
  doc.setFontSize(22);
  doc.text("Diagnóstico de Funil de Vendas", 50, 25);
  
  doc.setTextColor(0, 102, 204);
  doc.setFontSize(16);
  doc.text("Oceano Azul", 50, 35);
  
  // Add logo using SVG data
  const logoDataUrl = `data:image/svg+xml;base64,${btoa(svgLogo)}`;
  doc.addImage(logoDataUrl, 'SVG', 15, 15, svgWidth, svgHeight);
  
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
    doc.text(
      "© Oceano Azul - Otimização constante é o caminho.",
      15,
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
