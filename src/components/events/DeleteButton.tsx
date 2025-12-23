'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { deleteEvent } from '@/lib/actions/events';

interface DeleteButtonProps {
  eventId: number;
}

export function DeleteButton({ eventId }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(eventId);
      router.push('/events');
    } catch (error) {
      console.error('Failed to delete event:', error);
      setIsDeleting(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3 bg-rose-50 px-4 py-3 rounded-xl border border-rose-200">
        <span className="text-sm text-stone-600 font-medium">⚠️ Delete this event?</span>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="danger" onClick={() => setShowConfirm(true)}>
      🗑️ Delete Event
    </Button>
  );
}
