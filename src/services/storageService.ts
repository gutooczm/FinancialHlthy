import { FinancialData, Goal, Expense, ExpenseCategory, UserFinancialProfile } from '../types';

const STORAGE_KEY = 'financialhlthy_app_data_v1';

const INITIAL_CATEGORIES: ExpenseCategory[] = [
  { id: 'cat_moradia', name: 'Moradia & Contas Fixas', iconName: 'Home', budgetLimit: 1400, color: 'blue' },
  { id: 'cat_alimentacao', name: 'Alimentação & Supermercado', iconName: 'ShoppingBag', budgetLimit: 800, color: 'emerald' },
  { id: 'cat_transporte', name: 'Transporte & Mobilidade', iconName: 'Car', budgetLimit: 350, color: 'amber' },
  { id: 'cat_saude', name: 'Saúde & Bem-Estar', iconName: 'HeartPulse', budgetLimit: 250, color: 'rose' },
  { id: 'cat_lazer', name: 'Lazer Consciente & Pausas', iconName: 'Smile', budgetLimit: 300, color: 'purple' },
  { id: 'cat_metas', name: 'Reserva & Futuro com Paz', iconName: 'Target', budgetLimit: 400, color: 'teal' },
  { id: 'cat_outros', name: 'Outros & Imprevistos', iconName: 'HelpCircle', budgetLimit: 200, color: 'slate' },
];

const INITIAL_PROFILE: UserFinancialProfile = {
  monthlyIncome: 3500,
  extraIncome: 300,
  lastUpdated: new Date().toISOString(),
};

const getTodayDateString = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    title: 'Quitar dívida do cartão de crédito',
    description: 'Eliminar os juros altos do cartão para dormir sem ansiedade e recuperar minha paz mental.',
    targetAmount: 1800,
    currentAmount: 950,
    deadline: '2026-12-31',
    status: 'Em andamento',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal_2',
    title: 'Reserva de Emergência de 2 Meses',
    description: 'Ter um colchão de segurança na poupança para imprevistos médicos ou reparos sem precisar pedir empréstimo.',
    targetAmount: 4000,
    currentAmount: 1200,
    deadline: '2027-05-30',
    status: 'Em andamento',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal_3',
    title: 'Curso de Especialização Profissional',
    description: 'Capacitação profissional para aumentar minha renda mensal e abrir novas oportunidades de carreira.',
    targetAmount: 650,
    currentAmount: 650,
    deadline: '2026-11-15',
    status: 'Concluída',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    description: 'Aluguel + Condomínio',
    amount: 1250,
    date: getTodayDateString(5),
    categoryId: 'cat_moradia',
    size: 'grande',
    emotionalTrigger: 'Necessidade essencial',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_2',
    description: 'Compras do mês (Supermercado)',
    amount: 480,
    date: getTodayDateString(4),
    categoryId: 'cat_alimentacao',
    size: 'grande',
    emotionalTrigger: 'Necessidade essencial',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_3',
    description: 'Café expresso e pão de queijo no caminho',
    amount: 14.5,
    date: getTodayDateString(2),
    categoryId: 'cat_alimentacao',
    size: 'pequeno',
    emotionalTrigger: 'Recompensa por cansaço',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_4',
    description: 'Recarga do cartão de transporte',
    amount: 100,
    date: getTodayDateString(3),
    categoryId: 'cat_transporte',
    size: 'grande',
    emotionalTrigger: 'Necessidade essencial',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_5',
    description: 'Aplicativo de corrida (Uber na chuva)',
    amount: 22.9,
    date: getTodayDateString(1),
    categoryId: 'cat_transporte',
    size: 'pequeno',
    emotionalTrigger: 'Conveniência emergencial',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_6',
    description: 'Farmácia: Remédio para enxaqueca',
    amount: 38.0,
    date: getTodayDateString(1),
    categoryId: 'cat_saude',
    size: 'pequeno',
    emotionalTrigger: 'Necessidade essencial',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_7',
    description: 'Pizza de sexta-feira com a família',
    amount: 75.0,
    date: getTodayDateString(2),
    categoryId: 'cat_lazer',
    size: 'grande',
    emotionalTrigger: 'Lazer com intenção',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_8',
    description: 'Aporte poupança para a meta',
    amount: 200,
    date: getTodayDateString(0),
    categoryId: 'cat_metas',
    size: 'grande',
    emotionalTrigger: 'Investimento em tranquilidade',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp_9',
    description: 'Doce após o almoço',
    amount: 8.5,
    date: getTodayDateString(0),
    categoryId: 'cat_alimentacao',
    size: 'pequeno',
    emotionalTrigger: 'Impulso/Ansiedade',
    createdAt: new Date().toISOString(),
  },
];

export const StorageService = {
  getInitialData(): FinancialData {
    return {
      profile: INITIAL_PROFILE,
      categories: INITIAL_CATEGORIES,
      expenses: INITIAL_EXPENSES,
      goals: INITIAL_GOALS,
      smallExpenseThreshold: 50,
    };
  },

  loadData(): FinancialData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const initial = this.getInitialData();
        this.saveData(initial);
        return initial;
      }
      const parsed = JSON.parse(stored) as FinancialData;
      // Ensure all fields exist
      if (!parsed.goals) parsed.goals = [];
      if (!parsed.expenses) parsed.expenses = [];
      if (!parsed.categories || parsed.categories.length === 0) parsed.categories = INITIAL_CATEGORIES;
      if (!parsed.profile) parsed.profile = INITIAL_PROFILE;
      if (typeof parsed.smallExpenseThreshold !== 'number') parsed.smallExpenseThreshold = 50;

      return parsed;
    } catch (e) {
      console.error('Erro ao ler do localStorage, restaurando padrões', e);
      return this.getInitialData();
    }
  },

  saveData(data: FinancialData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  },

  resetToDefault(): FinancialData {
    const fresh = this.getInitialData();
    this.saveData(fresh);
    return fresh;
  },

  clearAllData(): FinancialData {
    const empty: FinancialData = {
      profile: { monthlyIncome: 0, extraIncome: 0, lastUpdated: new Date().toISOString() },
      categories: INITIAL_CATEGORIES.map(c => ({ ...c, budgetLimit: 0 })),
      expenses: [],
      goals: [],
      smallExpenseThreshold: 50,
    };
    this.saveData(empty);
    return empty;
  },
};
