import React, { useState } from 'react';
import { 
  Columns, 
  Coins, 
  Banknote, 
  Sparkles, 
  TrendingUp, 
  Info,
  Calendar,
  Tag,
  SlidersHorizontal
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface SmallBigExpensesGridProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  smallExpenseThreshold: number;
  onUpdateThreshold: (newVal: number) => void;
  onOpenExpenseModal: () => void;
}

export const SmallBigExpensesGrid: React.FC<SmallBigExpensesGridProps> = ({
  expenses,
  categories,
  smallExpenseThreshold,
  onUpdateThreshold,
  onOpenExpenseModal,
}) => {
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdInput, setThresholdInput] = useState(smallExpenseThreshold.toString());

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>);

  // Separação de pequenos vs grandes com base na classificação ou valor
  const smallExpenses = expenses.filter(
    (e) => e.size === 'pequeno' || e.amount <= smallExpenseThreshold
  );
  const bigExpenses = expenses.filter(
    (e) => e.size === 'grande' && e.amount > smallExpenseThreshold
  );

  const smallTotal = smallExpenses.reduce((sum, e) => sum + e.amount, 0);
  const bigTotal = bigExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalAll = smallTotal + bigTotal;

  const smallPercent = totalAll > 0 ? Math.round((smallTotal / totalAll) * 100) : 0;
  const bigPercent = totalAll > 0 ? Math.round((bigTotal / totalAll) * 100) : 0;

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(thresholdInput);
    if (!isNaN(val) && val > 0) {
      onUpdateThreshold(val);
      setIsEditingThreshold(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {/* Cabeçalho da Grade */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Columns className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Grade Consciente: Gastos Pequenos vs. Grandes
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare o impacto dos microgastos diários (“efeito formiguinha”) com as grandes despesas estruturais.
          </p>
        </div>

        {/* Ajuste do Limite de Pequeno Gasto */}
        <div className="flex items-center gap-2 text-xs">
          {isEditingThreshold ? (
            <form onSubmit={handleSaveThreshold} className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium">Até R$:</span>
              <input
                type="number"
                step="5"
                min="5"
                max="500"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-emerald-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 cursor-pointer"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingThreshold(false)}
                className="px-2 py-1 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80">
              <span className="text-slate-600">
                Pequeno gasto: até <strong className="text-slate-900">{formatCurrency(smallExpenseThreshold)}</strong>
              </span>
              <button
                onClick={() => {
                  setThresholdInput(smallExpenseThreshold.toString());
                  setIsEditingThreshold(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                title="Alterar valor de corte"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Ajustar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Proporção Visual */}
      <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-2">
          <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
            <Coins className="w-4 h-4 text-amber-500" />
            Gastos Pequenos: {formatCurrency(smallTotal)} ({smallPercent}%)
          </span>
          <span className="flex items-center gap-1.5 text-indigo-800 font-semibold">
            <Banknote className="w-4 h-4 text-indigo-600" />
            Gastos Grandes: {formatCurrency(bigTotal)} ({bigPercent}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${smallPercent}%` }}
            title={`Pequenos: ${smallPercent}%`}
          />
          <div
            className="bg-indigo-600 transition-all duration-300"
            style={{ width: `${bigPercent}%` }}
            title={`Grandes: ${bigPercent}%`}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {smallTotal > 0
              ? `Você realizou ${smallExpenses.length} pequenos gastos este mês. Muitas vezes eles passam despercebidos, mas somam ${formatCurrency(smallTotal)}.`
              : 'Nenhum pequeno gasto registrado até o momento.'}
          </span>
        </p>
      </div>

      {/* Grade de 2 Colunas: Pequenos vs Grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Coluna 1: Pequenos Gastos */}
        <div className="bg-amber-50/30 rounded-xl border border-amber-200/70 p-4 flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Gastos Pequenos (≤ {formatCurrency(smallExpenseThreshold)})
                </h3>
                <span className="text-xs text-amber-700 font-medium">
                  {smallExpenses.length} lançamentos • {formatCurrency(smallTotal)}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Formiguinha
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1 flex-1">
            {smallExpenses.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto text-amber-300 mb-2 opacity-80" />
                <p className="text-xs font-medium text-slate-600">
                  Nenhum gasto pequeno registrado.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cafés, lanches e pequenas comprinhas aparecerão aqui.
                </p>
              </div>
            ) : (
              smallExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white p-3 rounded-lg border border-amber-200/50 shadow-2xs hover:shadow-xs transition-shadow flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-800">
                      {expense.description}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateBR(expense.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {categoryMap[expense.categoryId] || 'Geral'}
                      </span>
                    </div>
                    {expense.emotionalTrigger && (
                      <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        Motivo: {expense.emotionalTrigger}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-amber-800">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coluna 2: Grandes Gastos */}
        <div className="bg-indigo-50/20 rounded-xl border border-indigo-200/70 p-4 flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-200/60">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Grandes Gastos (&gt; {formatCurrency(smallExpenseThreshold)})
                </h3>
                <span className="text-xs text-indigo-700 font-medium">
                  {bigExpenses.length} lançamentos • {formatCurrency(bigTotal)}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              Estruturais
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1 flex-1">
            {bigExpenses.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-400">
                <TrendingUp className="w-8 h-8 mx-auto text-indigo-300 mb-2 opacity-80" />
                <p className="text-xs font-medium text-slate-600">
                  Nenhum grande gasto registrado.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Aluguel, compras do mês e faturas maiores aparecerão aqui.
                </p>
              </div>
            ) : (
              bigExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white p-3 rounded-lg border border-indigo-200/50 shadow-2xs hover:shadow-xs transition-shadow flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-800">
                      {expense.description}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateBR(expense.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {categoryMap[expense.categoryId] || 'Geral'}
                      </span>
                    </div>
                    {expense.emotionalTrigger && (
                      <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        Motivo: {expense.emotionalTrigger}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-indigo-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
