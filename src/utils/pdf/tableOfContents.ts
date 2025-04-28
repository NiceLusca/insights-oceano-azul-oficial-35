
import { jsPDF } from "jspdf";
import { COLORS, SPACING } from "./types";

/**
 * Creates a table of contents for the PDF report
 * @param doc The PDF document
 * @param startY The starting Y position
 * @returns The new Y position after the table of contents
 */
export const createTableOfContents = (doc: jsPDF, startY: number): number => {
  // Title for the table of contents
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("Sumário", SPACING.marginX, startY);
  
  // Reset text color and font
  doc.setTextColor(COLORS.text);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  
  const tableOfContents = [
    { title: "1. Métricas Principais", page: 1 },
    { title: "2. Comparação com Métricas Ideais", page: 1 },
    { title: "3. Recomendações", page: 2 },
    { title: "4. Regras Gerais do Funil", page: 2 }
  ];
  
  // Adding items with dotted lines
  let currentY = startY + 10;
  const lineSpacing = 8;
  const pageNumberX = 190; // X position for the page number
  
  tableOfContents.forEach(item => {
    // Draw the title
    doc.setFont("helvetica", "normal");
    doc.text(item.title, SPACING.marginX, currentY);
    
    // Calculate width of the title
    const titleWidth = doc.getTextWidth(item.title);
    
    // Draw dotted line
    const startX = SPACING.marginX + titleWidth + 3;
    const endX = pageNumberX - 3;
    
    // Draw dots
    const dotSpacing = 3;
    for (let x = startX; x < endX; x += dotSpacing) {
      doc.text(".", x, currentY - 1.5);
    }
    
    // Draw page number
    doc.setFont("helvetica", "bold");
    doc.text(item.page.toString(), pageNumberX, currentY, { align: "right" });
    
    // Move to next line
    currentY += lineSpacing;
  });
  
  // Add some space after the table of contents
  return currentY + 10;
};
