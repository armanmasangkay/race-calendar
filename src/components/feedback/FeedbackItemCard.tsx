'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { FeedbackItem } from '@/lib/db/schema';
import { updateFeedbackStatus, deleteFeedbackItem } from '@/lib/actions/feedback';

interface FeedbackItemCardProps {
  item: FeedbackItem;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  reviewed: 'bg-blue-100 text-blue-700',
  resolved: 'bg-teal-100 text-teal-700',
  dismissed: 'bg-stone-100 text-stone-600',
};

const typeIcons: Record<string, string> = {
  feature: '💡',
  bug: '🐛',
};

export function FeedbackItemCard({ item }: FeedbackItemCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('status', newStatus);
    try {
      await updateFeedbackStatus(item.id, formData);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFeedbackItem(item.id);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3">
        {/* Header with type and status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeIcons[item.type] || '📝'}</span>
            <span className="font-medium text-stone-800 capitalize">{item.type}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || statusColors.pending}`}>
              {item.status}
            </span>
          </div>
          <p className="text-xs text-stone-400">
            {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-700 whitespace-pre-wrap">{item.description}</p>

        {/* Email if provided */}
        {item.email && (
          <p className="text-xs text-teal-600">
            <span className="text-stone-500">Contact:</span> {item.email}
          </p>
        )}

        {/* Admin notes if any */}
        {item.adminNotes && (
          <div className="bg-stone-50 rounded-lg p-2 text-xs text-stone-600">
            <span className="font-medium">Notes:</span> {item.adminNotes}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <select
            value={item.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="text-xs px-2 py-1 rounded-lg border border-stone-200 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          {showConfirm ? (
            <div className="flex gap-1 ml-auto">
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
              className="ml-auto"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
