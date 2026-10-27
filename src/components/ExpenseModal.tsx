import React, { useState, useEffect } from 'react';
import { 
  X, 
  Receipt, 
  AlertTriangle, 
  Coins, 
  Banknote, 
  Sparkles,
  HeartCrack,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseSize } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  categories: ExpenseCategory[];
  currentExpenses: Expense[];
  monthlyIncome: number;
  smallExpenseThreshold: number;
}

const EMOTIONAL_TRIGGERS = [
  'Necessidade essencial',
  'Recompensa após dia cansativo',
  'Impulso por ansiedade/tédio',
  'Lazer consciente planejado',
  'Emergência/Imprevisto',
  'Outro motivo',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  currentExpenses,
  monthlyIncome,
  smallExpenseThreshold,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [size, setSize] = useState<ExpenseSize>('pequeno');
  const [isManualSize, setIsManualSize] = useState(false);
  const [emotionalTrigger, setEmotionalTrigger] = useState(EMOTIONAL_TRIGGERS[0]);
  const [error, setError] = useState('');

  // Auto-detect size when amount changes unless manually overridden
  useEffect(() => {
    const num = parseFloat(amount);
    if (!isManualSize && !isNaN(num)) {
      setSize(num <= smallExpenseThreshold ? 'pequeno' : 'grande');
    }
  }, [amount, smallExpenseThreshold, isManualSize]);

  useEffect(() => {
    if (isOpen) {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId(categories[0]?.id || '');
      setSize('pequeno');
      setIsManualSize(false);
      setEmotionalTrigger(EMOTIONAL_TRIGGERS[0]);
      setError('');
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  // Cálculo de impacto no orçamento para o Alarme de Gasto Excessivo
  const numericAmount = parseFloat(amount) || 0;
  const currentTotalSpent = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentRemaining = monthlyIncome - currentTotalSpent;
  const willExceedMonthlyIncome = numericAmount > currentRemaining && currentRemaining >= 0;
  const alreadyInDeficit = currentRemaining < 0;

  // Checar limite da categoria selecionada
  const selectedCat = categories.find((c) => c.id === categoryId);
  const categorySpent = currentExpenses
    .filter((e) => e.categoryId === categoryId)
    .reduce((sum, e) => sum + e.amount, 0);
  const categoryBudget = selectedCat ? selectedCat.budgetLimit : 0;
  const categoryRemaining = categoryBudget - categorySpent;
  const willExceedCategory = categoryBudget > 0 && numericAmount > categoryRemaining;

  const isExcessive = numericAmount > 0 && (willExceedMonthlyIncome || willExceedCategory || alreadyInDeficit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Por favor, informe no que você gastou.');
      return;
    }
    if (numericAmount <= 0) {
      setError('O valor do gasto precisa ser maior que zero.');
      return;
    }
    if (!categoryId) {
      setError('Selecione uma categoria.');
      return;
    }

    onSave({
      description: description.trim(),
      amount: numericAmount,
      date,
      categoryId,
      size,
      emotionalTrigger,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Registrar Gasto Diário
            </h3>
            <p className="text-xs text-slate-500">
              Cada anotação traz clareza e impede o descontrole financeiro.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* ALARME DE GASTO EXCESSIVO EM TEMPO REAL */}
        {isExcessive && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wide text-rose-700 flex items-center gap-1.5">
                  Alarme de Proteção Financeira
                </h4>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  {willExceedMonthlyIncome && (
                    <span>
                      Este valor de <strong>{formatCurrency(numericAmount)}</strong> ultrapassa seu saldo livre restante ({formatCurrency(currentRemaining)}).
                    </span>
                  )}
                  {willExceedCategory && !willExceedMonthlyIncome && (
                    <span>
                      Este valor ultrapassará o limite estipulado para <strong>{selectedCat?.name}</strong> em {formatCurrency(numericAmount - categoryRemaining)}.
                    </span>
                  )}
                  {alreadyInDeficit && (
                    <span>
                      Você já está em saldo negativo este mês. Reflita se este gasto pode ser evitado para preservar sua paz.
                    </span>
                  )}
                </p>
                <div className="mt-2 text-[11px] font-medium text-rose-700 bg-white/70 p-2 rounded-lg border border-rose-200">
                  💡 <em>Respire fundo:</em> Antes de confirmar, pergunte-se: "Isso é indispensável para as próximas 48 horas?".
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Descrição */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              O que você comprou ou pagou? *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Café na padaria, Aluguel, Farmácia, Lanche rápido..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data do Gasto *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Categoria do Plano de Gastos *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-emerald-600 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (Teto: {formatCurrency(cat.budgetLimit)})
                </option>
              ))}
            </select>
          </div>

          {/* Classificação: Pequeno ou Grande */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Classificação na Grade Consciente
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSize('pequeno');
                  setIsManualSize(true);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  size === 'pequeno'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-1 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Pequeno (≤ {formatCurrency(smallExpenseThreshold)})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSize('grande');
                  setIsManualSize(true);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  size === 'grande'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold ring-1 ring-indigo-300'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4 text-indigo-600" />
                <span>Grande (&gt; {formatCurrency(smallExpenseThreshold)})</span>
              </button>
            </div>
          </div>

          {/* Gatilho Emocional / Motivo Consciente */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              O que motivou esse gasto? (Saúde Mental & Consciência)
            </label>
            <select
              value={emotionalTrigger}
              onChange={(e) => setEmotionalTrigger(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-emerald-600 cursor-pointer"
            >
              {EMOTIONAL_TRIGGERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Identificar o sentimento por trás do gasto ajuda a evitar compras automáticas de alívio momentâneo.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 font-semibold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                isExcessive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isExcessive ? 'Confirmar Mesmo com Alerta' : 'Salvar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
