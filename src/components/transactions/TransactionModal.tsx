'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Transaction, Category, TransactionType } from '@/types';
import { useTransactions } from '@/context/AppContext';
import styles from './TransactionModal.module.css';
import CustomDropdown from '@/components/ui/CustomDropdown';
import CustomDateSelector from '@/components/ui/CustomDateSelector';

const categories: Category[] = [
    'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities',
    'Entertainment', 'Health & Fitness', 'Education', 'Salary', 'Freelance',
    'Investment', 'Rent', 'Travel', 'Subscriptions', 'Groceries', 'Other'
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editTransaction?: Transaction | null;
}

export default function TransactionModal({ isOpen, onClose, editTransaction }: Props) {
    const { addTransaction, updateTransaction } = useTransactions();
    const isEditing = !!editTransaction;

    const [form, setForm] = useState({
        date: '',
        amount: '',
        category: 'Food & Dining' as Category,
        type: 'expense' as TransactionType,
        description: '',
        merchant: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editTransaction) {
            setForm({
                date: editTransaction.date,
                amount: String(editTransaction.amount),
                category: editTransaction.category,
                type: editTransaction.type,
                description: editTransaction.description,
                merchant: editTransaction.merchant,
            });
        } else {
            setForm({
                date: new Date().toISOString().split('T')[0],
                amount: '',
                category: 'Food & Dining',
                type: 'expense',
                description: '',
                merchant: '',
            });
        }
        setErrors({});
    }, [editTransaction, isOpen]);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.date) errs.date = 'Date is required';
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
            errs.amount = 'Enter a valid amount';
        if (!form.description.trim()) errs.description = 'Description is required';
        if (!form.merchant.trim()) errs.merchant = 'Merchant is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const transaction: Transaction = {
            id: editTransaction?.id || Math.random().toString(36).substring(2, 11),
            date: form.date,
            amount: Number(form.amount),
            category: form.category,
            type: form.type,
            description: form.description.trim(),
            merchant: form.merchant.trim(),
        };

        if (isEditing) {
            updateTransaction(transaction);
        } else {
            addTransaction(transaction);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
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
                            <h2 className="modal-title">
                                {isEditing ? 'Edit Transaction' : 'Add Transaction'}
                            </h2>
                            <button className="modal-close" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <CustomDateSelector
                                        value={form.date}
                                        onChange={val => setForm({ ...form, date: val })}
                                    />
                                    {errors.date && <span className={styles.error}>{errors.date}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                    />
                                    {errors.amount && <span className={styles.error}>{errors.amount}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <div className={styles.typeToggle}>
                                        <button
                                            type="button"
                                            className={`${styles.typeBtn} ${form.type === 'expense' ? styles.typeActive : ''} ${form.type === 'expense' ? styles.typeExpense : ''}`}
                                            onClick={() => setForm({ ...form, type: 'expense' })}
                                        >
                                            Expense
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.typeBtn} ${form.type === 'income' ? styles.typeActive : ''} ${form.type === 'income' ? styles.typeIncome : ''}`}
                                            onClick={() => setForm({ ...form, type: 'income' })}
                                        >
                                            Income
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <CustomDropdown
                                        value={form.category}
                                        onChange={val => setForm({ ...form, category: val as Category })}
                                        options={categories.map(cat => ({ value: cat, label: cat }))}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Merchant</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Amazon, Starbucks"
                                    value={form.merchant}
                                    onChange={e => setForm({ ...form, merchant: e.target.value })}
                                />
                                {errors.merchant && <span className={styles.error}>{errors.merchant}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <input
                                    type="text"
                                    placeholder="Brief description of the transaction"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                                {errors.description && <span className={styles.error}>{errors.description}</span>}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {isEditing ? 'Save Changes' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
