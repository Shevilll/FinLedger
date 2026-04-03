'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { groupByCategory, formatCurrency } from '@/utils/helpers';
import styles from './SpendingBreakdown.module.css';

export default function SpendingBreakdown() {
    const { state } = useAppContext();
    const data = groupByCategory(state.transactions);

    if (data.length === 0) {
        return (
            <motion.div
                className={`card-static ${styles.container}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                <h3 className={styles.title}>Spending Breakdown</h3>
                <div className="empty-state">
                    <h3>No data available</h3>
                    <p>Add expense transactions to see your breakdown</p>
                </div>
            </motion.div>
        );
    }

    const top6 = data.slice(0, 6);
    const otherAmount = data.slice(6).reduce((sum, d) => sum + d.amount, 0);
    const totalExpenses = data.reduce((sum, d) => sum + d.amount, 0);
    const chartData = otherAmount > 0
        ? [...top6, { category: 'Other' as any, amount: otherAmount, percentage: (otherAmount / totalExpenses) * 100, color: '#78716C' }]
        : top6;

    return (
        <motion.div
            className={`card-static ${styles.container}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
        >
            <div className={styles.header}>
                <h3 className={styles.title}>Spending Breakdown</h3>
                <p className={styles.subtitle}>By category</p>
            </div>

            <div className={styles.chartArea}>
                <div className={styles.donutWrap}>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="amount"
                                stroke="none"
                                animationBegin={400}
                                animationDuration={800}
                            >
                                {chartData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className={styles.donutCenter}>
                        <span className={styles.donutTotal}>{formatCurrency(totalExpenses)}</span>
                        <span className={styles.donutLabel}>Total</span>
                    </div>
                </div>

                <div className={styles.legend}>
                    {chartData.map((item, i) => (
                        <div key={i} className={styles.legendItem}>
                            <div className={styles.legendLeft}>
                                <span
                                    className={styles.legendDot}
                                    style={{ background: item.color }}
                                />
                                <span className={styles.legendName}>{item.category}</span>
                            </div>
                            <div className={styles.legendRight}>
                                <span className={styles.legendAmount}>{formatCurrency(item.amount)}</span>
                                <span className={styles.legendPercent}>{item.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || !payload[0]) return null;
    const data = payload[0].payload;

    return (
        <div className="chart-tooltip">
            <div className="label">{data.category}</div>
            <div className="value">{formatCurrency(data.amount)}</div>
            <div className="label">{data.percentage.toFixed(1)}% of total</div>
        </div>
    );
}
