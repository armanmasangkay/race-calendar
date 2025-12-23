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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Race Calendar
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Calendar
                </Link>
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  All Events
                </Link>
                <Link
                  href="/events/new"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  + Add Event
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
            Race Calendar - Track your running events
          </div>
        </footer>
      </body>
    </html>
  );
}
