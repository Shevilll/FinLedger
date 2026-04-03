'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { calculateTotals, formatCurrency, getMonthlyChange } from '@/utils/helpers';
import styles from './SummaryCards.module.css';

export default function SummaryCards() {
    const { state } = useAppContext();
    const totals = calculateTotals(state.transactions);
    const changes = getMonthlyChange(state.transactions);

    const cards = [
        {
            title: 'Total Balance',
            value: totals.balance,
            change: totals.savingsRate,
            changeLabel: 'savings rate',
            icon: Wallet,
            gradient: 'var(--gradient-primary)',
            accentColor: 'var(--accent-primary)',
            positive: totals.balance >= 0,
        },
        {
            title: 'Total Income',
            value: totals.income,
            change: changes.incomeChange,
            changeLabel: 'vs last month',
            icon: TrendingUp,
            gradient: 'var(--gradient-success)',
            accentColor: 'var(--accent-success)',
            positive: true,
        },
        {
            title: 'Total Expenses',
            value: totals.expenses,
            change: changes.expenseChange,
            changeLabel: 'vs last month',
            icon: TrendingDown,
            gradient: 'var(--gradient-danger)',
            accentColor: 'var(--accent-danger)',
            positive: false,
        },
    ];

    return (
        <div className="grid-summary">
            {cards.map((card, i) => (
                <motion.div
                    key={card.title}
                    className={styles.card}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                    <div className={styles.cardHeader}>
                        <span className={styles.cardTitle}>{card.title}</span>
                        <div
                            className={styles.iconWrap}
                            style={{ background: card.gradient }}
                        >
                            <card.icon size={18} color="white" />
                        </div>
                    </div>

                    <div className={styles.cardValue}>
                        <AnimatedNumber value={card.value} />
                    </div>

                    <div className={styles.cardFooter}>
                        <span
                            className={`${styles.change} ${card.change >= 0 ? styles.changePositive : styles.changeNegative}`}
                        >
                            {card.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(card.change).toFixed(1)}%
                        </span>
                        <span className={styles.changeLabel}>{card.changeLabel}</span>
                    </div>

                    {/* Decorative accent line */}
                    <div
                        className={styles.accentLine}
                        style={{ background: card.gradient }}
                    />
                </motion.div>
            ))}
        </div>
    );
}

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1200;
        const startTime = Date.now();

        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setDisplay(Math.round(start + (end - start) * eased));

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }, [value]);

    return <span>{formatCurrency(display)}</span>;
}
