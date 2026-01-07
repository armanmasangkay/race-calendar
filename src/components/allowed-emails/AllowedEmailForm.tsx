'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { addAllowedEmail } from '@/lib/actions/allowedEmails';

export function AllowedEmailForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await addAllowedEmail(formData);
      router.refresh();
      // Reset form
      const form = document.getElementById('allowed-email-form') as HTMLFormElement;
      form?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="allowed-email-form" action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-rose-50 border-2 border-rose-200 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-2">
          <span className="text-lg">!</span>
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        required
        placeholder="user@example.com"
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Adding..."
      >
        Add Email
      </Button>
    </form>
  );
}
