"use client";

import React from "react";

type Mode = "system" | "light" | "dark";

type MQLWithLegacy = MediaQueryList & {
    addListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
    removeListener?: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
};

export default function ThemeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const [isDark, setIsDark] = React.useState(false);
    const [mode, setMode] = React.useState<Mode>("system");
    const modeRef = React.useRef<Mode>("system");
    const mediaRef = React.useRef<MQLWithLegacy | null>(null);

    const applyTheme = (dark: boolean) => {
        const he = document.documentElement;
        const bo = document.body;
        he.classList.toggle("dark", dark);
        he.setAttribute("data-theme", dark ? "dark" : "light");
        if (bo) {
            bo.classList.toggle("dark", dark);
            bo.setAttribute("data-theme", dark ? "dark" : "light");
        }
    };

    // Initialize once, attach system listener once
    React.useEffect(() => {
        setMounted(true);
        try {
            const stored = localStorage.getItem("theme");
            const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
            mediaRef.current = (mq || null) as MQLWithLegacy | null;

            const getSystemDark = () => !!(mediaRef.current && mediaRef.current.matches);

            if (stored === "dark" || stored === "light") {
                const dark = stored === "dark";
                modeRef.current = stored;
                setMode(stored);
                setIsDark(dark);
                applyTheme(dark);
            } else {
                modeRef.current = "system";
                setMode("system");
                const dark = getSystemDark();
                setIsDark(dark);
                applyTheme(dark);
            }

            const handler = (e: MediaQueryListEvent) => {
                // Only react to system changes when in system mode
                if (modeRef.current === "system") {
                    setIsDark(e.matches);
                    applyTheme(e.matches);
                }
            };

            if (mediaRef.current) {
                if (typeof mediaRef.current.addEventListener === "function") {
                    mediaRef.current.addEventListener("change", handler);
                } else if (typeof mediaRef.current.addListener === "function") {
                    mediaRef.current.addListener(handler);
                }
            }

            return () => {
                if (mediaRef.current) {
                    if (typeof mediaRef.current.removeEventListener === "function") {
                        mediaRef.current.removeEventListener("change", handler);
                    } else if (typeof mediaRef.current.removeListener === "function") {
                        mediaRef.current.removeListener(handler);
                    }
                }
            };
        } catch {
            // no-op
        }
    }, []);

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Shift or Alt click resets to system mode (follow OS/browser)
        if (e.shiftKey || e.altKey) {
            try {
                localStorage.removeItem("theme");
            } catch {
                // ignore
            }
            modeRef.current = "system";
            setMode("system");
            const dark = !!(mediaRef.current && mediaRef.current.matches);
            setIsDark(dark);
            applyTheme(dark);
            return;
        }

        // Regular click toggles explicit light/dark and persists
        const next = !isDark;
        setIsDark(next);
        const nextMode: Mode = next ? "dark" : "light";
        modeRef.current = nextMode;
        setMode(nextMode);
        try {
            localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
            // ignore
        }
        applyTheme(next);
    };

    const title = mode === "system"
        ? "Following system — click to set explicit theme (⇧/Alt‑click to stay System)"
        : (isDark ? "Switch to light (⇧/Alt‑click for System)" : "Switch to dark (⇧/Alt‑click for System)");

    // Avoid hydration mismatches by not rendering icon states until mounted
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isDark}
            title={title}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300/50 bg-white/60 text-gray-800 shadow-sm backdrop-blur transition hover:bg-white/80 dark:border-white/10 dark:bg-gray-900/60 dark:text-gray-100 dark:hover:bg-gray-900/80"
        >
            <span className="sr-only">Toggle theme</span>
            {/* Sun */}
            <svg
                className={(mounted && !isDark ? "opacity-100 scale-100" : "opacity-0 scale-75") + " absolute h-5 w-5 transition duration-200"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
            </svg>
            {/* Moon */}
            <svg
                className={(mounted && isDark ? "opacity-100 scale-100" : "opacity-0 scale-75") + " absolute h-5 w-5 transition duration-200"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        </button>
    );
}
