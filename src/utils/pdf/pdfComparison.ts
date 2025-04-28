
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const createComparisonTable = (doc: jsPDF, comparisonData: any) => {
  // Get finalY safely with a fallback value
  const finalY = doc.lastAutoTable?.finalY || 40;
  const currentY = finalY + 15;
  
  doc.setFont("helvetica", "bold");
  doc.text("Comparação com Métricas Ideais", 20, currentY);
  doc.setFont("helvetica", "normal");
  
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
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Métrica", "Seu Valor", "Valor Ideal", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [41, 98, 255],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 245, 255]
    },
    columnStyles: {
      3: { 
        halign: 'center',
        cellWidth: 20
      }
    }
  });
};
