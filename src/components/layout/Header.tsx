'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Calendar, Sun, Moon } from 'lucide-react';
import { useRole, useTheme } from '@/context/AppContext';
import styles from './Header.module.css';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Your financial overview at a glance' },
    '/transactions': { title: 'Transactions', subtitle: 'View and manage all your transactions' },
    '/insights': { title: 'Insights', subtitle: 'Understand your spending patterns' },
};

export default function Header() {
    const pathname = usePathname();
    const { role, setRole, isAdmin } = useRole();
    const { isDark, toggleTheme } = useTheme();

    const pageInfo = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h1 className={styles.title}>{pageInfo.title}</h1>
                        <p className={styles.subtitle}>{pageInfo.subtitle}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className={styles.right}>
                <button
                    className={styles.mobileThemeToggle}
                    onClick={toggleTheme}
                    aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <div className={styles.dateDisplay}>
                    <Calendar size={14} />
                    <span>{today}</span>
                </div>

                <div className={styles.roleSwitcher}>
                    <button
                        className={`${styles.roleBtn} ${isAdmin ? styles.roleActive : ''}`}
                        onClick={() => setRole('admin')}
                    >
                        <Shield size={14} />
                        <span>Admin</span>
                    </button>
                    <button
                        className={`${styles.roleBtn} ${!isAdmin ? styles.roleActive : ''}`}
                        onClick={() => setRole('viewer')}
                    >
                        <Eye size={14} />
                        <span>Viewer</span>
                    </button>
                    <motion.div
                        className={styles.roleSlider}
                        animate={{ x: isAdmin ? 0 : '100%' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                </div>
            </div>
        </header>
    );
}
