export type GoalStatus = 'Não iniciada' | 'Em andamento' | 'Pausada' | 'Concluída';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  status: GoalStatus;
  category?: string;
  createdAt: string;
}

export type ExpenseSize = 'pequeno' | 'grande';

export interface ExpenseCategory {
  id: string;
  name: string;
  iconName: string;
  budgetLimit: number; // Limite planejado em R$
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  categoryId: string;
  size: ExpenseSize; // 'pequeno' ou 'grande'
  emotionalTrigger?: string; // ex: 'Necessidade real', 'Impulso/Estresse', 'Recompensa', 'Inesperado'
  notes?: string;
  createdAt: string;
}

export interface UserFinancialProfile {
  monthlyIncome: number;
  extraIncome: number;
  lastUpdated: string;
}

export interface FinancialData {
  profile: UserFinancialProfile;
  categories: ExpenseCategory[];
  expenses: Expense[];
  goals: Goal[];
  smallExpenseThreshold: number; // Limite que define pequeno vs grande (padrão R$ 50)
}
