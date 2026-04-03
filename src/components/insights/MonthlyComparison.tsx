'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, Line, ComposedChart
} from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { groupByMonth, formatCurrency } from '@/utils/helpers';
import styles from './MonthlyComparison.module.css';

export default function MonthlyComparison() {
    const { state } = useAppContext();
    const data = groupByMonth(state.transactions);

    // Add net savings to data
    const chartData = data.map(d => ({
        ...d,
        net: d.income - d.expenses,
    }));

    if (chartData.length === 0) {
        return (
            <motion.div
                className={`card-static ${styles.container}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <h3 className={styles.title}>Monthly Comparison</h3>
                <div className="empty-state">
                    <h3>No data available</h3>
                    <p>Add transactions to see monthly comparison</p>
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
                    <h3 className={styles.title}>Monthly Comparison</h3>
                    <p className={styles.subtitle}>Income vs Expenses with Net Savings</p>
                </div>
            </div>

            <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                        <Legend
                            wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
                        />
                        <Bar
                            dataKey="income"
                            name="Income"
                            fill="#5D9E6F"
                            radius={[3, 3, 0, 0]}
                            barSize={22}
                            opacity={0.85}
                        />
                        <Bar
                            dataKey="expenses"
                            name="Expenses"
                            fill="#C26B52"
                            radius={[3, 3, 0, 0]}
                            barSize={22}
                            opacity={0.85}
                        />
                        <Line
                            type="monotone"
                            dataKey="net"
                            name="Net Savings"
                            stroke="#C4963C"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#C4963C', strokeWidth: 2, stroke: 'var(--bg-card-solid)' }}
                        />
                    </ComposedChart>
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
