
import { jsPDF } from "jspdf";

export interface PdfFormData {
  startDate?: Date | string;
  endDate?: Date | string;
  [key: string]: any;
}

export interface PdfDiagnostics {
  totalRevenue?: number;
  currentROI?: number;
  currentCPC?: number;
  maxCPC?: number;
  salesPageConversion?: number;
  checkoutConversion?: number;
  orderBumpRate?: number;
  [key: string]: any;
}

export interface PdfComparisonItem {
  name: string;
  actual: number;
  ideal: number;
}

export interface PdfPosition {
  x: number;
  y: number;
}

// Define colors as simple hex strings to ensure compatibility with jsPDF
export const COLORS = {
  primary: "#2962FF",        // Blue
  secondary: "#F0F5FF",      // Light blue background
  text: "#000000",           // Black
  textLight: "#787878",      // Grey
  success: "#2ECC71",        // Green
  error: "#E74C3C",          // Red
  background: "#FFFFFF"      // White
};

export const SPACING = {
  marginX: 20,
  marginY: 15,
  headerMargin: 5,
  sectionSpacing: 8
};
