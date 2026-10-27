import React from 'react';
import { 
  HeartHandshake, 
  PlusCircle, 
  Target, 
  RotateCcw,
  Sparkles,
  Wallet
} from 'lucide-react';

interface HeaderProps {
  onOpenExpenseModal: () => void;
  onOpenGoalModal: () => void;
  onOpenIncomeModal: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExpenseModal,
  onOpenGoalModal,
  onOpenIncomeModal,
  onResetData,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo e Missão */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm ring-4 ring-emerald-50">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                FINANCIAL<span className="text-emerald-600">Hlthy</span>
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                Paz Financeira
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Controle consciente de gastos e proteção da sua saúde mental
            </p>
          </div>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenIncomeModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            title="Atualizar renda mensal"
          >
            <Wallet className="w-4 h-4 text-slate-500" />
            <span>Renda Mensal</span>
          </button>

          <button
            onClick={onOpenGoalModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4 text-teal-600" />
            <span>Nova Meta</span>
          </button>

          <button
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Gasto</span>
          </button>

          <button
            onClick={onResetData}
            title="Restaurar dados de exemplo"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors ml-1 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
