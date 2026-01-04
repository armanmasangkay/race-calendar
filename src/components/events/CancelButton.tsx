'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { cancelEvent, restoreEvent } from '@/lib/actions/events';

interface CancelButtonProps {
  eventId: number;
  isCancelled: boolean;
}

export function CancelButton({ eventId, isCancelled }: CancelButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (isCancelled) {
        await restoreEvent(eventId);
      } else {
        await cancelEvent(eventId);
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to update event status:', error);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  if (isCancelled) {
    return (
      <Button
        variant="secondary"
        onClick={handleAction}
        isLoading={isLoading}
        loadingText="Restoring..."
      >
        Restore Event
      </Button>
    );
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3 bg-amber-50 px-4 py-3 rounded-xl border border-amber-200">
        <span className="text-sm text-stone-600 font-medium">Cancel this event?</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAction}
          isLoading={isLoading}
          loadingText="Cancelling..."
        >
          Yes, Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={() => setShowConfirm(true)}>
      Cancel Event
    </Button>
  );
}
