
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

// Define colors as tuples with exactly 3 elements [R, G, B]
export const COLORS = {
  primary: [41, 98, 255] as [number, number, number],
  secondary: [240, 245, 255] as [number, number, number],
  text: [0, 0, 0] as [number, number, number],
  textLight: [120, 120, 120] as [number, number, number],
  success: [46, 204, 113] as [number, number, number],
  error: [231, 76, 60] as [number, number, number]
};

export const SPACING = {
  marginX: 20,
  marginY: 15,
  headerMargin: 5,
  sectionSpacing: 8
};
