
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../formatters";

export const createRecommendationsSection = (doc: jsPDF, diagnostics: any) => {
  // Get finalY safely with a fallback value
  const finalY = doc.lastAutoTable?.finalY || 40;
  const currentY = finalY + 10; // Reduced from 15 to 10
  
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
  // Get finalY safely with a fallback value
  const finalY2 = doc.lastAutoTable?.finalY || currentY + 50;
  const currentY2 = finalY2 + 8; // Reduced from 15 to 8
  
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
    startY: currentY2 + 3, // Reduced from 5 to 3
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
