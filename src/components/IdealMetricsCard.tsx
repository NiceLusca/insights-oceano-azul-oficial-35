
import { Card } from "@/components/ui/card";

interface IdealMetricsCardProps {
  hasUpsell: boolean;
}

export const IdealMetricsCard = ({ hasUpsell }: IdealMetricsCardProps) => {
  return (
    <Card className="p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
      <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center">
        <span className="mr-2">🔵</span>Métricas Ideais
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Conversão da Página de Vendas</p>
          <p className="font-semibold text-gray-900 dark:text-white">40%</p>
        </div>
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Conversão do Checkout</p>
          <p className="font-semibold text-gray-900 dark:text-white">40%</p>
        </div>
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Taxa de Combo</p>
          <p className="font-semibold text-gray-900 dark:text-white">35%</p>
        </div>
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Taxa de Order Bump</p>
          <p className="font-semibold text-gray-900 dark:text-white">30%</p>
        </div>
        {hasUpsell && (
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400">Taxa de Upsell</p>
            <p className="font-semibold text-gray-900 dark:text-white">5%</p>
          </div>
        )}
      </div>
    </Card>
  );
};
