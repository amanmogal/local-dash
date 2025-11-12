import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalDev Experiment Dashboard",
  description:
    "Internal dashboard for managing LocalDev experimentation cycles and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-brand">
              <span className="brand-logo">LocalDev</span>
              <span className="brand-subtitle">Experiment Dashboard</span>
            </div>
            <nav aria-label="Primary">
              <ul className="app-nav">
                <li>
                  <Link href="/overview">Overview</Link>
                </li>
                <li>
                  <Link href="/experiments">Experiments</Link>
                </li>
                <li>
                  <Link href="/ice-calculator">ICE Calculator</Link>
                </li>
                <li>
                  <Link href="/rice-calculator">RICE Calculator</Link>
                </li>
                <li>
                  <Link href="/sprint-planning">Sprint Planning</Link>
                </li>
                <li>
                  <Link href="/analytics">Analytics</Link>
                </li>
                <li>
                  <Link href="/notion">Notion</Link>
                </li>
                <li>
                  <Link href="/pre-mortem">Pre-Mortem</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            <p>Fail fast. Learn faster.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
