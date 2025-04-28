
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../formatters";

const COLORS = {
  primary: [41, 98, 255],
  secondary: [240, 245, 255],
  text: [0, 0, 0],
  textLight: [120, 120, 120],
  success: [46, 204, 113],
  error: [231, 76, 60]
};

const SPACING = {
  marginX: 20,
  marginY: 15,
  headerMargin: 5,
  sectionSpacing: 8
};

/**
 * Gera o PDF completo do relatório de análise de funil
 * @param formData Dados do formulário
 * @param diagnostics Métricas calculadas
 * @param comparisonData Dados de comparação com métricas ideais
 */
export const exportToPdf = (formData: any, diagnostics: any, comparisonData: any) => {
  // Inicializar documento PDF
  const doc = new jsPDF();
  let currentY = SPACING.marginY;

  // ===== PÁGINA 1: MÉTRICAS PRINCIPAIS =====
  // Gerar cabeçalho da página
  currentY = generateHeader(doc, "Relatório de Análise de Funil - Oceano Azul", currentY);
  
  // Seção de métricas principais
  currentY = createMetricsSection(doc, formData, diagnostics, currentY);
  
  // Seção de comparação com métricas ideais
  currentY = createComparisonSection(doc, comparisonData, currentY);
  
  // ===== PÁGINA 2: RECOMENDAÇÕES E REGRAS =====
  // Nova página
  doc.addPage();
  currentY = SPACING.marginY;
  
  // Cabeçalho da segunda página
  currentY = generateHeader(doc, "Recomendações & Regras do Funil", currentY);
  
  // Seção de recomendações
  currentY = createRecommendationsSection(doc, diagnostics, currentY);
  
  // Adicionar rodapé com informações de data
  createDateFooter(doc, formData);
  
  // Salvar o PDF
  doc.save("relatorio-analise-funil.pdf");
  
  return true;
};

/**
 * Gera o cabeçalho do documento
 */
const generateHeader = (doc: jsPDF, title: string, startY: number): number => {
  // Configurações de estilo para o cabeçalho
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(title, SPACING.marginX, startY);
  
  // Linha separadora
  const lineY = startY + 5;
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.line(SPACING.marginX, lineY, 190, lineY);
  
  // Resetar estilos
  doc.setFontSize(12);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "normal");
  
  // Retornar posição Y após cabeçalho
  return lineY + SPACING.headerMargin + 10;
};

/**
 * Cria a seção de métricas principais
 */
const createMetricsSection = (doc: jsPDF, formData: any, diagnostics: any, startY: number): number => {
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

/**
 * Cria a seção de comparação com métricas ideais
 */
const createComparisonSection = (doc: jsPDF, comparisonData: any, startY: number): number => {
  // Título da seção
  doc.setFont("helvetica", "bold");
  doc.text("Comparação com Métricas Ideais", SPACING.marginX, startY);
  doc.setFont("helvetica", "normal");
  
  // Preparar dados para a tabela de comparação
  const tableData = comparisonData.map((item: any) => {
    // Determine the status symbol based on values
    const isPositive = item.actual >= item.ideal;
    const statusSymbol = isPositive ? "✓" : "✗";
    
    return [
      item.name,
      `${item.actual}%`,
      `${item.ideal}%`,
      statusSymbol
    ];
  });
  
  // Renderizar tabela de comparação
  autoTable(doc, {
    startY: startY + 5,
    head: [["Métrica", "Seu Valor", "Valor Ideal", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: COLORS.secondary
    },
    columnStyles: {
      3: { 
        halign: 'center',
        cellWidth: 20
      }
    },
    margin: { left: SPACING.marginX, right: SPACING.marginX },
    didDrawCell: (data) => {
      // Adicionar cor aos símbolos de status
      if (data.column.index === 3 && data.row.index >= 0 && data.section === 'body') {
        const cell = data.cell;
        const value = tableData[data.row.index][3];
        
        // Configurar a cor baseada no símbolo
        if (value === "✓") {
          doc.setTextColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
        } else {
          doc.setTextColor(COLORS.error[0], COLORS.error[1], COLORS.error[2]);
        }
        
        // Calcular posição central da célula e desenhar o símbolo
        const textPos = {
          x: cell.x + cell.width / 2,
          y: cell.y + cell.height / 2 + 1
        };
        
        doc.text(value, textPos.x, textPos.y, { align: 'center' });
        
        // Resetar a cor do texto
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      }
    }
  });
  
  // Retornar posição Y após a tabela
  return (doc as any).lastAutoTable?.finalY + SPACING.sectionSpacing || startY + 80;
};

/**
 * Cria a seção de recomendações
 */
const createRecommendationsSection = (doc: jsPDF, diagnostics: any, startY: number): number => {
  // Título da seção
  doc.setFont("helvetica", "bold");
  doc.text("Recomendações", SPACING.marginX, startY);
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

/**
 * Adiciona o rodapé com informações da data
 */
const createDateFooter = (doc: jsPDF, formData: any) => {
  // Obter dimensões do documento
  const pageHeight = doc.internal.pageSize.height;
  
  // Formatar período de análise
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
  
  // Adicionar período de análise
  const footerTopY = pageHeight - 30;
  doc.setFontSize(10);
  doc.text(periodText, SPACING.marginX, footerTopY);
  
  // Adicionar mensagem de direitos autorais
  const copyrightY = pageHeight - 20;
  doc.setFontSize(8);
  doc.text("© Insights Oceano Azul - " + new Date().getFullYear(), 80, copyrightY);
};
