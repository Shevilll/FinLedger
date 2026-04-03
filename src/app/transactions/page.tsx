'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download } from 'lucide-react';
import { useAppContext, useRole, useFilters, useSort } from '@/context/AppContext';
import { filterTransactions, sortTransactions, exportToCSV, exportToJSON } from '@/utils/helpers';
import { Transaction } from '@/types';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionTable from '@/components/transactions/TransactionTable';
import TransactionModal from '@/components/transactions/TransactionModal';
import styles from './transactions.module.css';

export default function TransactionsPage() {
    const { state } = useAppContext();
    const { isAdmin } = useRole();
    const { filters } = useFilters();
    const { sort } = useSort();

    const [modalOpen, setModalOpen] = useState(false);
    const [editTx, setEditTx] = useState<Transaction | null>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const processedTransactions = useMemo(() => {
        const filtered = filterTransactions(state.transactions, filters);
        return sortTransactions(filtered, sort);
    }, [state.transactions, filters, sort]);

    const handleEdit = (t: Transaction) => {
        setEditTx(t);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditTx(null);
    };

    return (
        <>
            <motion.div
                className={styles.headerRow}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div>
                    <span className={styles.count}>
                        {processedTransactions.length} transaction{processedTransactions.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className={styles.headerActions}>
                    {/* Export */}
                    <div className={styles.exportWrap}>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            <Download size={14} />
                            Export
                        </button>
                        {showExportMenu && (
                            <motion.div
                                className={styles.exportMenu}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <button onClick={() => { exportToCSV(processedTransactions); setShowExportMenu(false); }}>
                                    Export as CSV
                                </button>
                                <button onClick={() => { exportToJSON(processedTransactions); setShowExportMenu(false); }}>
                                    Export as JSON
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Add Transaction (Admin only) */}
                    {isAdmin && (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => { setEditTx(null); setModalOpen(true); }}
                        >
                            <Plus size={16} />
                            Add Transaction
                        </button>
                    )}
                </div>
            </motion.div>

            <TransactionFilters />
            <TransactionTable transactions={processedTransactions} onEdit={handleEdit} />
            <TransactionModal isOpen={modalOpen} onClose={handleCloseModal} editTransaction={editTx} />
        </>
    );
}
