
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, SPACING, PdfDiagnostics } from "./types";

/**
 * Cria a seção de recomendações
 */
export const createRecommendationsSection = (doc: jsPDF, diagnostics: PdfDiagnostics, startY: number): number => {
  // Garantir que diagnostics seja um objeto válido
  const safeData = diagnostics || {};
  
  // Título da seção
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Recomendações & Regras do Funil", SPACING.marginX, startY);
  doc.setFontSize(12);
  
  // Métrica de ROI para determinar recomendações específicas
  const roi = safeData.currentROI || 0;
  const cpc = safeData.currentCPC || 0;
  const salesPageConversion = safeData.salesPageConversion || 0;
  const checkoutConversion = safeData.checkoutConversion || 0;
  const orderBumpRate = safeData.orderBumpRate || 0;
  
  // Gerar recomendações baseadas nas métricas atuais
  const recommendations = [
    {
      categoria: "Tráfego",
      recomendacoes: [
        cpc > 2 
          ? "Pause conjuntos com CPC > R$2 que não converteram após 2 dias" 
          : "Continue monitorando seu CPC para mantê-lo abaixo de R$2",
        roi >= 1.5
          ? "Aumente seu orçamento em 20% para escalar seus resultados"
          : "Mantenha o orçamento atual e focus na otimização dos criativos"
      ]
    },
    {
      categoria: "Conversão",
      recomendacoes: [
        salesPageConversion < 40
          ? "Otimize sua página de vendas para melhorar a taxa de conversão (ideal: 40%+)"
          : "Sua página de vendas está convertendo bem, continue com a estratégia atual",
        checkoutConversion < 40
          ? "Simplifique seu processo de checkout para aumentar a taxa de finalização"
          : "Seu checkout está performando bem (conversão acima de 40%)"
      ]
    },
    {
      categoria: "Maximização de Receita",
      recomendacoes: [
        orderBumpRate < 30
          ? "Melhore sua proposta de order bump para aumentar a taxa de aceitação"
          : "Seu order bump está performando bem, considere testar outros produtos"
      ]
    }
  ];
  
  // Regras gerais do funil
  const rules = [
    "Mantenha o CPC abaixo de R$2,00 para garantir lucratividade",
    "Busque um ROI mínimo de 1,5x para escalar com segurança",
    "Se o ROI estiver < 1x por 3 dias seguidos, pause a campanha",
    "Teste novos criativos a cada 3-5 dias para evitar fadiga de audiência",
    "Revise os resultados diariamente para otimização contínua"
  ];
  
  // Renderizar recomendações por categoria
  let currentY = startY + 10;
  
  recommendations.forEach((categ) => {
    // Título da categoria
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);  // Fixed: Using hex string directly
    doc.text(`${categ.categoria}:`, SPACING.marginX, currentY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text);  // Fixed: Using hex string directly
    
    currentY += 7;
    
    // Listar recomendações
    categ.recomendacoes.forEach((rec) => {
      // Usar texto multi-linha se necessário
      const textLines = doc.splitTextToSize(rec, 170);
      doc.text(`• ${textLines[0]}`, SPACING.marginX + 5, currentY);
      
      // Se houver mais linhas, adicionar abaixo com recuo
      for (let i = 1; i < textLines.length; i++) {
        currentY += 5;
        doc.text(textLines[i], SPACING.marginX + 7, currentY);
      }
      
      currentY += 7;
    });
    
    currentY += 3;
  });
  
  // Seção de regras gerais
  currentY += 5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);  // Fixed: Using hex string directly
  doc.text("Regras Gerais do Funil:", SPACING.marginX, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);  // Fixed: Using hex string directly
  
  currentY += 7;
  
  // Listar regras
  rules.forEach((rule) => {
    // Usar texto multi-linha se necessário
    const textLines = doc.splitTextToSize(rule, 170);
    doc.text(`• ${textLines[0]}`, SPACING.marginX + 5, currentY);
    
    // Se houver mais linhas, adicionar abaixo com recuo
    for (let i = 1; i < textLines.length; i++) {
      currentY += 5;
      doc.text(textLines[i], SPACING.marginX + 7, currentY);
    }
    
    currentY += 7;
  });
  
  return currentY + SPACING.sectionSpacing;
};
