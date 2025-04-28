
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../formatters";
import { COLORS, SPACING, PdfDiagnostics } from "./types";

/**
 * Cria a seção de recomendações
 */
export const createRecommendationsSection = (doc: jsPDF, diagnostics: PdfDiagnostics, startY: number): number => {
  // Título da seção
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações", SPACING.marginX, startY);
  doc.setFont("helvetica", "normal");
  
  // Gerar recomendações com base nas métricas
  const recommendations = [];
  
  // Recomendações baseadas no CPC
  if (diagnostics.currentCPC && diagnostics.currentCPC > 2) {
    recommendations.push([
      "Tráfego",
      `Seu CPC (${formatCurrency(diagnostics.currentCPC)}) está acima do máximo recomendado (R$2,00). Pause conjuntos que não venderam após 2 dias.`
    ]);
  } else {
    recommendations.push([
      "Tráfego",
      `Seu CPC (${formatCurrency(diagnostics.currentCPC || 0)}) está dentro do limite recomendado. Continue monitorando.`
    ]);
  }
  
  // Recomendações baseadas no ROI
  if (diagnostics.currentROI && diagnostics.currentROI < 1) {
    recommendations.push([
      "ROI",
      `Seu ROI (${diagnostics.currentROI?.toFixed(2) || 0}x) está gerando prejuízo. Se persistir por 3 dias, pause a campanha.`
    ]);
  } else if (diagnostics.currentROI && diagnostics.currentROI >= 1 && diagnostics.currentROI < 1.5) {
    recommendations.push([
      "ROI",
      `Seu ROI (${diagnostics.currentROI.toFixed(2)}x) está aceitável. Mantenha o orçamento e otimize criativos.`
    ]);
  } else if (diagnostics.currentROI && diagnostics.currentROI >= 1.5) {
    recommendations.push([
      "ROI",
      `Seu ROI (${diagnostics.currentROI.toFixed(2)}x) está excelente. Aumente o orçamento em 20%.`
    ]);
  }
  
  // Recomendações para página de vendas
  if (diagnostics.salesPageConversion && diagnostics.salesPageConversion < 40) {
    recommendations.push([
      "Página de Vendas",
      `Taxa de conversão baixa (${diagnostics.salesPageConversion.toFixed(1)}%). Melhore elementos persuasivos e chamadas para ação.`
    ]);
  } else if (diagnostics.salesPageConversion) {
    recommendations.push([
      "Página de Vendas",
      `Taxa de conversão boa (${diagnostics.salesPageConversion.toFixed(1)}%). Continue testando melhorias incrementais.`
    ]);
  }
  
  // Recomendações para checkout
  if (diagnostics.checkoutConversion && diagnostics.checkoutConversion < 40) {
    recommendations.push([
      "Checkout",
      `Conversão baixa (${diagnostics.checkoutConversion.toFixed(1)}%). Simplifique o processo e adicione elementos de confiança.`
    ]);
  } else if (diagnostics.checkoutConversion) {
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
  
  // Renderizar tabela de recomendações
  autoTable(doc, {
    startY: startY + 5,
    head: [["Área", "Recomendação"]],
    body: recommendations,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: COLORS.secondary
    },
    margin: { left: SPACING.marginX, right: SPACING.marginX },
    styles: {
      fontSize: 10,
      cellPadding: 4
    }
  });
  
  // Posição Y após a tabela
  const currentY = (doc as any).lastAutoTable?.finalY + 6 || startY + 100;
  
  // Título da seção de regras
  doc.setFont("helvetica", "bold");
  doc.text("Regras Gerais do Funil", SPACING.marginX, currentY);
  doc.setFont("helvetica", "normal");
  
  // Dados para a tabela de regras
  const rulesData = [
    ["CPA Ideal", "R$17,00"],
    ["IC Máximo", "R$6,00"],
    ["CPC Máximo", "R$2,00"],
    ["ROI para Escala", "> 1.5x"],
    ["Conversão Página", "> 40%"],
    ["Conversão Checkout", "> 40%"],
    ["Taxa de Order Bump", "> 30%"]
  ];
  
  // Renderizar tabela de regras
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Parâmetro", "Valor Ideal"]],
    body: rulesData,
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
  return (doc as any).lastAutoTable?.finalY + SPACING.sectionSpacing || currentY + 80;
};
