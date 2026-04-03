export type TransactionType = 'income' | 'expense';

export type Category =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Health & Fitness'
  | 'Education'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Rent'
  | 'Travel'
  | 'Subscriptions'
  | 'Groceries'
  | 'Other';

export type UserRole = 'admin' | 'viewer';
export type Theme = 'dark' | 'light';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
  merchant: string;
}

export interface FilterState {
  search: string;
  category: Category | 'all';
  type: TransactionType | 'all';
  dateFrom: string;
  dateTo: string;
}

export interface SortConfig {
  key: keyof Transaction;
  direction: 'asc' | 'desc';
}

export interface AppState {
  transactions: Transaction[];
  filters: FilterState;
  sort: SortConfig;
  role: UserRole;
  theme: Theme;
}

export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_SORT'; payload: SortConfig }
  | { type: 'SET_ROLE'; payload: UserRole }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] };

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryData {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}
