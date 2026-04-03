import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "FinLedger — Finance Dashboard",
  description: "A modern finance dashboard to track and understand your financial activity. View balances, manage transactions, and gain spending insights.",
  keywords: "finance, dashboard, transactions, budgeting, spending insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('finDashTheme')?.value || 'dark';
  const role = cookieStore.get('finDashRole')?.value || 'admin';

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body>
        <AppProvider initialRole={role as any} initialTheme={theme as any}>
          <div className="app-layout">
            <Sidebar />
            <Header />
            <main className="main-content">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
