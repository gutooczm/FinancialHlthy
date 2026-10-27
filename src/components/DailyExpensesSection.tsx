import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Tag, 
  Coins, 
  Banknote,
  HeartCrack
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';

interface DailyExpensesSectionProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  onOpenExpenseModal: () => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const DailyExpensesSection: React.FC<DailyExpensesSectionProps> = ({
  expenses,
  categories,
  onOpenExpenseModal,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>);

  // Ordenar despesas por data (mais recente primeiro)
  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredExpenses = sortedExpenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.categoryId === selectedCategory;
    const matchesSize = selectedSize === 'all' || expense.size === selectedSize;
    return matchesSearch && matchesCategory && matchesSize;
  });

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Diário de Gastos do Mês
          </h2>
          <p className="text-xs text-slate-500">
            Anotar cada saída traz clareza mental e impede que o dinheiro suma sem explicação.
          </p>
        </div>

        <button
          onClick={onOpenExpenseModal}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Novo Gasto Diário
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-emerald-500 text-xs"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-emerald-500 text-xs cursor-pointer appearance-none"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-emerald-500 text-xs cursor-pointer appearance-none"
          >
            <option value="all">Todos os Tamanhos (Pequenos & Grandes)</option>
            <option value="pequeno">Apenas Pequenos Gastos (≤ R$ 50)</option>
            <option value="grande">Apenas Grandes Gastos (&gt; R$ 50)</option>
          </select>
        </div>
      </div>

      {/* Tabela / Lista de Despesas */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-10 px-4 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Receipt className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">
            Nenhum gasto encontrado com os filtros aplicados.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Clique no botão acima para adicionar um novo gasto diário.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200/80">
              <tr>
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Descrição & Motivo</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3 text-right">Valor</th>
                <th className="py-2.5 px-3 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => {
                const isSmall = expense.size === 'pequeno';

                return (
                  <tr key={expense.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                      {formatDateBR(expense.date)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">
                        {expense.description}
                      </div>
                      {expense.emotionalTrigger && (
                        <div className="text-[10px] text-slate-400 italic">
                          {expense.emotionalTrigger}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {categoryMap[expense.categoryId] || 'Geral'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isSmall ? (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-full font-medium">
                          <Coins className="w-3 h-3 text-amber-500" />
                          Pequeno
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-800 border border-indigo-200/80 px-2 py-0.5 rounded-full font-medium">
                          <Banknote className="w-3 h-3 text-indigo-500" />
                          Grande
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-slate-800">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Excluir lançamento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/80 font-bold text-slate-800 border-t border-slate-200">
                <td colSpan={4} className="py-2.5 px-3 text-right">
                  Total filtrado ({filteredExpenses.length} itens):
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-700 text-sm">
                  {formatCurrency(totalFiltered)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};
