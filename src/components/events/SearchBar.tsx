'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);

  // Sync with URL params when they change externally
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set('search', query.trim());
        // Clear month/year filters when searching
        params.delete('month');
        params.delete('year');
      } else {
        params.delete('search');
      }

      router.push(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const handleClear = useCallback(() => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events by name..."
          className={cn(
            'w-full pl-11 pr-10 py-2.5 border-2 border-stone-200 rounded-xl',
            'bg-white shadow-sm',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-0 focus:border-teal-400',
            'focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)]',
            'placeholder:text-stone-400'
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
