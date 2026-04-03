import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import styles from './CustomDateSelector.module.css';

export interface CustomDateSelectorProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    align?: 'left' | 'right';
}

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

export default function CustomDateSelector({ value, onChange, className = '', placeholder = 'Select date', align = 'left' }: CustomDateSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);

    // Initial parsing
    const initialDate = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(initialDate);

    useEffect(() => {
        if (value) {
            setViewDate(new Date(value));
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const d = new Date(year, month, day);
        // format as YYYY-MM-DD local time padding
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dStr = String(d.getDate()).padStart(2, '0');
        onChange(`${y}-${m}-${dStr}`);
        setIsOpen(false);
    };

    return (
        <div className={`${styles.dateContainer} ${className}`} ref={selectorRef}>
            <button
                type="button"
                className={`${styles.dateToggle} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.selectedWrapper}>
                    <CalendarIcon size={14} className={styles.icon} />
                    <span className={value ? styles.selectedText : styles.placeholderText}>
                        {value ? value : placeholder}
                    </span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`${styles.calendarDropdown} ${align === 'right' ? styles.alignRight : ''}`}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        <div className={styles.calendarHeader}>
                            <button type="button" onClick={handlePrevMonth} className={styles.monthNav}>
                                <ChevronLeft size={16} />
                            </button>
                            <span className={styles.monthLabel}>
                                {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button type="button" onClick={handleNextMonth} className={styles.monthNav}>
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className={styles.calendarGrid}>
                            {daysOfWeek.map(d => (
                                <div key={d} className={styles.dayOfWeek}>{d}</div>
                            ))}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className={styles.emptyDay} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const isSelected = value && new Date(value).getFullYear() === year && new Date(value).getMonth() === month && new Date(value).getDate() === day;
                                const isToday = new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day;
                                return (
                                    <button
                                        type="button"
                                        key={day}
                                        className={`${styles.dayBtn} ${isSelected ? styles.selectedDay : ''} ${isToday && !isSelected ? styles.today : ''}`}
                                        onClick={() => handleDateClick(day)}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
