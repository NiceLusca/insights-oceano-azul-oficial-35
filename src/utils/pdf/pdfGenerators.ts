
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "../formatters";
import { generateHeader } from "./pdfHeader";
import { createMetricsTable } from "./pdfMetrics";
import { createComparisonTable } from "./pdfComparison";
import { createRecommendationsSection } from "./pdfRecommendations";
import { createDateInfo } from "./pdfFooter";

export const exportToPdf = (formData: any, diagnostics: any, comparisonData: any) => {
  const doc = new jsPDF();
  
  // Adicionar cabeçalho
  generateHeader(doc, "Relatório de Análise de Funil - Oceano Azul");
  
  // Adicionar tabela de métricas
  createMetricsTable(doc, formData, diagnostics);
  
  // Adicionar tabela de comparação
  createComparisonTable(doc, comparisonData);
  
  // Adicionar nova página para recomendações
  doc.addPage();
  generateHeader(doc, "Recomendações & Regras do Funil");
  
  // Adicionar seção de recomendações
  createRecommendationsSection(doc, diagnostics);
  
  // Adicionar informações de data e rodapé
  createDateInfo(doc, formData);
  
  // Salvar PDF
  doc.save("relatorio-analise-funil.pdf");
  
  return true;
};
