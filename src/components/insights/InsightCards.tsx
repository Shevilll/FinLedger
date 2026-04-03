'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PiggyBank, Zap } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import {
    getHighestSpendingCategory, getAverageMonthlySpending,
    getBiggestTransaction, calculateTotals, formatCurrency,
} from '@/utils/helpers';
import styles from './InsightCards.module.css';

export default function InsightCards() {
    const { state } = useAppContext();
    const totals = calculateTotals(state.transactions);
    const highestCategory = getHighestSpendingCategory(state.transactions);
    const avgMonthly = getAverageMonthlySpending(state.transactions);
    const biggestTx = getBiggestTransaction(state.transactions);

    const cards = [
        {
            title: 'Highest Spending',
            value: highestCategory ? highestCategory.category : 'N/A',
            subtitle: highestCategory ? `${formatCurrency(highestCategory.amount)} (${highestCategory.percentage.toFixed(1)}%)` : 'No data',
            icon: TrendingUp,
            color: '#C26B52',
        },
        {
            title: 'Avg. Monthly Spend',
            value: formatCurrency(avgMonthly),
            subtitle: 'Across all categories',
            icon: BarChart3,
            color: '#7B8FA3',
        },
        {
            title: 'Savings Rate',
            value: `${totals.savingsRate.toFixed(1)}%`,
            subtitle: totals.savingsRate > 20 ? 'You\'re saving well!' : 'Room for improvement',
            icon: PiggyBank,
            color: '#5D9E6F',
        },
        {
            title: 'Largest Transaction',
            value: biggestTx ? formatCurrency(biggestTx.amount) : 'N/A',
            subtitle: biggestTx ? `${biggestTx.merchant} — ${biggestTx.category}` : 'No data',
            icon: Zap,
            color: '#C4963C',
        },
    ];

    return (
        <div className="grid-insights">
            {cards.map((card, i) => (
                <motion.div
                    key={card.title}
                    className={styles.card}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                    <div className={styles.accentBar} style={{ background: card.color }} />
                    <div className={styles.content}>
                        <div className={styles.iconWrap} style={{ color: card.color }}>
                            <card.icon size={18} strokeWidth={1.5} />
                        </div>
                        <span className={styles.label}>{card.title}</span>
                        <span className={styles.value}>{card.value}</span>
                        <span className={styles.subtitle}>{card.subtitle}</span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
