'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { AllowedEmail } from '@/lib/db/schema';
import { removeAllowedEmail } from '@/lib/actions/allowedEmails';

interface AllowedEmailCardProps {
  item: AllowedEmail;
}

export function AllowedEmailCard({ item }: AllowedEmailCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeAllowedEmail(item.id);
    } catch (error) {
      console.error('Failed to remove allowed email:', error);
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-800 truncate">
            {item.email}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Added {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
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
        </div>
      </div>
    </Card>
  );
}
