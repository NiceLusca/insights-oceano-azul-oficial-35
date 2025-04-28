
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MetricCardProps {
  title: string;
  description: string;
  tips: string[];
}

function MetricCard({ title, description, tips }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 mb-4">
      <h4 className="font-semibold text-lg text-blue-700 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      <div className="space-y-1">
        <h5 className="font-medium text-sm text-blue-600">Como melhorar:</h5>
        <ul className="list-disc list-inside space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-xs text-slate-700">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const metrics: Record<string, MetricCardProps[]> = {
  conversao: [
    {
      title: "Conversão da Página de Vendas",
      description: "Esta métrica indica quantos visitantes da sua página de vendas seguem para o checkout. O ideal é acima de 40%.",
      tips: [
        "Melhore os elementos de persuasão na página",
        "Use depoimentos e provas sociais",
        "Simplifique o caminho para o checkout",
        "Teste diferentes CTA (chamadas para ação)"
      ]
    },
    {
      title: "Conversão do Checkout",
      description: "Esta métrica mostra quantas pessoas que iniciaram o checkout concluíram a compra. O ideal é acima de 40%.",
      tips: [
        "Simplifique o processo de checkout",
        "Ofereça múltiplas opções de pagamento",
        "Implemente elementos de confiança e segurança",
        "Reduza os campos de formulário necessários"
      ]
    },
    {
      title: "Conversão Final (Funil)",
      description: "Esta é a métrica global do seu funil, que mostra o percentual de visitantes que se transformam em clientes.",
      tips: [
        "Otimize cada etapa do funil individualmente",
        "Identifique e corrija pontos de abandono",
        "Teste diferentes sequências de venda",
        "Implemente retargeting para visitantes que não converteram"
      ]
    },
  ],
  ofertas: [
    {
      title: "Taxa de Combo",
      description: "Mostra quantos clientes escolheram a oferta combo em vez da oferta básica. O ideal é acima de 35%.",
      tips: [
        "Destaque claramente o valor adicional do combo",
        "Use técnicas de ancoragem de preço",
        "Faça com que o combo pareça a opção mais lógica",
        "Teste diferentes estruturas de preço e economia"
      ]
    },
    {
      title: "Taxa de Order Bump",
      description: "Indica quantos clientes adicionaram o order bump durante o checkout. O ideal é acima de 30%.",
      tips: [
        "Escolha produtos complementares relevantes",
        "Destaque o valor adicional com clareza",
        "Use um preço atrativo e com desconto",
        "Teste diferentes posições do order bump no checkout"
      ]
    },
    {
      title: "Taxa de Upsell",
      description: "Mostra quantos clientes aceitaram a oferta de upsell após a compra principal. O ideal é acima de 5%.",
      tips: [
        "Ofereça um produto que melhore a experiência do produto principal",
        "Use gatilhos de escassez e urgência",
        "Teste diferentes preços e estruturas de oferta",
        "Destaque os benefícios específicos do upsell"
      ]
    }
  ],
  financeiros: [
    {
      title: "ROI (Retorno sobre Investimento)",
      description: "Indica quanto você está ganhando para cada real investido em publicidade.",
      tips: [
        "Otimize suas campanhas publicitárias regularmente",
        "Foque nos canais com melhor performance",
        "Aumente o valor médio de pedido com ofertas adicionais",
        "Reduza o CPC e CPM com melhores anúncios"
      ]
    },
    {
      title: "CPC (Custo Por Clique)",
      description: "O valor médio que você paga por cada clique nos seus anúncios.",
      tips: [
        "Melhore a qualidade dos seus anúncios",
        "Otimize seus textos e imagens para maior CTR",
        "Utilize palavras-chave mais específicas e relevantes",
        "Teste diferentes plataformas de anúncios"
      ]
    }
  ]
};

export function MetricsExplainer() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("conversao");
  
  const getTabClass = (tab: string) => {
    return cn(
      "text-xs md:text-sm px-3 py-1.5 transition-all",
      activeTab === tab ? "text-blue-700" : "text-slate-600"
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
        >
          <Info className="h-6 w-6 text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center text-blue-700 text-xl">
            Entenda suas Métricas
          </DrawerTitle>
          <DrawerDescription className="text-center">
            Explicações e dicas práticas para otimizar seu funil
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 sticky top-0 bg-white z-10">
              <TabsTrigger value="conversao" className={getTabClass("conversao")}>
                Conversão
              </TabsTrigger>
              <TabsTrigger value="ofertas" className={getTabClass("ofertas")}>
                Ofertas
              </TabsTrigger>
              <TabsTrigger value="financeiros" className={getTabClass("financeiros")}>
                Financeiros
              </TabsTrigger>
            </TabsList>
            
            <div className="overflow-y-auto pr-1 pb-4">
              {Object.keys(metrics).map((category) => (
                <TabsContent key={category} value={category} className="space-y-2 mt-0">
                  {metrics[category].map((metric, i) => (
                    <MetricCard
                      key={i}
                      title={metric.title}
                      description={metric.description}
                      tips={metric.tips}
                    />
                  ))}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        
        <DrawerFooter className="border-t pt-4 mt-0">
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
