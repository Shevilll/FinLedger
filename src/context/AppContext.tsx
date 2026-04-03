'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction, FilterState, SortConfig, UserRole, Theme, Transaction } from '@/types';
import { mockTransactions } from '@/data/mockData';

const defaultFilters: FilterState = {
    search: '',
    category: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
};

const defaultSort: SortConfig = {
    key: 'date',
    direction: 'desc',
};

const initialState: AppState = {
    transactions: mockTransactions,
    filters: defaultFilters,
    sort: defaultSort,
    role: 'admin',
    theme: 'dark',
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };
        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(t =>
                    t.id === action.payload.id ? action.payload : t
                ),
            };
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(t => t.id !== action.payload),
            };
        case 'SET_FILTERS':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload },
            };
        case 'RESET_FILTERS':
            return {
                ...state,
                filters: defaultFilters,
            };
        case 'SET_SORT':
            return {
                ...state,
                sort: action.payload,
            };
        case 'SET_ROLE':
            return {
                ...state,
                role: action.payload,
            };
        case 'TOGGLE_THEME':
            return {
                ...state,
                theme: state.theme === 'dark' ? 'light' : 'dark',
            };
        case 'SET_TRANSACTIONS':
            return {
                ...state,
                transactions: action.payload,
            };
        default:
            return state;
    }
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromLocalStorage(): Partial<AppState> | null {
    if (typeof window === 'undefined') return null;
    try {
        const stored = localStorage.getItem('finDashState');
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                transactions: parsed.transactions || undefined,
                theme: parsed.theme || undefined,
                role: parsed.role || undefined,
            };
        }
    } catch {
        // ignore
    }
    return null;
}

function saveToLocalStorage(state: AppState) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('finDashState', JSON.stringify({
            transactions: state.transactions,
            theme: state.theme,
            role: state.role,
        }));
    } catch {
        // ignore
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
        const stored = loadFromLocalStorage();
        if (stored) {
            return {
                ...initial,
                transactions: stored.transactions || initial.transactions,
                theme: stored.theme || initial.theme,
                role: stored.role || initial.role,
            };
        }
        return initial;
    });

    // Persist to localStorage
    useEffect(() => {
        saveToLocalStorage(state);
    }, [state.transactions, state.theme, state.role]);

    // Ensure useLayoutEffect doesn't throw a warning on the server
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : useEffect;

    // Apply theme to document before browser repaints
    useIsomorphicLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export function useTransactions() {
    const { state, dispatch } = useAppContext();
    return {
        transactions: state.transactions,
        addTransaction: (t: Transaction) => dispatch({ type: 'ADD_TRANSACTION', payload: t }),
        updateTransaction: (t: Transaction) => dispatch({ type: 'UPDATE_TRANSACTION', payload: t }),
        deleteTransaction: (id: string) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }),
    };
}

export function useFilters() {
    const { state, dispatch } = useAppContext();
    return {
        filters: state.filters,
        setFilters: (f: Partial<FilterState>) => dispatch({ type: 'SET_FILTERS', payload: f }),
        resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    };
}

export function useSort() {
    const { state, dispatch } = useAppContext();
    return {
        sort: state.sort,
        setSort: (s: SortConfig) => dispatch({ type: 'SET_SORT', payload: s }),
    };
}

export function useRole() {
    const { state, dispatch } = useAppContext();
    return {
        role: state.role,
        setRole: (r: UserRole) => dispatch({ type: 'SET_ROLE', payload: r }),
        isAdmin: state.role === 'admin',
    };
}

export function useTheme() {
    const { state, dispatch } = useAppContext();
    return {
        theme: state.theme,
        toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
        isDark: state.theme === 'dark',
    };
}
