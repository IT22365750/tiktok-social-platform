import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TokSocial Pulse | Premium Creator Media Platform',
  description: 'Next-generation TikTok-style short video social platform built with Next.js App Router, Tailwind CSS, and Zustand.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans min-h-screen bg-zinc-50 dark:bg-[#09090e] text-zinc-900 dark:text-zinc-100 selection:bg-purple-500 selection:text-white`}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to content
          </a>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
              <Sidebar />
              <main id="main-content" className="flex-1 min-w-0 px-3 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
                {children}
              </main>
            </div>
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
