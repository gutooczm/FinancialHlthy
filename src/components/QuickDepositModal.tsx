import React, { useState } from 'react';
import { X, Target, Plus, Check } from 'lucide-react';
import { Goal } from '../types';
import { formatCurrency } from '../utils/formatters';

interface QuickDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onDeposit: (goalId: string, amount: number) => void;
}

export const QuickDepositModal: React.FC<QuickDepositModalProps> = ({
  isOpen,
  onClose,
  goal,
  onDeposit,
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    onDeposit(goal.id, val);
    setDepositAmount('');
    setError('');
    onClose();
  };

  const handlePreset = (val: number) => {
    setDepositAmount(val.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Guardar para a Meta
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              {goal.title}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 text-xs space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Já guardado:</span>
            <strong className="text-slate-800">{formatCurrency(goal.currentAmount)}</strong>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Valor alvo:</span>
            <strong className="text-slate-800">{formatCurrency(goal.targetAmount)}</strong>
          </div>
          <div className="flex justify-between text-teal-700 font-semibold pt-1 border-t border-slate-200">
            <span>Falta para alcançar:</span>
            <span>{formatCurrency(remaining)}</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Quanto você conseguiu economizar hoje? (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              autoFocus
              placeholder="Ex: 50.00"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-base focus:bg-white focus:outline-teal-600"
            />
          </div>

          {/* Atalhos Rápidos */}
          <div className="flex gap-2">
            {[20, 50, 100].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePreset(num)}
                className="flex-1 py-1 px-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 rounded-lg text-slate-600 text-xs font-medium transition-colors cursor-pointer"
              >
                + R$ {num}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Confirmar Aporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
