"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!user) {
    return (
      <Link
        href="/admin/login"
        className="text-stone-600 hover:text-rose-500 text-sm font-medium transition-colors duration-200"
      >
        Sign In
      </Link>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-rose-200 hover:border-rose-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-rose-600 bg-rose-100 w-full h-full flex items-center justify-center">
            {initials}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-rose-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-rose-100">
            <p className="text-sm font-medium text-stone-800 truncate">
              {user.name}
            </p>
            <p className="text-xs text-stone-500 truncate">{user.email}</p>
          </div>
          <div className="px-2 py-2">
            <button
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
