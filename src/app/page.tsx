'use client';

import React from 'react';
import SummaryCards from '@/components/dashboard/SummaryCards';
import BalanceTrend from '@/components/dashboard/BalanceTrend';
import SpendingBreakdown from '@/components/dashboard/SpendingBreakdown';
import RecentTransactions from '@/components/dashboard/RecentTransactions';

export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-subtitle" style={{ marginTop: 0 }}>
          Welcome back! Here&apos;s what&apos;s happening with your finances.
        </p>
      </div>

      <SummaryCards />

      <div className="grid-charts">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <RecentTransactions />
      </div>
    </>
  );
}
