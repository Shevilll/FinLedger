'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { groupByMonth, formatCurrency } from '@/utils/helpers';
import styles from './BalanceTrend.module.css';

export default function BalanceTrend() {
    const { state } = useAppContext();
    const data = groupByMonth(state.transactions);

    if (data.length === 0) {
        return (
            <motion.div
                className={`card-static ${styles.container}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <h3 className={styles.title}>Balance Trend</h3>
                <div className="empty-state">
                    <h3>No data available</h3>
                    <p>Add transactions to see your balance trend</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`card-static ${styles.container}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        >
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Balance Trend</h3>
                    <p className={styles.subtitle}>6-month overview</p>
                </div>
                <div className={styles.legend}>
                    <span className={styles.legendItem}>
                        <span className={styles.legendDotBalance} />Balance
                    </span>
                    <span className={styles.legendItem}>
                        <span className={styles.legendDotIncome} />Income
                    </span>
                    <span className={styles.legendItem}>
                        <span className={styles.legendDotExpense} />Expenses
                    </span>
                </div>
            </div>

            <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C4963C" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#C4963C" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5D9E6F" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#5D9E6F" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C26B52" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#C26B52" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--border-secondary)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#5D9E6F"
                            strokeWidth={1.5}
                            fill="url(#incomeGrad)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 2, fill: '#5D9E6F' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#C26B52"
                            strokeWidth={1.5}
                            fill="url(#expenseGrad)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 2, fill: '#C26B52' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#C4963C"
                            strokeWidth={2}
                            fill="url(#balanceGrad)"
                            dot={{ r: 3, fill: '#C4963C', strokeWidth: 2, stroke: 'var(--bg-card-solid)' }}
                            activeDot={{ r: 5, strokeWidth: 2, fill: '#C4963C' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload) return null;

    return (
        <div className="chart-tooltip">
            <div className="label">{label}</div>
            {payload.map((entry: any, i: number) => (
                <div key={i} style={{ color: entry.color }} className="value">
                    {entry.name}: {formatCurrency(entry.value)}
                </div>
            ))}
        </div>
    );
}
