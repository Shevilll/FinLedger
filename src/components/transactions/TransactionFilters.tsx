'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useFilters } from '@/context/AppContext';
import { Category } from '@/types';
import styles from './TransactionFilters.module.css';
import CustomDropdown from '@/components/ui/CustomDropdown';
import CustomDateSelector from '@/components/ui/CustomDateSelector';

const categories: (Category | 'all')[] = [
    'all', 'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities',
    'Entertainment', 'Health & Fitness', 'Education', 'Salary', 'Freelance',
    'Investment', 'Rent', 'Travel', 'Subscriptions', 'Groceries', 'Other'
];

export default function TransactionFilters() {
    const { filters, setFilters, resetFilters } = useFilters();
    const hasActiveFilters = filters.search || filters.category !== 'all' ||
        filters.type !== 'all' || filters.dateFrom || filters.dateTo;

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                {/* Search */}
                <div className={styles.searchWrap}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={e => setFilters({ search: e.target.value })}
                        className={styles.searchInput}
                    />
                    {filters.search && (
                        <button
                            className={styles.clearSearch}
                            onClick={() => setFilters({ search: '' })}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Category Filter */}
                <CustomDropdown
                    value={filters.category}
                    onChange={(val) => setFilters({ category: val as any })}
                    options={categories.map(cat => ({
                        value: cat,
                        label: cat === 'all' ? 'All Categories' : cat
                    }))}
                    className={styles.select}
                />

                {/* Type Filter */}
                <CustomDropdown
                    value={filters.type}
                    onChange={(val) => setFilters({ type: val as any })}
                    options={[
                        { value: 'all', label: 'All Types' },
                        { value: 'income', label: 'Income' },
                        { value: 'expense', label: 'Expense' }
                    ]}
                    className={styles.select}
                />

                {/* Date Range */}
                <div className={styles.dateGroup}>
                    <CustomDateSelector
                        value={filters.dateFrom}
                        onChange={val => setFilters({ dateFrom: val })}
                        className={styles.dateInput}
                        placeholder="From"
                        align="right"
                    />
                    <span className={styles.dateSep}>–</span>
                    <CustomDateSelector
                        value={filters.dateTo}
                        onChange={val => setFilters({ dateTo: val })}
                        className={styles.dateInput}
                        placeholder="To"
                        align="right"
                    />
                </div>

                {/* Clear All */}
                {hasActiveFilters && (
                    <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                        <X size={14} />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
