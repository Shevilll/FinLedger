'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, FileText, X } from 'lucide-react';
import { useAppContext, useRole, useSort, useTransactions } from '@/context/AppContext';
import { Transaction, SortConfig } from '@/types';
import { formatCurrencyExact, formatDate, getCategoryIcon } from '@/utils/helpers';
import styles from './TransactionTable.module.css';

interface Props {
    transactions: Transaction[];
    onEdit?: (t: Transaction) => void;
}

export default function TransactionTable({ transactions, onEdit }: Props) {
    const { isAdmin } = useRole();
    const { sort, setSort } = useSort();
    const { deleteTransaction } = useTransactions();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleSort = (key: keyof Transaction) => {
        setSort({
            key,
            direction: sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    const handleDeleteClick = (id: string) => {
        setConfirmDeleteId(id);
    };

    const confirmDelete = () => {
        if (!confirmDeleteId) return;
        const id = confirmDeleteId;
        setConfirmDeleteId(null);
        setDeletingId(id);
        setTimeout(() => {
            deleteTransaction(id);
            setDeletingId(null);
        }, 300);
    };

    const cancelDelete = () => {
        setConfirmDeleteId(null);
    };

    const SortIcon = ({ column }: { column: keyof Transaction }) => {
        if (sort.key !== column) return <ArrowUpDown size={13} className={styles.sortInactive} />;
        return sort.direction === 'asc'
            ? <ArrowUp size={13} className={styles.sortActive} />
            : <ArrowDown size={13} className={styles.sortActive} />;
    };

    if (transactions.length === 0) {
        return (
            <div className={`card-static ${styles.emptyWrap}`}>
                <div className="empty-state">
                    <FileText size={48} />
                    <h3>No transactions found</h3>
                    <p>Try adjusting your filters or add a new transaction</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.tableWrap}>
            <div className={styles.tableScroll}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('date')} className={styles.sortable}>
                                <span>Date</span> <SortIcon column="date" />
                            </th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th onClick={() => handleSort('amount')} className={styles.sortable}>
                                <span>Amount</span> <SortIcon column="amount" />
                            </th>
                            {isAdmin && <th className={styles.actionsCol}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {transactions.map((t) => (
                                <motion.tr
                                    key={t.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: deletingId === t.id ? 0.3 : 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <td className={styles.dateCell}>{formatDate(t.date)}</td>
                                    <td>
                                        <div className={styles.descriptionCell}>
                                            <span className={styles.merchant}>{t.merchant}</span>
                                            <span className={styles.description}>{t.description}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-category">
                                            {getCategoryIcon(t.category)} {t.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                            {t.type === 'income' ? '↑ Income' : '↓ Expense'}
                                        </span>
                                    </td>
                                    <td className={styles.amountCell}>
                                        <span className={t.type === 'income' ? styles.income : styles.expense}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrencyExact(t.amount)}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className={styles.actions}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => onEdit?.(t)}
                                                aria-label="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDeleteClick(t.id)}
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {confirmDeleteId && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cancelDelete}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="modal-title">Delete Transaction</h2>
                                <button className="modal-close" onClick={cancelDelete}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={confirmDelete}
                                    style={{
                                        background: 'var(--accent-danger)',
                                        borderColor: 'var(--accent-danger)',
                                        color: '#fff'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
