'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { formatCurrencyExact, formatDateShort, getCategoryIcon } from '@/utils/helpers';
import styles from './RecentTransactions.module.css';

export default function RecentTransactions() {
    const { state } = useAppContext();
    const recent = state.transactions.slice(0, 6);

    return (
        <motion.div
            className={`card-static ${styles.container}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
        >
            <div className={styles.header}>
                <h3 className={styles.title}>Recent Transactions</h3>
                <Link href="/transactions" className={styles.viewAll}>
                    View All <ArrowRight size={14} />
                </Link>
            </div>

            {recent.length === 0 ? (
                <div className="empty-state">
                    <h3>No transactions</h3>
                    <p>Your recent transactions will appear here</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {recent.map((t, i) => (
                        <motion.div
                            key={t.id}
                            className={styles.item}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                        >
                            <div className={styles.itemLeft}>
                                <span className={styles.icon}>{getCategoryIcon(t.category)}</span>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{t.merchant}</span>
                                    <span className={styles.itemCategory}>{t.category}</span>
                                </div>
                            </div>
                            <div className={styles.itemRight}>
                                <span
                                    className={`${styles.itemAmount} ${t.type === 'income' ? styles.income : styles.expense
                                        }`}
                                >
                                    {t.type === 'income' ? '+' : '-'}{formatCurrencyExact(t.amount)}
                                </span>
                                <span className={styles.itemDate}>{formatDateShort(t.date)}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
