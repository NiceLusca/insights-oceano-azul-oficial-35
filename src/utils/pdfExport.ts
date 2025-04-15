
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { formatCurrency, formatPercentage } from "./formatters";

export const exportToPdf = (data: any, diagnostics: any, comparisonData: any) => {
  const doc = new jsPDF();
  
  // Adiciona o logo
  const imgData = "/lovable-uploads/2da50e89-1402-421c-8c73-60efe5119215.png";
  doc.addImage(imgData, "PNG", 15, 10, 30, 30);
  
  // Título
  doc.setTextColor(0, 51, 153);
  doc.setFontSize(22);
  doc.text("Diagnóstico de Funil de Vendas", 55, 25);
  
  doc.setTextColor(0, 102, 204);
  doc.setFontSize(16);
  doc.text("Oceano Azul", 55, 35);
  
  // Data do relatório
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  const today = format(new Date(), "dd/MM/yyyy");
  doc.text(`Relatório gerado em: ${today}`, 15, 50);
  
  // Período da análise (se disponível)
  if (data.startDate && data.endDate) {
    const startDate = format(data.startDate, "dd/MM/yyyy");
    const endDate = format(data.endDate, "dd/MM/yyyy");
    doc.text(`Período da análise: ${startDate} a ${endDate}`, 15, 55);
  }
  
  // Métricas principais
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Métricas Principais", 15, 65);
  
  const metrics = [
    ["Faturamento Total", formatCurrency(diagnostics.totalRevenue)],
    ["Conversão da Página de Vendas", `${diagnostics.salesPageConversion.toFixed(1)}%`],
    ["Conversão do Checkout", `${diagnostics.checkoutConversion.toFixed(1)}%`],
    ["Conversão Final", `${diagnostics.finalConversion.toFixed(1)}%`],
  ];
  
  if (diagnostics.currentROI) {
    metrics.push(["ROI Atual", `${diagnostics.currentROI.toFixed(2)}x`]);
  }
  
  if (diagnostics.maxCPC) {
    metrics.push(["CPC Máximo Recomendado", formatCurrency(diagnostics.maxCPC)]);
  }
  
  autoTable(doc, {
    startY: 70,
    head: [["Métrica", "Valor"]],
    body: metrics,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
  });
  
  // Diagnósticos
  const startY = doc.lastAutoTable?.finalY || 130;
  doc.setFontSize(14);
  doc.text("Diagnóstico", 15, startY + 10);
  
  const diagnosisRows = diagnostics.messages.map((msg: any) => [msg.message]);
  
  autoTable(doc, {
    startY: startY + 15,
    head: [["Insights e Recomendações"]],
    body: diagnosisRows,
    theme: "grid",
    headStyles: { fillColor: [0, 102, 204] },
  });
  
  // Comparação com métricas ideais
  const comparisonStartY = doc.lastAutoTable?.finalY || 200;
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
  
  // Rodapé
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
