import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "FinLedger — Finance Dashboard",
  description: "A modern finance dashboard to track and understand your financial activity. View balances, manage transactions, and gain spending insights.",
  keywords: "finance, dashboard, transactions, budgeting, spending insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = 'dark';
                const stored = localStorage.getItem('finDashState');
                if (stored) {
                  const parsed = JSON.parse(stored);
                  if (parsed.theme) {
                    theme = parsed.theme;
                  }
                }
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <AppProvider>
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
