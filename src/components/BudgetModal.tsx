import React, { useState, useEffect } from 'react';
import { X, Sliders, AlertCircle, Sparkles, Check } from 'lucide-react';
import { ExpenseCategory } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categories: ExpenseCategory[]) => void;
  categories: ExpenseCategory[];
  totalIncome: number;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  totalIncome,
}) => {
  const [localCategories, setLocalCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalCategories(categories.map((c) => ({ ...c })));
    }
  }, [isOpen, categories]);

  if (!isOpen) return null;

  const totalPlanned = localCategories.reduce((sum, c) => sum + (c.budgetLimit || 0), 0);
  const diff = totalIncome - totalPlanned;
  const isOverIncome = diff < 0;

  const handleLimitChange = (id: string, value: string) => {
    const num = parseFloat(value) || 0;
    setLocalCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, budgetLimit: num } : cat))
    );
  };

  // Sugestão automática de plano proporcional com base na renda
  const handleApplyPreset = (type: 'equilibrado' | 'foco_dividas') => {
    if (totalIncome <= 0) return;

    if (type === 'equilibrado') {
      // 50% essenciais, 20% lazer/saúde, 20% metas, 10% imprevistos
      setLocalCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === 'cat_moradia') return { ...cat, budgetLimit: Math.round(totalIncome * 0.35) };
          if (cat.id === 'cat_alimentacao') return { ...cat, budgetLimit: Math.round(totalIncome * 0.25) };
          if (cat.id === 'cat_transporte') return { ...cat, budgetLimit: Math.round(totalIncome * 0.10) };
          if (cat.id === 'cat_saude') return { ...cat, budgetLimit: Math.round(totalIncome * 0.08) };
          if (cat.id === 'cat_lazer') return { ...cat, budgetLimit: Math.round(totalIncome * 0.08) };
          if (cat.id === 'cat_metas') return { ...cat, budgetLimit: Math.round(totalIncome * 0.10) };
          return { ...cat, budgetLimit: Math.round(totalIncome * 0.04) };
        })
      );
    } else {
      // Foco em quitar dívidas: prioridade máxima para metas e corte em lazer
      setLocalCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === 'cat_moradia') return { ...cat, budgetLimit: Math.round(totalIncome * 0.35) };
          if (cat.id === 'cat_alimentacao') return { ...cat, budgetLimit: Math.round(totalIncome * 0.22) };
          if (cat.id === 'cat_transporte') return { ...cat, budgetLimit: Math.round(totalIncome * 0.08) };
          if (cat.id === 'cat_saude') return { ...cat, budgetLimit: Math.round(totalIncome * 0.05) };
          if (cat.id === 'cat_lazer') return { ...cat, budgetLimit: Math.round(totalIncome * 0.05) };
          if (cat.id === 'cat_metas') return { ...cat, budgetLimit: Math.round(totalIncome * 0.22) };
          return { ...cat, budgetLimit: Math.round(totalIncome * 0.03) };
        })
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localCategories);
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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Criar Plano de Gastos Mensal
            </h3>
            <p className="text-xs text-slate-500">
              Defina um teto máximo para cada categoria e mantenha o controle.
            </p>
          </div>
        </div>

        {/* Atalhos com planos inteligentes prontos */}
        {totalIncome > 0 && (
          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Sugestões automáticas baseadas na sua renda ({formatCurrency(totalIncome)}):
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('equilibrado')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
              >
                Plano Equilibrado (Essencial + Metas + Lazer)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('foco_dividas')}
                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg text-teal-800 font-medium transition-colors cursor-pointer"
              >
                Plano Acelerar Quitação de Dívidas
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-2.5">
            {localCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex-1">
                  <span className="font-semibold text-slate-800 text-xs block">
                    {cat.name}
                  </span>
                </div>
                <div className="w-36 flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">R$</span>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    value={cat.budgetLimit || ''}
                    onChange={(e) => handleLimitChange(cat.id, e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold text-xs focus:outline-teal-600"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Planejamento */}
          <div className={`p-3.5 rounded-xl border mt-3 ${
            isOverIncome 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex justify-between items-center text-xs mb-1">
              <span>Total Planejado nas Categorias:</span>
              <strong className="text-sm">{formatCurrency(totalPlanned)}</strong>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>Renda Mensal Disponível:</span>
              <span>{formatCurrency(totalIncome)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-200/60 flex justify-between items-center text-xs font-bold">
              <span>{isOverIncome ? 'Orçamento excede a renda em:' : 'Margem de folga do plano:'}</span>
              <span className={isOverIncome ? 'text-rose-600' : 'text-emerald-700'}>
                {formatCurrency(Math.abs(diff))}
              </span>
            </div>
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Salvar Plano de Gastos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
