'use client';

import React from 'react';
import InsightCards from '@/components/insights/InsightCards';
import MonthlyComparison from '@/components/insights/MonthlyComparison';
import SpendingTrends from '@/components/insights/SpendingTrends';

export default function InsightsPage() {
    return (
        <>
            <InsightCards />

            <div className="grid-insights-charts">
                <MonthlyComparison />
                <SpendingTrends />
            </div>
        </>
    );
}
