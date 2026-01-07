"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface MobileNavProps {
  isAdmin: boolean;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function MobileNav({ isAdmin, user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="sm:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-stone-600 hover:text-rose-500 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // X icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full bg-white border-b border-rose-100 shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              href="/"
              className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200 py-2"
            >
              📅 Calendar
            </Link>
            <Link
              href="/events"
              className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200 py-2"
            >
              🎯 All Events
            </Link>
            {!isAdmin && (
              <Link
                href="/suggest"
                className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200 py-2"
              >
                💡 Suggest Event
              </Link>
            )}
            {isAdmin && (
              <>
                <Link
                  href="/queue"
                  className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200 py-2"
                >
                  📋 Queue
                </Link>
                <Link
                  href="/admin/allowed-emails"
                  className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200 py-2"
                >
                  📧 Allowed Emails
                </Link>
                <Link
                  href="/events/new"
                  className="bg-gradient-to-r from-rose-500 to-rose-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-rose-600 hover:to-rose-500 transition-all duration-300 shadow-sm hover:shadow-md text-center mt-1"
                >
                  ✨ Add Event
                </Link>
              </>
            )}

            {/* User Section */}
            <div className="border-t border-rose-100 mt-3 pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full border-2 border-rose-200"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold flex items-center justify-center border-2 border-rose-200">
                        {user.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "?"}
                      </span>
                    )}
                    <span className="text-sm text-stone-700 font-medium truncate max-w-[150px]">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-stone-500 hover:text-rose-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
