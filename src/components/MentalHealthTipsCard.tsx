import React, { useState } from 'react';
import { 
  Heart, 
  Brain, 
  Sparkles, 
  ShieldAlert, 
  Smile, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const MentalHealthTipsCard: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const tips = [
    {
      title: 'A Regra dos 3 Dias para Evitar Impulso',
      short: 'Viu algo que quer comprar que não está no seu plano de gastos?',
      full: 'Espere 72 horas antes de passar o cartão. Se após 3 dias a necessidade ainda existir e o dinheiro couber no seu saldo livre, compre conscientemente. Em 80% das vezes, a vontade diminui porque era apenas um alívio momentâneo para estresse ou tédio.',
      icon: Brain,
    },
    {
      title: 'Dívida não define seu valor como pessoa',
      short: 'Sentir vergonha ou medo paralisa as suas atitudes financeiras.',
      full: 'O primeiro passo para a paz mental é encarar os números sem autocrítica destrutiva. O FINANCIALHlthy existe para te acolher: liste cada despesa, entenda o seu padrão e comemore pequenas vitórias, como passar a semana dentro do planejado.',
      icon: Heart,
    },
    {
      title: 'Cuidado com a ilusão do "é só R$ 10"',
      short: 'Pequenos gastos frequentes somam quantias impressionantes.',
      full: 'Um café de R$ 12 ou uma corrida de R$ 15 todos os dias úteis somam mais de R$ 250 no mês — o suficiente para acelerar o pagamento de uma fatura inteira. Acompanhe a nossa Grade de Gastos Pequenos para enxergar essa soma sem medo.',
      icon: ShieldAlert,
    },
    {
      title: 'Celebre metas sem culpa',
      short: 'Economizar não significa se privar de tudo.',
      full: 'Ter uma verba reservada no plano para "Lazer Consciente" protege sua mente. Quando você se permite um agrado planejado, diminui drasticamente a chance de ter uma recaída de compras descontroladas.',
      icon: Smile,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-teal-50/60 to-emerald-50/60 rounded-2xl border border-teal-200/70 p-5 shadow-xs">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            Pílulas de Saúde Mental & Gastos Conscientes
          </h3>
          <p className="text-xs text-slate-600">
            Dicas práticas e acolhedoras para transformar sua relação com o dinheiro.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {tips.map((tip, index) => {
          const isExpanded = expandedIndex === index;
          const IconComp = tip.icon;

          return (
            <div
              key={index}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="bg-white/80 hover:bg-white p-3.5 rounded-xl border border-teal-100 shadow-2xs transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {tip.title}
                  </h4>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </div>

              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {isExpanded ? tip.full : tip.short}
              </p>

              <span className="text-[10px] text-teal-700 font-semibold mt-1 inline-block">
                {isExpanded ? 'Ver menos' : 'Toque para ler a reflexão completa →'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
