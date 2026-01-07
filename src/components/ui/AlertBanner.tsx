'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'race-calendar-region-banner-dismissed';

export function AlertBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsVisible(!isDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <p className="text-stone-700 text-sm">
        <span className="mr-2">📍</span>
        Currently featuring race events in the Southern Leyte & Leyte area. More regions coming soon!
      </p>
      <button
        onClick={handleDismiss}
        className="text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-white/50"
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
