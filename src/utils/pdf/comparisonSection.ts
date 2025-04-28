
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, SPACING, PdfComparisonItem } from "./types";

/**
 * Cria a seção de comparação com métricas ideais
 */
export const createComparisonSection = (doc: jsPDF, comparisonData: PdfComparisonItem[], startY: number): number => {
  // Validar se temos dados para mostrar
  if (!Array.isArray(comparisonData) || comparisonData.length === 0) {
    return startY + 10;
  }

  // Título da seção
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("Comparação com Métricas Ideais", SPACING.marginX, startY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  
  // Formatar dados para a tabela
  const bodyData = comparisonData.map(item => {
    // Garantir que todos os valores são números válidos
    const actualNum = typeof item.actual === 'number' && !isNaN(item.actual) ? item.actual : 0;
    const idealNum = typeof item.ideal === 'number' && !isNaN(item.ideal) ? item.ideal : 0;
    
    // Calcular a proporção como porcentagem da meta
    const proportion = idealNum > 0 ? (actualNum / idealNum) * 100 : 0;
    
    // Formatar os valores com unidades apropriadas
    let actualFormatted = actualNum.toFixed(1);
    let idealFormatted = idealNum.toFixed(1);
    
    // Adicionar % para métricas que são percentuais
    if (item.name.toLowerCase().includes("conversão") || 
        item.name.toLowerCase().includes("taxa")) {
      actualFormatted += "%";
      idealFormatted += "%";
    } else if (item.name.toLowerCase().includes("roi")) {
      // Para ROI, dividir por 100 pois é armazenado como percentual mas exibido como multiplicador
      actualFormatted = (actualNum / 100).toFixed(2) + "x";
      idealFormatted = (idealNum / 100).toFixed(2) + "x";
    }
    
    // Retornar linha formatada para a tabela
    return [item.name, actualFormatted, idealFormatted, proportion.toFixed(1) + "%"];
  });
  
  // Configurar e renderizar a tabela
  autoTable(doc, {
    startY: startY + 5,
    head: [["Métrica", "Atual", "Ideal", "Proporção"]],
    body: bodyData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: "#FFFFFF"
    },
    alternateRowStyles: {
      fillColor: COLORS.secondary
    },
    margin: { left: SPACING.marginX, right: SPACING.marginX },
    didDrawCell: (data) => {
      // Se estiver desenhando uma célula de proporção (última coluna)
      if (data.section === 'body' && data.column.index === 3) {
        try {
          // Extrair valor numérico da proporção
          const proportionText = data.cell.text[0] || "0%";
          const proportionValue = parseFloat(proportionText.replace('%', ''));
          
          // Determinar cor baseada na proporção
          let fillColor;
          if (proportionValue >= 100) {
            fillColor = COLORS.success;
          } else if (proportionValue >= 70) {
            fillColor = "#F39C12"; // Amber (usando string hex direta)
          } else {
            fillColor = COLORS.error;
          }
          
          // Definir cor para célula
          const width = data.cell.width;
          const height = data.cell.height;
          const x = data.cell.x;
          const y = data.cell.y;
          
          // Renderizar barra de progresso
          const barWidth = (width - 2) * (proportionValue / 100);
          const maxBarWidth = width - 2; // Limitar largura máxima
          
          // Certificar-se de que a barra tem largura válida
          const finalBarWidth = Math.min(Math.max(0, barWidth), maxBarWidth);
          
          // Salvar estado atual
          doc.saveGraphicsState();
          
          // Desenhar barra com cor apropriada
          doc.setFillColor(fillColor);
          doc.rect(x + 1, y + 1, finalBarWidth, height - 2, 'F');
          
          // Restaurar estado
          doc.restoreGraphicsState();
        } catch (error) {
          console.error("Erro ao desenhar célula de comparação:", error);
        }
      }
    }
  });
  
  // Retornar posição Y após a tabela
  return (doc as any).lastAutoTable?.finalY + SPACING.sectionSpacing || startY + 100;
};
