
import { jsPDF } from "jspdf";

export const createDateInfo = (doc: jsPDF, formData: any) => {
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
  
  // Get finalY safely with a fallback value
  const finalY = doc.lastAutoTable?.finalY || 280;
  doc.setFontSize(10);
  doc.text(periodText, 20, finalY + 10);
  
  // Adicionar rodapé
  doc.setFontSize(8);
  doc.text("© Insights Oceano Azul - " + new Date().getFullYear(), 80, finalY + 20);
};
