'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { createQueueItem } from '@/lib/actions/queue';

interface QueueFormProps {
  compact?: boolean;
  onSuccess?: () => void;
}

export function QueueForm({ compact = false, onSuccess }: QueueFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await createQueueItem(formData);
      if (onSuccess) {
        onSuccess();
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className={compact ? 'space-y-3' : 'space-y-6'}>
      {error && (
        <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      <Input
        label={compact ? undefined : '🔗 Facebook Event URL'}
        name="url"
        type="url"
        required
        placeholder="https://facebook.com/events/..."
      />

      {!compact && (
        <Input
          label="📝 Event Title (optional)"
          name="title"
          type="text"
          placeholder="Event title"
        />
      )}

      {!compact && (
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            📝 Notes (optional)
          </label>
          <textarea
            name="notes"
            placeholder="Any notes about this event..."
            className="w-full px-4 py-2.5 border-2 border-stone-200 rounded-xl bg-white shadow-sm transition-all duration-200 focus:outline-none focus:border-teal-400 placeholder:text-stone-400 min-h-[100px]"
          />
        </div>
      )}

      <div className={compact ? 'flex gap-2' : 'flex gap-4 pt-6 border-t border-rose-100'}>
        <Button
          type="submit"
          size={compact ? 'sm' : 'md'}
          isLoading={isSubmitting}
          loadingText="Adding..."
        >
          {compact ? '+ Add' : '📋 Add to Queue'}
        </Button>
      </div>
    </form>
  );
}
