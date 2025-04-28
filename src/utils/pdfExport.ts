
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "./formatters";

const generateHeader = (doc: any, title: string) => {
  doc.setFontSize(18);
  doc.setTextColor(41, 98, 255);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 20);
  doc.line(20, 25, 190, 25);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
};

const createMetricsTable = (doc: any, formData: any, diagnostics: any) => {
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

const createComparisonTable = (doc: any, comparisonData: any) => {
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 40;
  const currentY = finalY + 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("Comparação com Métricas Ideais", 20, currentY);
  doc.setFont("helvetica", "normal");
  
  const tableData = comparisonData.map((item: any) => [
    item.name,
    `${item.actual}%`,
    `${item.ideal}%`,
    item.actual >= item.ideal ? "✓" : "✗"
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Métrica", "Seu Valor", "Valor Ideal", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255]
    },
    columnStyles: {
      3: { 
        halign: 'center',
        cellWidth: 20
      }
    }
  });
};

const createRecommendationsSection = (doc: any, diagnostics: any) => {
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 40;
  const currentY = finalY + 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações", 20, currentY);
  doc.setFont("helvetica", "normal");
  
  // Gerar recomendações com base nas métricas
  const recommendations = [];
  
  // Recomendações baseadas no CPC
  if (diagnostics.currentCPC > 2) {
    recommendations.push([
      "Tráfego",
      `Seu CPC (${formatCurrency(diagnostics.currentCPC)}) está acima do máximo recomendado (R$2,00). Pause conjuntos que não venderam após 2 dias.`
    ]);
  } else {
    recommendations.push([
      "Tráfego",
      `Seu CPC (${formatCurrency(diagnostics.currentCPC)}) está dentro do limite recomendado. Continue monitorando.`
    ]);
  }
  
  // Recomendações baseadas no ROI
  if (diagnostics.currentROI < 1) {
    recommendations.push([
      "ROI",
      `Seu ROI (${diagnostics.currentROI?.toFixed(2) || 0}x) está gerando prejuízo. Se persistir por 3 dias, pause a campanha.`
    ]);
  } else if (diagnostics.currentROI >= 1 && diagnostics.currentROI < 1.5) {
    recommendations.push([
      "ROI",
      `Seu ROI (${diagnostics.currentROI.toFixed(2)}x) está aceitável. Mantenha o orçamento e otimize criativos.`
    ]);
  } else if (diagnostics.currentROI >= 1.5) {
    recommendations.push([
      "ROI",
      `Seu ROI (${diagnostics.currentROI.toFixed(2)}x) está excelente. Aumente o orçamento em 20%.`
    ]);
  }
  
  // Recomendações para página de vendas
  if (diagnostics.salesPageConversion < 40) {
    recommendations.push([
      "Página de Vendas",
      `Taxa de conversão baixa (${diagnostics.salesPageConversion.toFixed(1)}%). Melhore elementos persuasivos e chamadas para ação.`
    ]);
  } else {
    recommendations.push([
      "Página de Vendas",
      `Taxa de conversão boa (${diagnostics.salesPageConversion.toFixed(1)}%). Continue testando melhorias incrementais.`
    ]);
  }
  
  // Recomendações para checkout
  if (diagnostics.checkoutConversion < 40) {
    recommendations.push([
      "Checkout",
      `Conversão baixa (${diagnostics.checkoutConversion.toFixed(1)}%). Simplifique o processo e adicione elementos de confiança.`
    ]);
  } else {
    recommendations.push([
      "Checkout",
      `Conversão boa (${diagnostics.checkoutConversion.toFixed(1)}%). Mantenha o processo atual.`
    ]);
  }
  
  // Recomendações para Order Bump
  if ((diagnostics.orderBumpRate || 0) < 30) {
    recommendations.push([
      "Order Bump",
      `Taxa baixa (${(diagnostics.orderBumpRate || 0).toFixed(1)}%). Melhore a proposta de valor e posicionamento.`
    ]);
  } else {
    recommendations.push([
      "Order Bump",
      `Taxa boa (${(diagnostics.orderBumpRate || 0).toFixed(1)}%). Continue com a estratégia atual.`
    ]);
  }
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Área", "Recomendação"]],
    body: recommendations,
    theme: "grid",
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255]
    }
  });
  
  // Adicionar regras gerais e parâmetros ideais
  const finalY2 = doc.lastAutoTable ? doc.lastAutoTable.finalY : currentY + 50;
  const currentY2 = finalY2 + 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("Regras Gerais do Funil", 20, currentY2);
  doc.setFont("helvetica", "normal");
  
  const rulesData = [
    ["CPA Ideal", "R$17,00"],
    ["IC Máximo", "R$6,00"],
    ["CPC Máximo", "R$2,00"],
    ["ROI para Escala", "> 1.5x"],
    ["Conversão Página", "> 40%"],
    ["Conversão Checkout", "> 40%"],
    ["Taxa de Order Bump", "> 30%"]
  ];
  
  autoTable(doc, {
    startY: currentY2 + 5,
    head: [["Parâmetro", "Valor Ideal"]],
    body: rulesData,
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

const createDateInfo = (doc: any, formData: any) => {
  // Adicionar período de análise
  let periodText = "Período não especificado";
  
  if (formData.startDate && formData.endDate) {
    const startDate = formData.startDate instanceof Date 
      ? formData.startDate 
      : new Date(formData.startDate);
      
    const endDate = formData.endDate instanceof Date 
      ? formData.endDate 
      : new Date(formData.endDate);
      
    periodText = `Período de análise: ${startDate.toLocaleDateString('pt-BR')} a ${endDate.toLocaleDateString('pt-BR')}`;
  }
  
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 280;
  doc.setFontSize(10);
  doc.text(periodText, 20, finalY + 10);
  
  // Adicionar rodapé
  doc.setFontSize(8);
  doc.text("© Insights Oceano Azul - " + new Date().getFullYear(), 80, finalY + 20);
};

export const exportToPdf = (formData: any, diagnostics: any, comparisonData: any) => {
  const doc = new jsPDF();
  
  // Adicionar cabeçalho
  generateHeader(doc, "Relatório de Análise de Funil - Oceano Azul");
  
  // Adicionar tabela de métricas
  createMetricsTable(doc, formData, diagnostics);
  
  // Adicionar tabela de comparação
  createComparisonTable(doc, comparisonData);
  
  // Adicionar nova página para recomendações
  doc.addPage();
  generateHeader(doc, "Recomendações & Regras do Funil");
  
  // Adicionar seção de recomendações
  createRecommendationsSection(doc, diagnostics);
  
  // Adicionar informações de data e rodapé
  createDateInfo(doc, formData);
  
  // Salvar PDF
  doc.save("relatorio-analise-funil.pdf");
  
  return true;
};
