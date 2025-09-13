"use client";

import {motion} from "framer-motion";

export default function Home() {
    return (
        <main
            className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">

            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"/>
                <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl"/>
            </div>

            <motion.div
                className="pointer-events-none absolute left-10 top-24 size-8 rounded-full bg-fuchsia-400/70 shadow-[0_0_60px_10px_rgba(244,114,182,0.35)]"
                initial={{y: 0, x: 0, opacity: 0}}
                animate={{y: [0, -18, 0, 14, 0], x: [0, 6, -4, 8, 0], opacity: 1}}
                transition={{duration: 8, repeat: Infinity, ease: "easeInOut"}}
            />
            <motion.div
                className="pointer-events-none absolute right-16 top-40 size-6 rounded-full bg-cyan-300/70 shadow-[0_0_60px_10px_rgba(103,232,249,0.35)]"
                initial={{y: 0, x: 0, opacity: 0}}
                animate={{y: [0, 22, 0, -14, 0], x: [0, -8, 6, -10, 0], opacity: 1}}
                transition={{duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6}}
            />
            <motion.div
                className="pointer-events-none absolute right-1/3 bottom-28 size-4 rounded-full bg-amber-300/80 shadow-[0_0_50px_8px_rgba(252,211,77,0.35)]"
                initial={{scale: 0, opacity: 0}}
                animate={{scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8]}}
                transition={{duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3}}
            />

            <section
                className="relative mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{opacity: 0, y: 12}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6, ease: "easeOut"}}
                    className="mb-5"
                >
                    <motion.span
                        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-1.5 text-sm text-slate-800 shadow-sm backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200"
                        initial={{scale: 0.9}}
                        animate={{scale: [1, 1.04, 1]}}
                        transition={{duration: 2.8, repeat: Infinity, ease: "easeInOut"}}
                    >
                        <span
                            className="inline-block size-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.7)]"/>
                        WIP: Cooking something delightful
                    </motion.span>
                </motion.div>

                <motion.h1
                    className="text-balance bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-6xl"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, ease: "easeOut", delay: 0.05}}
                >
                    Almost ready to launch
                </motion.h1>

                <motion.p
                    className="mt-4 max-w-2xl text-pretty text-slate-600 sm:text-lg dark:text-slate-300/85"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.7, ease: "easeOut", delay: 0.15}}
                >
                    Building a smooth, fast experience. In the meantime, enjoy a little motion magic.
                </motion.p>


                <motion.svg
                    width="220"
                    height="26"
                    viewBox="0 0 220 26"
                    className="pointer-events-none mt-8 text-fuchsia-400/70"
                    initial={{opacity: 0}}
                    animate={{opacity: 1, pathLength: [0, 1]}}
                    transition={{duration: 1.2, ease: "easeInOut", delay: 0.35}}
                >
                    <motion.path
                        d="M2 14 C 22 2, 42 26, 62 14 S 102 2, 122 14 162 26, 182 14 202 2, 218 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        initial={{pathLength: 0}}
                        animate={{pathLength: 1}}
                        transition={{duration: 1.6, ease: "easeInOut", delay: 0.35}}
                    />
                </motion.svg>
            </section>


            <motion.div
                className="pointer-events-none absolute -right-20 top-10 h-1 w-1 rounded-full bg-fuchsia-500/70 shadow-[0_0_16px_6px_rgba(244,114,182,0.7)] dark:bg-white dark:shadow-[0_0_16px_6px_rgba(255,255,255,0.7)]"
                initial={{x: 0, y: 0, opacity: 0}}
                animate={{x: [-40, -360], y: [0, 240], opacity: [0, 1, 0]}}
                transition={{duration: 3.2, repeat: Infinity, delay: 1.2, ease: "easeInOut"}}
            />
        </main>
    );
}
