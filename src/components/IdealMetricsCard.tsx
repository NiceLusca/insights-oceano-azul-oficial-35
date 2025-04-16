
import { Card } from "@/components/ui/card";

interface IdealMetricsCardProps {
  hasUpsell: boolean;
}

export const IdealMetricsCard = ({ hasUpsell }: IdealMetricsCardProps) => {
  return (
    <Card className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl">
      <h2 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
        <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-2">🔵</span>
        Métricas Ideais
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-blue-600 mb-2">Conversão da Página de Vendas</p>
          <p className="font-semibold text-xl text-gray-900">40%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-blue-600 mb-2">Conversão do Checkout</p>
          <p className="font-semibold text-xl text-gray-900">40%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-blue-600 mb-2">Taxa de Combo</p>
          <p className="font-semibold text-xl text-gray-900">35%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-blue-600 mb-2">Taxa de Order Bump</p>
          <p className="font-semibold text-xl text-gray-900">30%</p>
        </div>
        {hasUpsell && (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-blue-600 mb-2">Taxa de Upsell</p>
            <p className="font-semibold text-xl text-gray-900">5%</p>
          </div>
        )}
      </div>
    </Card>
  );
};
