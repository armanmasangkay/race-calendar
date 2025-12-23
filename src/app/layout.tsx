import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Race Calendar",
  description: "Track and manage your running race events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-50 min-h-screen`}
      >
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-2xl">🏃</span>
                <span className="hidden sm:inline">Race Calendar</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200"
                >
                  📅 Calendar
                </Link>
                <Link
                  href="/events"
                  className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200"
                >
                  🎯 All Events
                </Link>
                <Link
                  href="/events/new"
                  className="bg-gradient-to-r from-rose-500 to-rose-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-rose-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  ✨ Add Event
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-rose-100 mt-auto bg-gradient-to-r from-orange-50 via-rose-50 to-teal-50">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center">
            <p className="text-stone-600 text-sm">
              Made with ❤️ for runners everywhere
            </p>
            <p className="text-stone-400 text-xs mt-2">
              🏅 Race Calendar - Track your running adventures! 🎉
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
