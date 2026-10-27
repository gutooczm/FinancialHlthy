import React, { useState, useEffect } from 'react';
import { X, Wallet, TrendingUp, Info } from 'lucide-react';
import { UserFinancialProfile } from '../types';
import { formatCurrency } from '../utils/formatters';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserFinancialProfile) => void;
  currentProfile: UserFinancialProfile;
}

export const IncomeModal: React.FC<IncomeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProfile,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [extraIncome, setExtraIncome] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMonthlyIncome(currentProfile.monthlyIncome ? currentProfile.monthlyIncome.toString() : '');
      setExtraIncome(currentProfile.extraIncome ? currentProfile.extraIncome.toString() : '');
      setError('');
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const total = (parseFloat(monthlyIncome) || 0) + (parseFloat(extraIncome) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fixo = parseFloat(monthlyIncome) || 0;
    const extra = parseFloat(extraIncome) || 0;

    if (fixo < 0 || extra < 0) {
      setError('Os valores de renda não podem ser negativos.');
      return;
    }

    onSave({
      monthlyIncome: fixo,
      extraIncome: extra,
      lastUpdated: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Minha Renda Mensal
            </h3>
            <p className="text-xs text-slate-500">
              Informe quanto entra no seu bolso para planejarmos seus gastos sem aperto.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Renda Fixa Líquida (Salário ou ganhos habituais) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Ex: 2500,00"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-emerald-600"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dica: Coloque o valor real que cai na sua conta (já com os descontos).
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Renda Extra Estimada (Bicos, vendas, comissões)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 300,00"
              value={extraIncome}
              onChange={(e) => setExtraIncome(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-emerald-900 text-xs">Renda Total do Mês:</span>
            <span className="text-base font-bold text-emerald-700">{formatCurrency(total)}</span>
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Atualizar Renda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
