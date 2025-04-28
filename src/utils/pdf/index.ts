
export * from './pdfGenerator';
export * from './types';
export * from './headerFooter';
export * from './metricsSection';
export * from './comparisonSection';
export * from './recommendationsSection';
export * from './tableOfContents';

// Export the function with the right name for consistency
export { exportToPdf as generatePDF } from './pdfGenerator';
