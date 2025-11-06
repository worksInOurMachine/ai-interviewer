"use client";
import { Moon, Sun } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

// --- 1. Inline ThemeToggle Component ---
const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Run once on client to sync theme from localStorage or system
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme to <html> whenever it changes
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!theme) return null; // 🚀 Prevent hydration mismatch

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </button>
  );
};

// --- 2. Main Navbar Component ---
const Navbar = () => {
  const { data: session } = useSession() as any;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed left-1/2 top-4 z-50 w-full  max-w-5xl -translate-x-1/2 px-4 font-[Inter]"
    >
      <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 px-4 py-2 shadow-xl backdrop-blur-md sm:px-6 sm:py-3 transition-colors duration-300">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-900 dark:text-white"
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-white/100"></div>
            <div className="w-2 h-2 rounded-full bg-white/100 opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-white/100 opacity-30"></div>
          </div>
          <span className="text-sm font-bold">AI Interviewer</span>
        </Link>

        {/* Main Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#models"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Modes
          </Link>
          <Link
            href="/roadmap-chat"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Roadmap/Chat
          </Link>
          <Link
            href="/reports"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Reports
          </Link>
        </div>

        {/* Auth + Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {session?.user?.id ? (
            <Link
              href="/create-interview"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-4 sm:py-2"
            >
              Start Interview
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-4 sm:py-2"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-white/100 px-3 py-1.5 text-xs font-semibold text-black shadow-sm hover:bg-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 sm:px-4 sm:py-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
