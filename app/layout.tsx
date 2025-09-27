import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import Navbar from "@/components/navbar";
import ToastProvider from "@/providers/ToastProvider";
import AuthProvider from "@/components/provider/next-auth-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export const metadata: Metadata = {
  title: "AI Interviewer - Master Your Next Interview",
  description:
    "Practice interviews with AI-powered coaching. Get personalized feedback and ace your next interview.",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="font-sans">
        <AuthProvider session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense>
              <Navbar />
              <ToastProvider />
              <div className="h-20" aria-hidden />
              {children}
              <Analytics />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
