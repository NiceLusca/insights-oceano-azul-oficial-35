
import { jsPDF } from "jspdf";
import { COLORS, SPACING, PdfFormData } from "./types";

/**
 * Gera o cabeçalho do documento
 */
export const generateHeader = (doc: jsPDF, title: string, startY: number): number => {
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
 * Adiciona o rodapé com informações da data
 */
export const createDateFooter = (doc: jsPDF, formData: PdfFormData) => {
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
