"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ThemeToggle from "@/components/theme-toggle"

export default function Navbar() {
  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none fixed left-1/2 top-4 z-50 w-full max-w-5xl -translate-x-1/2 px-4"
    >
      <div className="pointer-events-auto flex items-center justify-between rounded-xl border border-border bg-background/80 px-6 py-3 shadow-lg backdrop-blur-md">
        {" "}
        {/* Slightly more padding and opacity */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {" "}
            {/* Updated logo to match AI theme */}
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-primary opacity-30"></div>
          </div>
          <span className="text-sm font-bold">AI Interviewer</span> {/* Made font bolder */}
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {" "}
          {/* Increased gap slightly */}
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/#models" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            {" "}
            {/* Updated link to models */}
            Modes
          </Link>
          <Link
            href="/create-interview"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Practice
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {" "}
          {/* Slightly increased gap */}
          <ThemeToggle />
          <Link
            href="/create-interview"
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start practicing
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
