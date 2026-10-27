import React from 'react';
import { 
  Target, 
  PlusCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  Plus,
  Sparkles,
  Award,
  HelpCircle
} from 'lucide-react';
import { Goal, GoalStatus } from '../types';
import { formatCurrency, formatDateBR, getStatusBadgeConfig } from '../utils/formatters';

interface GoalsSectionProps {
  goals: Goal[];
  onOpenCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onQuickDeposit: (goal: Goal) => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  onOpenCreateGoal,
  onEditGoal,
  onDeleteGoal,
  onQuickDeposit,
}) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'Concluída').length;
  const inProgressGoals = goals.filter((g) => g.status === 'Em andamento').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {/* Top Header with Goal Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-200/60">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                  Minhas Metas Conscientes
                </h2>
                {/* Exibição da quantidade de metas cadastradas */}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {totalGoals} {totalGoals === 1 ? 'meta cadastrada' : 'metas cadastradas'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Seus sonhos e objetivos traduzidos em passos seguros para a sua mente e bolso.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateGoal}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Criar Nova Meta
          </button>
        </div>
      </div>

      {/* Resumo Rápido das Metas */}
      {totalGoals > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block">Total de Metas</span>
            <span className="text-base font-bold text-slate-800">{totalGoals}</span>
          </div>
          <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200/60">
            <span className="text-blue-700 block">Em andamento</span>
            <span className="text-base font-bold text-blue-900">{inProgressGoals}</span>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60">
            <span className="text-emerald-700 block">Concluídas com Paz</span>
            <span className="text-base font-bold text-emerald-900">{completedGoals}</span>
          </div>
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
            <span className="text-amber-700 block">Pausadas/Ajustando</span>
            <span className="text-base font-bold text-amber-900">
              {goals.filter((g) => g.status === 'Pausada').length}
            </span>
          </div>
        </div>
      )}

      {/* Mensagem Acolhedora quando NÃO houver metas */}
      {totalGoals === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/30">
          <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Nenhuma meta cadastrada no momento
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-4">
            Ter um objetivo claro dá sentido a cada centavo economizado e reduz a ansiedade do dia a dia.
            Pode ser quitar uma dívida, criar uma reserva de segurança ou realizar uma conquista pessoal.
          </p>
          <button
            onClick={onOpenCreateGoal}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Minha Primeira Meta
          </button>
        </div>
      ) : (
        /* Cartões para exibir as metas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 
              ? Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
              : 0;
            const badge = getStatusBadgeConfig(goal.status);
            const isCompleted = goal.status === 'Concluída';

            return (
              <div
                key={goal.id}
                className={`flex flex-col justify-between rounded-xl border p-4.5 transition-all shadow-2xs hover:shadow-xs ${
                  isCompleted 
                    ? 'bg-emerald-50/20 border-emerald-200' 
                    : 'bg-white border-slate-200/80 hover:border-teal-200'
                }`}
              >
                <div>
                  {/* Cabeçalho do Cartão: Título e Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-800 leading-snug line-clamp-2">
                      {goal.title}
                    </h3>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${badge.bg} ${badge.border}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Descrição */}
                  <p className="text-xs text-slate-600 mb-3.5 line-clamp-3 leading-relaxed">
                    {goal.description || 'Sem descrição cadastrada.'}
                  </p>

                  {/* Prazo */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Prazo estimado:</span>
                    <strong className="text-slate-700 font-semibold">{formatDateBR(goal.deadline)}</strong>
                  </div>

                  {/* Valores e Barra de Progresso */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-end text-xs">
                      <span className="text-slate-500">Guardado: <strong className="text-slate-900 font-semibold">{formatCurrency(goal.currentAmount)}</strong></span>
                      <span className="text-slate-500">Alvo: <strong className="text-slate-700">{formatCurrency(goal.targetAmount)}</strong></span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : progress >= 60
                            ? 'bg-teal-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span className={`font-semibold ${isCompleted ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {progress}% alcançado
                      </span>
                      {goal.targetAmount > goal.currentAmount && (
                        <span className="text-slate-400">
                          Faltam {formatCurrency(goal.targetAmount - goal.currentAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ações do Cartão: Guardar Aporte, Editar, Excluir */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onQuickDeposit(goal)}
                    disabled={isCompleted}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isCompleted
                        ? 'text-emerald-700 bg-emerald-50 cursor-default'
                        : 'text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200'
                    }`}
                    title={isCompleted ? 'Meta atingida!' : 'Guardar valor nesta meta'}
                  >
                    {isCompleted ? (
                      <>
                        <Award className="w-3.5 h-3.5" />
                        Atingida
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Guardar Valor
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditGoal(goal)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar meta"
                      aria-label="Editar meta"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir meta"
                      aria-label="Excluir meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
