'use client';

import { useState } from 'react';

interface ShareButtonProps {
  eventId: number;
}

export function ShareButton({ eventId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/events/${eventId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
    >
      {copied ? (
        <>
          <span>✓</span>
          Copied!
        </>
      ) : (
        <>
          <span>🔗</span>
          Share
        </>
      )}
    </button>
  );
}
