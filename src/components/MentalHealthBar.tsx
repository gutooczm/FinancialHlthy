import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Heart, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface MentalHealthBarProps {
  totalIncome: number;
  totalSpent: number;
  exceededCategoriesCount: number;
  smallExpensesTotal: number;
  goalsCount: number;
  completedGoalsCount: number;
}

export const MentalHealthBar: React.FC<MentalHealthBarProps> = ({
  totalIncome,
  totalSpent,
  exceededCategoriesCount,
  smallExpensesTotal,
  goalsCount,
  completedGoalsCount,
}) => {
  const remaining = totalIncome - totalSpent;
  const spentPercent = totalIncome > 0 ? (totalSpent / totalIncome) * 100 : 0;

  // Determinação do estado de saúde mental financeira
  let healthState: 'tranquilo' | 'atencao' | 'alerta' = 'tranquilo';
  let badgeText = 'Equilíbrio e Paz Mental';
  let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let title = 'Sua estabilidade está protegida';
  let message = 'Você está respeitando o que planejou. Isso reduz a ansiedade e mantém seus objetivos no caminho certo.';
  let icon = <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />;

  if (remaining < 0 || spentPercent > 100 || exceededCategoriesCount >= 2) {
    healthState = 'alerta';
    badgeText = 'Alerta de Sobrecarga Financeira';
    badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
    title = 'Respire fundo: gastos além do orçamento';
    message = `Seus gastos ultrapassaram sua renda em ${formatCurrency(Math.abs(remaining))}. Não se culpe: o importante é pausar compras não essenciais hoje para retomar o controle sem estresse.`;
    icon = <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />;
  } else if (spentPercent >= 80 || exceededCategoriesCount === 1) {
    healthState = 'atencao';
    badgeText = 'Atenção aos Próximos Passos';
    badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
    title = 'Você atingiu 80% do seu limite mensal';
    message = `Restam ${formatCurrency(remaining)} para o restante do mês. Dê preferência apenas às necessidades essenciais até virar o ciclo.`;
    icon = <Info className="w-6 h-6 text-amber-600 shrink-0" />;
  }

  return (
    <div className={`p-4 md:p-5 rounded-2xl border transition-all ${
      healthState === 'alerta'
        ? 'bg-rose-50/80 border-rose-200 shadow-sm'
        : healthState === 'atencao'
        ? 'bg-amber-50/70 border-amber-200 shadow-sm'
        : 'bg-emerald-50/70 border-emerald-200/80 shadow-sm'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white shadow-xs">
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-base font-semibold text-slate-800 tracking-tight">
                {title}
              </h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${badgeBg}`}>
                {badgeText}
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Pílulas de Consciência e Saúde */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 text-xs">
          <div className="bg-white/90 px-3 py-2 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
            <span className="text-slate-600 font-medium">Metas:</span>
            <span className="text-slate-900 font-semibold">{completedGoalsCount}/{goalsCount} atingidas</span>
          </div>
          <div className="bg-white/90 px-3 py-2 rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-600 font-medium">Gastos Pequenos:</span>
            <span className="text-slate-900 font-semibold">{formatCurrency(smallExpensesTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
