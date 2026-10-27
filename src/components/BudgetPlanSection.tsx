import React from 'react';
import { 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  Home, 
  ShoppingBag, 
  Car, 
  HeartPulse, 
  Smile, 
  Target, 
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { ExpenseCategory, Expense } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BudgetPlanSectionProps {
  categories: ExpenseCategory[];
  expenses: Expense[];
  onOpenBudgetModal: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  ShoppingBag,
  Car,
  HeartPulse,
  Smile,
  Target,
  HelpCircle,
};

export const BudgetPlanSection: React.FC<BudgetPlanSectionProps> = ({
  categories,
  expenses,
  onOpenBudgetModal,
}) => {
  // Calcular gasto real por categoria
  const spentByCategory = categories.reduce((acc, cat) => {
    const total = expenses
      .filter((exp) => exp.categoryId === cat.id)
      .reduce((sum, exp) => sum + exp.amount, 0);
    acc[cat.id] = total;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-600" />
            Plano de Gastos Conscientes
          </h2>
          <p className="text-xs text-slate-500">
            Defina limites realistas para cada área da sua vida e evite surpresas no final do mês.
          </p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors w-fit cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          Editar Limites do Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2">
        {categories.map((cat) => {
          const spent = spentByCategory[cat.id] || 0;
          const limit = cat.budgetLimit;
          const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
          const isOver = limit > 0 && spent > limit;
          const isNear = limit > 0 && spent >= limit * 0.8 && !isOver;

          const IconComponent = ICON_MAP[cat.iconName] || HelpCircle;

          let statusBadgeClass = 'bg-slate-100 text-slate-700';
          let statusText = `${percentage}% utilizado`;

          if (isOver) {
            statusBadgeClass = 'bg-rose-100 text-rose-700 border border-rose-200 font-semibold';
            statusText = `Excedeu em ${formatCurrency(spent - limit)}`;
          } else if (isNear) {
            statusBadgeClass = 'bg-amber-100 text-amber-800 border border-amber-200 font-medium';
            statusText = `Atenção: ${percentage}% utilizado`;
          } else if (limit > 0) {
            statusBadgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
          }

          return (
            <div
              key={cat.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isOver
                  ? 'bg-rose-50/40 border-rose-200'
                  : isNear
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-white shadow-2xs border border-slate-200/60 ${
                    isOver ? 'text-rose-600' : isNear ? 'text-amber-600' : 'text-slate-700'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 leading-tight">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Limite: {formatCurrency(limit)}
                    </span>
                  </div>
                </div>

                {isOver && (
                  <span title="Gasto excedido!" className="p-1 rounded-full bg-rose-100 text-rose-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                )}
                {!isOver && percentage > 0 && percentage <= 100 && (
                  <span className="p-1 text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Barra de Progresso do Limite */}
              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOver
                      ? 'bg-rose-500'
                      : isNear
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs mt-2">
                <span className="font-semibold text-slate-700">
                  Gasto: {formatCurrency(spent)}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusBadgeClass}`}>
                  {statusText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
