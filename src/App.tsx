import React, { useState, useEffect } from 'react';
import { 
  FinancialData, 
  Goal, 
  Expense, 
  ExpenseCategory, 
  UserFinancialProfile 
} from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { MentalHealthBar } from './components/MentalHealthBar';
import { IncomeBudgetSection } from './components/IncomeBudgetSection';
import { BudgetPlanSection } from './components/BudgetPlanSection';
import { SmallBigExpensesGrid } from './components/SmallBigExpensesGrid';
import { GoalsSection } from './components/GoalsSection';
import { DailyExpensesSection } from './components/DailyExpensesSection';
import { MentalHealthTipsCard } from './components/MentalHealthTipsCard';
import { GoalModal } from './components/GoalModal';
import { ExpenseModal } from './components/ExpenseModal';
import { IncomeModal } from './components/IncomeModal';
import { BudgetModal } from './components/BudgetModal';
import { QuickDepositModal } from './components/QuickDepositModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export default function App() {
  const [data, setData] = useState<FinancialData>(() => StorageService.loadData());

  // Estado dos Modais
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<Goal | null>(null);

  // Confirmações de exclusão
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Notificação toast temporária
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Salvar no localStorage sempre que 'data' mudar
  useEffect(() => {
    StorageService.saveData(data);
  }, [data]);

  // Cálculos Gerais do Mês
  const totalIncome = data.profile.monthlyIncome + (data.profile.extraIncome || 0);
  const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPlannedBudget = data.categories.reduce((sum, c) => sum + (c.budgetLimit || 0), 0);

  // Gastos Pequenos Totais
  const smallExpensesTotal = data.expenses
    .filter((e) => e.size === 'pequeno' || e.amount <= data.smallExpenseThreshold)
    .reduce((sum, e) => sum + e.amount, 0);

  // Categorias estouradas
  const exceededCategoriesCount = data.categories.filter((cat) => {
    const spentInCat = data.expenses
      .filter((e) => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return cat.budgetLimit > 0 && spentInCat > cat.budgetLimit;
  }).length;

  const completedGoalsCount = data.goals.filter((g) => g.status === 'Concluída').length;

  // Handlers para Metas
  const handleSaveGoal = (goalData: Omit<Goal, 'id' | 'createdAt'> & { id?: string }) => {
    if (goalData.id) {
      // Editar
      setData((prev) => ({
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === goalData.id
            ? {
                ...g,
                ...goalData,
                status: goalData.currentAmount >= goalData.targetAmount ? 'Concluída' : goalData.status,
              }
            : g
        ),
      }));
      showToast('Meta atualizada com sucesso!');
    } else {
      // Criar nova
      const newGoal: Goal = {
        id: `goal_${Date.now()}`,
        title: goalData.title,
        description: goalData.description,
        targetAmount: goalData.targetAmount,
        currentAmount: goalData.currentAmount,
        deadline: goalData.deadline,
        status: goalData.currentAmount >= goalData.targetAmount ? 'Concluída' : goalData.status,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({
        ...prev,
        goals: [newGoal, ...prev.goals],
      }));
      showToast('Nova meta cadastrada! Dê um passo de cada vez.');
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
    showToast('Meta removida.');
  };

  const handleQuickDeposit = (goalId: string, amount: number) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id === goalId) {
          const newCurrent = g.currentAmount + amount;
          const isDone = newCurrent >= g.targetAmount;
          return {
            ...g,
            currentAmount: newCurrent,
            status: isDone ? 'Concluída' : g.status,
          };
        }
        return g;
      }),
    }));
    showToast(`Parabéns! Você guardou R$ ${amount.toFixed(2)} para sua meta.`);
  };

  // Handlers para Despesas Diárias
  const handleSaveExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses],
    }));
    showToast('Gasto registrado no diário com sucesso.');
  };

  const handleDeleteExpense = (expenseId: string) => {
    setData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
    showToast('Gasto excluído.');
  };

  // Handlers para Perfil e Categorias
  const handleSaveProfile = (newProfile: UserFinancialProfile) => {
    setData((prev) => ({
      ...prev,
      profile: newProfile,
    }));
    showToast('Renda atualizada com sucesso.');
  };

  const handleSaveCategories = (updatedCategories: ExpenseCategory[]) => {
    setData((prev) => ({
      ...prev,
      categories: updatedCategories,
    }));
    showToast('Plano de gastos salvo.');
  };

  const handleUpdateSmallThreshold = (newVal: number) => {
    setData((prev) => ({
      ...prev,
      smallExpenseThreshold: newVal,
    }));
    showToast(`Limite de gasto pequeno atualizado para R$ ${newVal.toFixed(2)}.`);
  };

  const handleResetData = () => {
    const fresh = StorageService.resetToDefault();
    setData(fresh);
    showToast('Dados de exemplo restaurados.');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast de Notificação Acolhedor */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        onOpenGoalModal={() => {
          setEditingGoal(null);
          setIsGoalModalOpen(true);
        }}
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
        onResetData={() => setIsResetConfirmOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Barra de Saúde Mental & Estabilidade */}
        <MentalHealthBar
          totalIncome={totalIncome}
          totalSpent={totalSpent}
          exceededCategoriesCount={exceededCategoriesCount}
          smallExpensesTotal={smallExpensesTotal}
          goalsCount={data.goals.length}
          completedGoalsCount={completedGoalsCount}
        />

        {/* Visão Geral: Renda e Saldo */}
        <IncomeBudgetSection
          profile={data.profile}
          totalSpent={totalSpent}
          totalPlannedBudget={totalPlannedBudget}
          onEditIncome={() => setIsIncomeModalOpen(true)}
        />

        {/* Grade de Gastos Pequenos vs. Grandes (Requisito chave) */}
        <SmallBigExpensesGrid
          expenses={data.expenses}
          categories={data.categories}
          smallExpenseThreshold={data.smallExpenseThreshold}
          onUpdateThreshold={handleUpdateSmallThreshold}
          onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
        />

        {/* Plano de Gastos Conscientes por Categoria */}
        <BudgetPlanSection
          categories={data.categories}
          expenses={data.expenses}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />

        {/* Seção de Metas (Listar, Criar, Editar, Excluir, Contador, Cartões) */}
        <GoalsSection
          goals={data.goals}
          onOpenCreateGoal={() => {
            setEditingGoal(null);
            setIsGoalModalOpen(true);
          }}
          onEditGoal={(goal) => {
            setEditingGoal(goal);
            setIsGoalModalOpen(true);
          }}
          onDeleteGoal={(id) => setDeleteGoalId(id)}
          onQuickDeposit={(goal) => setDepositGoal(goal)}
        />

        {/* Diário de Gastos Diários */}
        <DailyExpensesSection
          expenses={data.expenses}
          categories={data.categories}
          onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
          onDeleteExpense={(id) => setDeleteExpenseId(id)}
        />

        {/* Dicas e Pílulas de Saúde Mental Financeira */}
        <MentalHealthTipsCard />
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>FINANCIALHlthy</strong> — Cuidando do seu dinheiro e da sua mente com gastos conscientes.
          </p>
          <p className="text-slate-400">
            Seus dados são salvos com privacidade no seu próprio navegador (localStorage).
          </p>
        </div>
      </footer>

      {/* MODAIS INTERATIVOS */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        categories={data.categories}
        currentExpenses={data.expenses}
        monthlyIncome={totalIncome}
        smallExpenseThreshold={data.smallExpenseThreshold}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSave={handleSaveProfile}
        currentProfile={data.profile}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveCategories}
        categories={data.categories}
        totalIncome={totalIncome}
      />

      <QuickDepositModal
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        goal={depositGoal}
        onDeposit={handleQuickDeposit}
      />

      {/* Confirmação de Exclusão de Meta */}
      <DeleteConfirmModal
        isOpen={!!deleteGoalId}
        title="Excluir Meta?"
        message="Tem certeza que deseja remover esta meta? Esse registro será apagado do seu dispositivo."
        confirmLabel="Sim, excluir meta"
        onConfirm={() => {
          if (deleteGoalId) handleDeleteGoal(deleteGoalId);
          setDeleteGoalId(null);
        }}
        onClose={() => setDeleteGoalId(null)}
      />

      {/* Confirmação de Exclusão de Gasto */}
      <DeleteConfirmModal
        isOpen={!!deleteExpenseId}
        title="Excluir Lançamento de Gasto?"
        message="Tem certeza que deseja apagar este gasto? O saldo disponível será recalculado automaticamente."
        confirmLabel="Sim, excluir gasto"
        onConfirm={() => {
          if (deleteExpenseId) handleDeleteExpense(deleteExpenseId);
          setDeleteExpenseId(null);
        }}
        onClose={() => setDeleteExpenseId(null)}
      />

      {/* Confirmação de Reset de Dados */}
      <DeleteConfirmModal
        isOpen={isResetConfirmOpen}
        title="Restaurar Dados de Exemplo?"
        message="Isso substituirá suas alterações pelos exemplos demonstrativos padrão do aplicativo. Deseja continuar?"
        confirmLabel="Restaurar exemplos"
        cancelLabel="Manter meus dados"
        onConfirm={() => {
          handleResetData();
          setIsResetConfirmOpen(false);
        }}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
