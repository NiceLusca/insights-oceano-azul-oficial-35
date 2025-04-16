
import { Card } from "@/components/ui/card";

interface IdealMetricsCardProps {
  hasUpsell: boolean;
}

export const IdealMetricsCard = ({ hasUpsell }: IdealMetricsCardProps) => {
  return (
    <Card className="p-6 bg-blue-50/50">
      <h2 className="text-xl font-semibold text-blue-800 mb-4">
        🔵 Métricas Ideais
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-blue-600">Conversão da Página de Vendas</p>
          <p className="font-semibold">40%</p>
        </div>
        <div>
          <p className="text-sm text-blue-600">Conversão do Checkout</p>
          <p className="font-semibold">40%</p>
        </div>
        <div>
          <p className="text-sm text-blue-600">Taxa de Combo</p>
          <p className="font-semibold">35%</p>
        </div>
        <div>
          <p className="text-sm text-blue-600">Taxa de Order Bump</p>
          <p className="font-semibold">30%</p>
        </div>
        {hasUpsell && (
          <div>
            <p className="text-sm text-blue-600">Taxa de Upsell</p>
            <p className="font-semibold">5%</p>
          </div>
        )}
      </div>
    </Card>
  );
};
