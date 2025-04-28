
import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const explanations = {
  salesPage: {
    title: "Conversão da Página de Vendas",
    description: "Esta é a porcentagem de visitantes que vão da página de vendas para o checkout.",
    tips: [
      "Melhore o copy da página para destacar benefícios",
      "Use depoimentos e provas sociais",
      "Tenha uma oferta clara e convincente",
      "Otimize a velocidade de carregamento da página"
    ]
  },
  checkout: {
    title: "Conversão do Checkout",
    description: "Porcentagem de visitantes do checkout que completam a compra.",
    tips: [
      "Simplifique o processo de checkout",
      "Ofereça múltiplas opções de pagamento",
      "Tenha um design limpo e profissional",
      "Adicione elementos de urgência"
    ]
  },
  combo: {
    title: "Taxa de Combo",
    description: "Porcentagem das vendas que incluem a opção combo.",
    tips: [
      "Destaque a economia ao escolher o combo",
      "Mostre claramente o valor adicional",
      "Use comparação de preços",
      "Crie combos que façam sentido para o cliente"
    ]
  },
  orderBump: {
    title: "Taxa de Order Bump",
    description: "Porcentagem das vendas que incluem um order bump.",
    tips: [
      "Ofereça um produto complementar relevante",
      "Mantenha o preço atrativo",
      "Use copy persuasivo e benefícios claros",
      "Posicione estrategicamente no checkout"
    ]
  },
  upsell: {
    title: "Taxa de Upsell",
    description: "Porcentagem das vendas que incluem um upsell.",
    tips: [
      "Ofereça um produto que complementa a compra inicial",
      "Mantenha o preço do upsell menor que o produto principal",
      "Use copy focado em aumento de valor",
      "Teste diferentes ofertas de upsell"
    ]
  },
  cpc: {
    title: "Custo por Clique (CPC)",
    description: "O quanto você paga, em média, por cada clique em seus anúncios.",
    tips: [
      "Monitore o CPC máximo permitido para seu ROI desejado",
      "Otimize seus anúncios para reduzir o CPC",
      "Melhore o score de qualidade dos seus anúncios"
    ]
  }
};

const MetricsCard = ({ metric, title, description, tips }: { 
  metric: keyof typeof explanations;
  title: string;
  description: string;
  tips: string[];
}) => (
  <div className="mb-6 p-4 border rounded-lg bg-white/50">
    <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
    <p className="text-gray-600 mb-3">{description}</p>
    <div className="space-y-2">
      <h4 className="font-medium text-blue-600">Dicas para melhorar:</h4>
      <ul className="list-disc pl-5 space-y-1">
        {tips.map((tip, index) => (
          <li key={index} className="text-gray-600 text-sm">{tip}</li>
        ))}
      </ul>
    </div>
  </div>
);

export function MetricsExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
        >
          <Info className="h-6 w-6 text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Explicação das Métricas</DrawerTitle>
            <DrawerDescription>
              Entenda cada métrica e descubra como melhorá-las
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 overflow-y-auto max-h-[calc(90vh-180px)]">
            {Object.entries(explanations).map(([key, data]) => (
              <MetricsCard
                key={key}
                metric={key as keyof typeof explanations}
                title={data.title}
                description={data.description}
                tips={data.tips}
              />
            ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
