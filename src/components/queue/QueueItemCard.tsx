'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { QueueItem } from '@/lib/db/schema';
import { deleteQueueItem } from '@/lib/actions/queue';

interface QueueItemCardProps {
  item: QueueItem;
  compact?: boolean;
}

export function QueueItemCard({ item, compact = false }: QueueItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteQueueItem(item.id);
    } catch (error) {
      console.error('Failed to delete queue item:', error);
      setIsDeleting(false);
    }
  };

  // Extract domain for display
  let urlDisplay = item.url;
  try {
    urlDisplay = new URL(item.url).hostname;
  } catch {
    // Keep full URL if parsing fails
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-2"
          >
            <span className="truncate">{urlDisplay}</span>
            <span className="text-xs flex-shrink-0">↗</span>
          </a>
          {!compact && item.notes && (
            <p className="text-sm text-stone-500 mt-2 line-clamp-2">
              {item.notes}
            </p>
          )}
          <p className="text-xs text-stone-400 mt-2">
            Added {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/events/new?fromQueue=${item.id}`}>
            <Button size="sm" variant="primary">
              Create Event
            </Button>
          </Link>

          {!compact && (
            <>
              {showConfirm ? (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    loadingText="..."
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowConfirm(false)}
                  >
                    No
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowConfirm(true)}
                >
                  Remove
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
