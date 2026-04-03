# FinLedger — Finance Dashboard

A modern, premium finance dashboard built with **Next.js 14**, **TypeScript**, and a custom **"Midnight Ledger"** design system. Track your financial activity, manage transactions, and gain spending insights — all in a beautiful, responsive interface.

![Dashboard](https://img.shields.io/badge/Status-Complete-10B981?style=flat-square) ![Next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

---

## Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Income, and Expenses with animated counters and percentage change indicators
- **Balance Trend** — 6-month area chart showing income, expenses, and running balance
- **Spending Breakdown** — Interactive donut chart with category-wise spending analysis
- **Recent Transactions** — Quick view of last 6 transactions

### Transactions Management
- Full transaction table with **sorting** (date, amount) and **animated delete**
- **Search** by description, merchant, or category
- **Filter** by category, type (income/expense), and date range
- **Add/Edit transactions** via modal form (Admin role only)
- **Export** to CSV or JSON

### Financial Insights
- Highest spending category analysis
- Average monthly spending tracker
- Savings rate calculator
- Largest transaction finder
- **Monthly comparison** chart (income vs expenses with net savings line)
- **Category analysis** with animated horizontal bars
- **AI-style observations** with automatically generated insight text

### Role-Based UI
- **Admin** — Full access: add, edit, delete transactions
- **Viewer** — Read-only: view data without modification
- Toggle roles via the header switch for demonstration

### Additional Features
- 🌙 **Dark/Light mode** with smooth theme switching
- 💾 **LocalStorage persistence** for transactions, role, and theme
- ✨ **Framer Motion animations** — staggered reveals, hover effects, page transitions
- 📱 **Fully responsive** — sidebar collapses to bottom nav on mobile
- 📊 **Recharts** for professional data visualizations
- 🎨 **Custom design system** — CSS variables, glassmorphism, gradient accents

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type Safety |
| React Context + useReducer | State Management |
| Recharts | Data Visualizations |
| Framer Motion | Animations |
| Lucide React | Icons |
| CSS Modules | Component Styling |
| CSS Custom Properties | Design Tokens |

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd finance-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Dashboard page
│   ├── globals.css        # Design system & global styles
│   ├── transactions/      # Transactions page
│   └── insights/          # Insights page
├── components/
│   ├── layout/            # Sidebar, Header
│   ├── dashboard/         # SummaryCards, BalanceTrend, SpendingBreakdown, RecentTransactions
│   ├── transactions/      # TransactionTable, TransactionFilters, TransactionModal
│   └── insights/          # InsightCards, MonthlyComparison, SpendingTrends
├── context/
│   └── AppContext.tsx     # Global state management with React Context
├── data/
│   └── mockData.ts        # Mock transaction data generator (60+ entries)
├── types/
│   └── index.ts           # TypeScript interfaces and types
└── utils/
    └── helpers.ts         # Utility functions
```

---

## Design Approach

### "Midnight Ledger" Aesthetic
The dashboard follows a premium fintech design direction:

- **Dark-first design** with deep navy-black backgrounds and subtle gradient mesh overlays
- **Glassmorphism cards** with backdrop blur and luminous borders
- **Typography**: Bricolage Grotesque (headings) + DM Sans (body) for a distinctive, warm feel
- **Color palette**: Indigo primary (#6366F1), Emerald for income (#10B981), Rose for expenses (#F43F5E), Cyan for highlights (#22D3EE)
- **Microinteractions**: Animated counters, staggered card reveals, spring-based role switcher, hover lift effects

### State Management
React Context with `useReducer` was chosen for its simplicity and effectiveness at this scale. The state handles:
- Transaction CRUD operations
- Filter/sort state
- Role switching (Admin/Viewer)
- Theme toggling (Dark/Light)
- LocalStorage persistence

### Responsiveness
- Desktop: Full sidebar + content grid
- Tablet: Sidebar becomes a drawer overlay
- Mobile: Bottom navigation + stacked layouts

---

## Evaluation Notes

- **Empty states** are handled gracefully across all components
- **Role-based UI** changes are immediate and visual (Admin sees add/edit/delete controls)
- **All charts** have custom tooltips and responsive containers
- **Export** supports both CSV and JSON formats
- **Animations** are purposeful and enhance UX without being distracting
