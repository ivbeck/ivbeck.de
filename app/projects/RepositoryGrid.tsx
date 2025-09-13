"use client";

import {motion} from "framer-motion";
import React from "react";

export type Repository = {
    id: number;
    name: string;
    description: string | null;
    stargazers_count?: number | undefined;
    forks_count?: number | undefined;
    html_url: string;
};

export default function RepositoryGrid({repositories}: { repositories: Repository[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo: Repository, index: number) => (
                <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    whileHover={{y: -3, scale: 1.015}}
                    whileTap={{scale: 0.99}}
                    transition={{duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1]}}
                    className="group relative rounded-xl p-[1px] bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 hover:from-indigo-500/60 hover:via-purple-500/60 hover:to-pink-500/60 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                >
                    <div
                        className="rounded-[inherit] h-full w-full bg-white/80 dark:bg-gray-900/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 transition-all duration-300">
                        <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
                            <div
                                className="absolute -inset-x-10 -inset-y-16 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rotate-12 translate-x-[-60%] group-hover:translate-x-[60%]"></div>
                        </div>
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-lg md:text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-purple-100 dark:to-white">
                                {repo.name}
                            </h2>
                            <svg className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors"
                                 fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                 aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h4m0 0v4m0-4L10 14"/>
                            </svg>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[3.6rem]">
                            {repo.description || "No description available"}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800/80 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 ring-1 ring-inset ring-black/5 dark:ring-white/10">
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"
                                         aria-hidden="true"><path
                                        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"></path></svg>
                                    {repo.stargazers_count ?? 0}
                                </span>
                                <span
                                    className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800/80 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 ring-1 ring-inset ring-black/5 dark:ring-white/10">
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"
                                         aria-hidden="true"><path d="M7 7h10v3H7V7zm0 5h6v3H7v-3z"></path></svg>
                                    {repo.forks_count ?? 0}
                                </span>
                            </div>
                            <span
                                className="text-sm font-medium text-purple-600 dark:text-purple-300 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                Open ↗
                            </span>
                        </div>
                    </div>
                </motion.a>
            ))}
        </div>
    );
}
