'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus, Sparkles } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
    groupByCategory, generateInsightText, formatCurrency, getCategoryIcon
} from '@/utils/helpers';
import styles from './SpendingTrends.module.css';

export default function SpendingTrends() {
    const { state } = useAppContext();
    const categories = groupByCategory(state.transactions);
    const insights = generateInsightText(state.transactions);

    const maxAmount = categories.length > 0 ? categories[0].amount : 1;

    return (
        <motion.div
            className={`card-static ${styles.container}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
        >
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Category Analysis</h3>
                    <p className={styles.subtitle}>Spending by category with visual comparison</p>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="empty-state">
                    <h3>No data available</h3>
                    <p>Add expense transactions to see category analysis</p>
                </div>
            ) : (
                <>
                    <div className={styles.bars}>
                        {categories.slice(0, 8).map((cat, i) => (
                            <motion.div
                                key={cat.category}
                                className={styles.barRow}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                            >
                                <div className={styles.barLabel}>
                                    <span className={styles.barIcon}>{getCategoryIcon(cat.category)}</span>
                                    <span className={styles.barName}>{cat.category}</span>
                                </div>
                                <div className={styles.barTrack}>
                                    <motion.div
                                        className={styles.barFill}
                                        style={{ background: cat.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.amount / maxAmount) * 100}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: 'easeOut' }}
                                    />
                                </div>
                                <div className={styles.barMeta}>
                                    <span className={styles.barAmount}>{formatCurrency(cat.amount)}</span>
                                    <span className={styles.barPercent}>{cat.percentage.toFixed(1)}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* AI-style Insight Observations */}
                    <div className={styles.insightsSection}>
                        <div className={styles.insightsHeader}>
                            <Sparkles size={16} />
                            <span>Key Observations</span>
                        </div>
                        <div className={styles.insightsList}>
                            {insights.map((insight, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.insightItem}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                                >
                                    <div className={styles.insightDot} />
                                    <p>{insight}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
}
