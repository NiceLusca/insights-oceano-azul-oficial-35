
import { jsPDF } from "jspdf";
import { COLORS, SPACING, PdfFormData } from "./types";

/**
 * Gera o cabeçalho do documento
 */
export const generateHeader = (doc: jsPDF, title: string, startY: number): number => {
  // Verificar parâmetros de entrada
  const safeTitle = title || "Relatório de Análise";
  const safeStartY = typeof startY === 'number' ? startY : 15;
  
  // Configurações de estilo para o cabeçalho
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary);
  doc.setFont("helvetica", "bold");
  doc.text(safeTitle, SPACING.marginX, safeStartY);
  
  // Linha separadora
  const lineY = safeStartY + 5;
  doc.setDrawColor(COLORS.primary);
  doc.line(SPACING.marginX, lineY, 190, lineY);
  
  // Resetar estilos
  doc.setFontSize(12);
  doc.setTextColor(COLORS.text);
  doc.setFont("helvetica", "normal");
  
  // Retornar posição Y após cabeçalho
  return lineY + SPACING.headerMargin + 10;
};

/**
 * Adiciona o rodapé com informações da data
 */
export const createDateFooter = (doc: jsPDF, formData: PdfFormData) => {
  // Validar dados de entrada
  const safeFormData = formData || {};
  
  // Obter dimensões do documento
  const pageHeight = doc.internal.pageSize.height;
  
  // Formatar período de análise
  let periodText = "Período não especificado";
  
  try {
    if (safeFormData.startDate && safeFormData.endDate) {
      let startDate, endDate;
      
      if (safeFormData.startDate instanceof Date) {
        startDate = safeFormData.startDate;
      } else if (typeof safeFormData.startDate === 'string') {
        startDate = new Date(safeFormData.startDate);
      }
      
      if (safeFormData.endDate instanceof Date) {
        endDate = safeFormData.endDate;
      } else if (typeof safeFormData.endDate === 'string') {
        endDate = new Date(safeFormData.endDate);
      }
      
      // Verificar se as datas são válidas
      if (startDate && !isNaN(startDate.getTime()) && 
          endDate && !isNaN(endDate.getTime())) {
        periodText = `Período de análise: ${startDate.toLocaleDateString('pt-BR')} a ${endDate.toLocaleDateString('pt-BR')}`;
      }
    }
  } catch (error) {
    console.error("Erro ao formatar datas:", error);
  }
  
  // Adicionar período de análise
  const footerTopY = pageHeight - 30;
  doc.setFontSize(10);
  doc.setTextColor(COLORS.textLight);
  doc.text(periodText, SPACING.marginX, footerTopY);
  
  // Adicionar mensagem de direitos autorais
  const copyrightY = pageHeight - 20;
  doc.setFontSize(8);
  doc.text("© Insights Oceano Azul - " + new Date().getFullYear(), 80, copyrightY);
};
