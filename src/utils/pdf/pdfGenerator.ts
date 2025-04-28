
import { jsPDF } from "jspdf";
import { PdfFormData, PdfDiagnostics, PdfComparisonItem } from "./types";
import { generateHeader, createDateFooter } from "./headerFooter";
import { createMetricsSection } from "./metricsSection";
import { createComparisonSection } from "./comparisonSection";
import { createRecommendationsSection } from "./recommendationsSection";
import { createTableOfContents } from "./tableOfContents";

/**
 * Gera o PDF completo do relatório de análise de funil
 * @param formData Dados do formulário
 * @param diagnostics Métricas calculadas
 * @param comparisonData Dados de comparação com métricas ideais
 */
export const exportToPdf = (
  formData: PdfFormData, 
  diagnostics: PdfDiagnostics, 
  comparisonData: PdfComparisonItem[]
): boolean => {
  try {
    // Validar e garantir que os dados sejam objetos válidos
    const safeFormData = formData || {};
    const safeDiagnostics = diagnostics || {};
    const safeComparisonData = Array.isArray(comparisonData) ? comparisonData : [];

    // Inicializar documento PDF
    const doc = new jsPDF();
    let currentY = 15;

    // ===== PÁGINA 1: MÉTRICAS PRINCIPAIS =====
    // Gerar cabeçalho da página
    currentY = generateHeader(doc, "Relatório de Análise de Funil - Oceano Azul", currentY);
    
    // Adicionar tabela de conteúdo
    currentY = createTableOfContents(doc, currentY);
    
    // Seção de métricas principais
    currentY = createMetricsSection(doc, safeFormData, safeDiagnostics, currentY);
    
    // Seção de comparação com métricas ideais
    currentY = createComparisonSection(doc, safeComparisonData, currentY);
    
    // ===== PÁGINA 2: RECOMENDAÇÕES E REGRAS =====
    // Nova página
    doc.addPage();
    currentY = 15;
    
    // Cabeçalho da segunda página
    currentY = generateHeader(doc, "Recomendações & Regras do Funil", currentY);
    
    // Seção de recomendações
    currentY = createRecommendationsSection(doc, safeDiagnostics, currentY);
    
    // Adicionar rodapé com informações de data
    createDateFooter(doc, safeFormData);
    
    // Salvar o PDF
    doc.save("relatorio-analise-funil.pdf");
    
    return true;
  } catch (error) {
    console.error("Erro na geração do PDF:", error);
    throw error;
  }
};
