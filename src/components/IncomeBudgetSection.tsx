import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Edit3,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { UserFinancialProfile } from '../types';

interface IncomeBudgetSectionProps {
  profile: UserFinancialProfile;
  totalSpent: number;
  totalPlannedBudget: number;
  onEditIncome: () => void;
}

export const IncomeBudgetSection: React.FC<IncomeBudgetSectionProps> = ({
  profile,
  totalSpent,
  totalPlannedBudget,
  onEditIncome,
}) => {
  const totalIncome = profile.monthlyIncome + (profile.extraIncome || 0);
  const remainingReal = totalIncome - totalSpent;
  const isDeficit = remainingReal < 0;
  const percentUsed = totalIncome > 0 ? Math.min(Math.round((totalSpent / totalIncome) * 100), 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            Visão Geral do Seu Dinheiro
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhe o equilíbrio entre o que entra e o que sai sem complicação.
          </p>
        </div>
        <button
          onClick={onEditIncome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors w-fit cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Ajustar Minha Renda
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Renda Mensal Total */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Renda Mensal Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalIncome)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
            <span>Fixo: {formatCurrency(profile.monthlyIncome)}</span>
            {profile.extraIncome > 0 && (
              <span className="text-emerald-600 font-medium">+ Extras: {formatCurrency(profile.extraIncome)}</span>
            )}
          </div>
        </div>

        {/* Card 2: Total Gasto no Mês */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Gasto Real</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalSpent)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Comprometeu <span className="font-semibold text-slate-700">{percentUsed}%</span> da sua renda
          </div>
        </div>

        {/* Card 3: Saldo Disponível Restante */}
        <div className={`rounded-xl p-4 border flex flex-col justify-between transition-colors ${
          isDeficit 
            ? 'bg-rose-50/90 border-rose-200 text-rose-900' 
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center justify-between text-xs font-medium mb-1">
            <span className={isDeficit ? 'text-rose-700' : 'text-emerald-700'}>
              {isDeficit ? 'Orçamento Estourado' : 'Saldo Livre Restante'}
            </span>
            {isDeficit ? (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            ) : (
              <PiggyBank className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isDeficit ? 'text-rose-700' : 'text-emerald-700'
          }`}>
            {formatCurrency(remainingReal)}
          </div>
          <div className="text-[11px] mt-2 font-medium opacity-90">
            {isDeficit 
              ? 'Atenção: corte gastos extras imediatamente.' 
              : 'Disponível para manter a tranquilidade do mês.'}
          </div>
        </div>

        {/* Card 4: Plano Orçado vs Renda */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Plano de Gastos Teto</span>
            <Wallet className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {formatCurrency(totalPlannedBudget)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            {totalPlannedBudget > totalIncome ? (
              <span className="text-amber-600 font-medium">Plano maior que renda em {formatCurrency(totalPlannedBudget - totalIncome)}</span>
            ) : (
              <span className="text-teal-700 font-medium">Margem de segurança: {formatCurrency(totalIncome - totalPlannedBudget)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
