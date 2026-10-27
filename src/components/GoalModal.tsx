import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Tag, CheckCircle2, DollarSign } from 'lucide-react';
import { Goal, GoalStatus } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: Omit<Goal, 'id' | 'createdAt'> & { id?: string }) => void;
  initialGoal?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('Não iniciada');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setDescription(initialGoal.description);
      setDeadline(initialGoal.deadline);
      setStatus(initialGoal.status);
      setTargetAmount(initialGoal.targetAmount.toString());
      setCurrentAmount(initialGoal.currentAmount.toString());
    } else {
      setTitle('');
      setDescription('');
      // Sugerir prazo de 3 meses a partir de hoje
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3);
      setDeadline(futureDate.toISOString().split('T')[0]);
      setStatus('Em andamento');
      setTargetAmount('');
      setCurrentAmount('0');
    }
    setError('');
  }, [initialGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da meta.');
      return;
    }
    if (!deadline) {
      setError('Por favor, defina um prazo para sua meta.');
      return;
    }

    const targetVal = parseFloat(targetAmount) || 0;
    const currentVal = parseFloat(currentAmount) || 0;

    if (targetVal <= 0) {
      setError('O valor alvo da meta precisa ser maior que zero.');
      return;
    }

    onSave({
      id: initialGoal ? initialGoal.id : undefined,
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
      targetAmount: targetVal,
      currentAmount: currentVal,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialGoal ? 'Editar Meta Financeira' : 'Definir Nova Meta'}
            </h3>
            <p className="text-xs text-slate-500">
              Conecte seus recursos com sonhos concretos que trazem paz.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Título */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título da Meta *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Quitar fatura do cartão, Reserva de emergência, Viagem em família"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-teal-600"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Dica: Dê um nome positivo que lembre o alívio que essa conquista trará.
            </span>
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descrição (Por que essa meta importa para você?)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Dormir tranquilo sem juros acumulando, ter segurança para imprevistos de saúde..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-teal-600"
            />
          </div>

          {/* Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Prazo Desejado *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Atual *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:outline-teal-600"
              >
                <option value="Não iniciada">Não iniciada</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Pausada">Pausada</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>
          </div>

          {/* Valores: Alvo e Já Guardado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Valor Total Alvo (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="Ex: 1500.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:bg-white focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Já Guardado Até Agora (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 250.00"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:bg-white focus:outline-teal-600"
              />
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
              {initialGoal ? 'Atualizar Meta' : 'Salvar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
