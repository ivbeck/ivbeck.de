import "./globals.css";
import React from "react";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
    title: {
        default: "ivbeck",
        template: "%s • ivbeck",
    },
    description: "Personal site of Iven Beck — projects, experiments, and notes.",
};

const setInitialTheme = `(() => { try { const s = localStorage.getItem('theme'); const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)'); const m = mq && typeof mq.matches === 'boolean' ? mq.matches : false; const d = s === 'dark' ? true : s === 'light' ? false : m; const he = document.documentElement; const bo = document.body; he.classList.toggle('dark', d); he.setAttribute('data-theme', d ? 'dark' : 'light'); if (bo) { bo.classList.toggle('dark', d); bo.setAttribute('data-theme', d ? 'dark' : 'light'); } } catch(e){} })();`;

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{__html: setInitialTheme}}/>
            <title>ivbeck.de</title>
        </head>
        <body
            className="min-h-dvh bg-gray-50 text-gray-900 antialiased transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        <header
            className="sticky top-0 z-40 w-full border-b border-black/5 bg-white/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md dark:border-white/10 dark:bg-gray-950/60">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/"
                      className="font-semibold tracking-tight text-gray-900 hover:text-purple-600 dark:text-gray-100 dark:hover:text-purple-300">
                    Iven Beck
                </Link>
                <nav className="flex items-center gap-3">
                    <Link href="/projects"
                          className="rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/70">Projects</Link>
                    <ThemeToggle/>
                </nav>
            </div>
        </header>
        <div className="pb-12">{children}</div>
        <footer
            className="border-t border-black/5 bg-white/50 py-6 text-center text-sm text-gray-600 dark:border-white/10 dark:bg-gray-950/40 dark:text-gray-400">
            <div className="container mx-auto px-4">
                © {new Date().getFullYear()} Iven Beck. All rights reserved.
            </div>
        </footer>
        </body>
        </html>
    );
}
