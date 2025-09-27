"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
// The import for 'next/link' has been removed to resolve the compilation error.
// Standard <a> tags are used for navigation instead.

// --- 1. Inline ThemeToggle Component ---
const ThemeToggle = () => {
  // FIX: Initialize state with a function that reads localStorage/system prefs immediately.
  // This runs only once on mount, ensuring the correct theme is applied before the first render.
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme;
      }
      // Only check system preference if no stored theme is found
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    // Default to 'light' if localStorage/window is unavailable
    return "light";
  });

  // This single useEffect now handles two jobs:
  // 1. Applies the initial theme class to the document root (which is the correct theme).
  // 2. Applies the class whenever the theme is toggled (updates).
  useEffect(() => {
    const root = window.document.documentElement;
    // Apply theme class to the root element (used by Tailwind's dark: selector)
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const Icon =
    theme === "light" ? (
      // Sun Icon (light mode)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
      </svg>
    ) : (
      // Moon Icon (dark mode)
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    );

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {Icon}
    </button>
  );
};

// --- 2. Main Navbar Component (Now fixed with <a> tags) ---

const Navbar = () => {

  const { data: session, status } = useSession() as any;
  return (
    <nav
      aria-label="Main navigation"
      className="fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-4 font-[Inter]"
    >
      <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 px-4 py-2 shadow-xl backdrop-blur-md sm:px-6 sm:py-3 transition-colors duration-300">
        {/* Logo Section - Now using standard <a> tag */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-900 dark:text-white"
        >
          <div className="flex items-center gap-1">
            {/* Using standard Tailwind indigo colors */}
            <div className="w-2 h-2 rounded-full bg-white/100"></div>
            <div className="w-2 h-2 rounded-full bg-white/100 opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-white/100 opacity-30"></div>
          </div>
          <span className="text-sm font-bold">AI Interviewer</span>
        </Link>

        {/* Main Navigation Links (Desktop only) - Now using standard <a> tag */}
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
            href="/create-interview"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Practice
          </Link>
        </div>

        {/* Auth Buttons and Theme Toggle (Visible on all devices) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {
            session.user.id ? <>
              <Link
                href="/create-interview"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-4 sm:py-2"
              >
                Start
              </Link>
            </> : <>

              {/* Login Button (Subtle/Outline style) - Now using standard <a> tag */}
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:px-4 sm:py-2"
              >
                Login
              </Link>

              {/* Sign Up Button (Primary CTA style) - Now using standard <a> tag */}
              <Link
                href="/auth/register"
                className="rounded-lg bg-white/100  px-3 py-1.5 text-xs font-semibold text-black shadow-sm hover:bg-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 sm:px-4 sm:py-2"
              >
                Sign Up
              </Link>
            </>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
