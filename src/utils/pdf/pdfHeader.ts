
import { jsPDF } from "jspdf";

export const generateHeader = (doc: jsPDF, title: string) => {
  doc.setFontSize(18);
  doc.setTextColor(41, 98, 255);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 20);
  doc.line(20, 25, 190, 25);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
};
