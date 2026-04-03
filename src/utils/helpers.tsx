import React from 'react';
import { Transaction, Category, MonthlyData, CategoryData, FilterState, SortConfig } from '@/types';
import { categoryColors } from '@/data/mockData';
import {
    Utensils, Car, ShoppingBag, Receipt, Film, Dumbbell, BookOpen,
    Briefcase, Code, TrendingUp, Home, Plane, Bell, ShoppingCart, Package
} from 'lucide-react';

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatCurrencyExact(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

export function getMonthName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export function getMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function calculateTotals(transactions: Transaction[]) {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        income,
        expenses,
        balance: income - expenses,
        savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
    };
}

export function groupByMonth(transactions: Transaction[]): MonthlyData[] {
    const map = new Map<string, { income: number; expenses: number }>();

    transactions.forEach(t => {
        const key = t.date.substring(0, 7); // YYYY-MM
        const existing = map.get(key) || { income: 0, expenses: 0 };
        if (t.type === 'income') {
            existing.income += t.amount;
        } else {
            existing.expenses += t.amount;
        }
        map.set(key, existing);
    });

    const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

    let runningBalance = 0;
    return sorted.map(([key, data]) => {
        runningBalance += data.income - data.expenses;
        return {
            month: getMonthName(key + '-01'),
            income: data.income,
            expenses: data.expenses,
            balance: runningBalance,
        };
    });
}

export function groupByCategory(transactions: Transaction[]): CategoryData[] {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const map = new Map<Category, number>();
    expenseTransactions.forEach(t => {
        map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });

    return Array.from(map.entries())
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
            color: categoryColors[category],
        }))
        .sort((a, b) => b.amount - a.amount);
}

export function filterTransactions(
    transactions: Transaction[],
    filters: FilterState
): Transaction[] {
    return transactions.filter(t => {
        if (filters.search) {
            const search = filters.search.toLowerCase();
            if (
                !t.description.toLowerCase().includes(search) &&
                !t.merchant.toLowerCase().includes(search) &&
                !t.category.toLowerCase().includes(search)
            ) {
                return false;
            }
        }

        if (filters.category !== 'all' && t.category !== filters.category) {
            return false;
        }

        if (filters.type !== 'all' && t.type !== filters.type) {
            return false;
        }

        if (filters.dateFrom && t.date < filters.dateFrom) {
            return false;
        }

        if (filters.dateTo && t.date > filters.dateTo) {
            return false;
        }

        return true;
    });
}

export function sortTransactions(
    transactions: Transaction[],
    sort: SortConfig
): Transaction[] {
    return [...transactions].sort((a, b) => {
        let comparison = 0;

        if (sort.key === 'date') {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sort.key === 'amount') {
            comparison = a.amount - b.amount;
        } else {
            comparison = String(a[sort.key]).localeCompare(String(b[sort.key]));
        }

        return sort.direction === 'asc' ? comparison : -comparison;
    });
}

export function exportToCSV(transactions: Transaction[]): void {
    const headers = ['Date', 'Description', 'Merchant', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(t => [
        t.date,
        t.description,
        t.merchant,
        t.category,
        t.type,
        t.type === 'expense' ? `-${t.amount}` : `${t.amount}`,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csv, 'transactions.csv', 'text/csv');
}

export function exportToJSON(transactions: Transaction[]): void {
    const json = JSON.stringify(transactions, null, 2);
    downloadFile(json, 'transactions.json', 'application/json');
}

function downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function getHighestSpendingCategory(transactions: Transaction[]): CategoryData | null {
    const categories = groupByCategory(transactions);
    return categories.length > 0 ? categories[0] : null;
}

export function getAverageMonthlySpending(transactions: Transaction[]): number {
    const monthly = groupByMonth(transactions);
    if (monthly.length === 0) return 0;
    const total = monthly.reduce((sum, m) => sum + m.expenses, 0);
    return total / monthly.length;
}

export function getBiggestTransaction(transactions: Transaction[]): Transaction | null {
    if (transactions.length === 0) return null;
    return transactions.reduce((max, t) =>
        t.amount > max.amount ? t : max
    );
}

export function getMonthlyChange(transactions: Transaction[]): {
    incomeChange: number;
    expenseChange: number;
} {
    const monthly = groupByMonth(transactions);
    if (monthly.length < 2) return { incomeChange: 0, expenseChange: 0 };

    const current = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];

    const incomeChange = previous.income > 0
        ? ((current.income - previous.income) / previous.income) * 100
        : 0;
    const expenseChange = previous.expenses > 0
        ? ((current.expenses - previous.expenses) / previous.expenses) * 100
        : 0;

    return { incomeChange, expenseChange };
}

export function generateInsightText(transactions: Transaction[]): string[] {
    const insights: string[] = [];
    const categories = groupByCategory(transactions);
    const monthly = groupByMonth(transactions);
    const totals = calculateTotals(transactions);

    if (categories.length > 0) {
        insights.push(
            `Your highest spending category is ${categories[0].category}, accounting for ${categories[0].percentage.toFixed(1)}% of total expenses.`
        );
    }

    if (totals.savingsRate > 0) {
        insights.push(
            `You're saving ${totals.savingsRate.toFixed(1)}% of your income. ${totals.savingsRate > 20 ? 'Great job!' : 'Consider reducing discretionary spending.'}`
        );
    }

    if (monthly.length >= 2) {
        const last = monthly[monthly.length - 1];
        const prev = monthly[monthly.length - 2];
        if (last.expenses > prev.expenses) {
            const increase = ((last.expenses - prev.expenses) / prev.expenses * 100).toFixed(1);
            insights.push(
                `Your spending increased by ${increase}% compared to last month. Review your recent purchases.`
            );
        } else {
            const decrease = ((prev.expenses - last.expenses) / prev.expenses * 100).toFixed(1);
            insights.push(
                `Your spending decreased by ${decrease}% compared to last month. Keep it up!`
            );
        }
    }

    if (categories.length > 2) {
        const top3 = categories.slice(0, 3).map(c => c.category).join(', ');
        insights.push(`Your top 3 spending areas are: ${top3}.`);
    }

    return insights;
}

export function getCategoryIcon(category: Category): React.ReactNode {
    const icons: Record<Category, React.ReactNode> = {
        'Food & Dining': <Utensils size={14} />,
        'Transportation': <Car size={14} />,
        'Shopping': <ShoppingBag size={14} />,
        'Bills & Utilities': <Receipt size={14} />,
        'Entertainment': <Film size={14} />,
        'Health & Fitness': <Dumbbell size={14} />,
        'Education': <BookOpen size={14} />,
        'Salary': <Briefcase size={14} />,
        'Freelance': <Code size={14} />,
        'Investment': <TrendingUp size={14} />,
        'Rent': <Home size={14} />,
        'Travel': <Plane size={14} />,
        'Subscriptions': <Bell size={14} />,
        'Groceries': <ShoppingCart size={14} />,
        'Other': <Package size={14} />,
    };
    return icons[category] || <Package size={14} />;
}
