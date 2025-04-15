
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { exportToPdf } from "@/utils/pdfExport";
import { toast } from "sonner";

interface HistoryTableProps {
  analyses: any[];
  onLoadAnalysis: (analysis: any) => void;
}

export const HistoryTable = ({ analyses, onLoadAnalysis }: HistoryTableProps) => {
  const handleExportPDF = async (analysis: any) => {
    try {
      toast.promise(
        new Promise(async (resolve) => {
          const formData = analysis.form_data;
          const diagnostics = analysis.diagnostics;
          const comparisonData = getComparisonData(formData);
          
          const result = exportToPdf(formData, diagnostics, comparisonData);
          resolve(result);
        }),
        {
          loading: 'Generating PDF...',
          success: 'Report exported successfully!',
          error: 'Error exporting report.',
        }
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };
  
  const getComparisonData = (formData: any) => {
    if (!formData) return [];
    
    const salesPageVisits = formData.salesPageVisits || 0;
    const checkoutVisits = formData.checkoutVisits || 0;
    const mainProductSales = formData.mainProductSales || 0;
    const comboSales = formData.comboSales || 0;
    const orderBumpSales = formData.orderBumpSales || 0;
    const upsellSales = formData.upsellSales || 0;
    
    const salesPageConversion = salesPageVisits > 0 ? (checkoutVisits / salesPageVisits) * 100 : 0;
    const checkoutConversion = checkoutVisits > 0 ? ((mainProductSales + comboSales) / checkoutVisits) * 100 : 0;
    
    const totalSales = mainProductSales + comboSales;
    const comboRate = totalSales > 0 ? (comboSales / totalSales) * 100 : 0;
    
    const orderBumpRate = totalSales > 0 ? (orderBumpSales / totalSales) * 100 : 0;
    
    const upsellRate = totalSales > 0 ? (upsellSales / totalSales) * 100 : 0;
    
    const data = [
      {
        name: "Sales Page",
        actual: Number(salesPageConversion.toFixed(1)),
        ideal: 40,
      },
      {
        name: "Checkout",
        actual: Number(checkoutConversion.toFixed(1)),
        ideal: 40,
      },
      {
        name: "Combo Rate",
        actual: Number(comboRate.toFixed(1)),
        ideal: 35,
      },
      {
        name: "Order Bump",
        actual: Number(orderBumpRate.toFixed(1)),
        ideal: 30,
      },
    ];
    
    if (formData.hasUpsell) {
      data.push({
        name: "Upsell Rate",
        actual: Number(upsellRate.toFixed(1)),
        ideal: 5,
      });
    }
    
    return data;
  };

  return (
    <div className="overflow-x-auto mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">ROI</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analyses.map((analysis) => {
            const formData = analysis.form_data;
            const diagnostics = analysis.diagnostics;
            const date = new Date(analysis.created_at);
            const formattedDate = format(date, "PPp", { locale: ptBR });
            
            return (
              <TableRow key={analysis.id}>
                <TableCell className="font-medium">{formattedDate}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(diagnostics.totalRevenue || 0)}
                </TableCell>
                <TableCell className="text-right">
                  {diagnostics.currentROI ? `${diagnostics.currentROI.toFixed(2)}x` : 'N/A'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => onLoadAnalysis(analysis)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleExportPDF(analysis)}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
