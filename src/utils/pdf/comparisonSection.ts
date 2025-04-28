
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, SPACING, PdfComparisonItem } from "./types";

/**
 * Cria a seção de comparação com métricas ideais
 */
export const createComparisonSection = (doc: jsPDF, comparisonData: PdfComparisonItem[], startY: number): number => {
  // Título da seção com fonte menor e mais discreto
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Comparação com Métricas Ideais", SPACING.marginX, startY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  // Verificar se comparisonData é um array válido
  const safeComparisonData = Array.isArray(comparisonData) ? comparisonData : [];
  
  // Preparar dados para a tabela de comparação
  const tableData = safeComparisonData.map((item: any) => {
    // Garantir valores numéricos válidos
    const actual = Number.isFinite(item.actual) ? item.actual : 0;
    const ideal = Number.isFinite(item.ideal) ? item.ideal : 0;
    
    // Determine the status text based on values
    const isPositive = actual >= ideal;
    const statusText = isPositive ? "BOM" : "RUIM";
    
    return [
      item.name || "N/A",
      `${actual}%`,
      `${ideal}%`,
      statusText
    ];
  });
  
  // Renderizar tabela de comparação com tamanho reduzido
  autoTable(doc, {
    startY: startY + 4,
    head: [["Métrica", "Seu Valor", "Valor Ideal", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    },
    alternateRowStyles: {
      fillColor: COLORS.secondary
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' }
    },
    margin: { left: SPACING.marginX, right: SPACING.marginX },
    didDrawCell: (data) => {
      // Verificar índices válidos
      if (!tableData.length || data.row.index >= tableData.length) return;
      
      // Adicionar cor ao texto de status
      if (data.column.index === 3 && data.row.index >= 0 && data.section === 'body') {
        const cell = data.cell;
        const value = tableData[data.row.index][3];
        
        // Configurar a cor baseada no texto
        if (value === "BOM") {
          doc.setTextColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
        } else {
          doc.setTextColor(COLORS.error[0], COLORS.error[1], COLORS.error[2]);
        }
        
        // Calcular posição central da célula e desenhar o texto
        const textPos = {
          x: cell.x + cell.width / 2,
          y: cell.y + cell.height / 2 + 2
        };
        
        // Limpar qualquer texto pré-existente na célula
        doc.setFillColor(cell.styles.fillColor[0], cell.styles.fillColor[1], cell.styles.fillColor[2]);
        doc.rect(cell.x, cell.y, cell.width, cell.height, 'F');
        
        // Desenhar o texto apenas uma vez
        doc.text(value, textPos.x, textPos.y, { align: 'center' });
        
        // Resetar a cor do texto
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      }
    }
  });
  
  // Retornar posição Y após a tabela
  return (doc as any).lastAutoTable?.finalY + SPACING.sectionSpacing || startY + 60;
};
