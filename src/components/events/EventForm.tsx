'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { CategoryInput } from './CategoryInput';
import { createEvent, updateEvent } from '@/lib/actions/events';
import { EventWithCategories } from '@/lib/db/schema';

interface Category {
  name: string;
  price: string;
}

interface EventFormProps {
  event?: EventWithCategories;
  mode: 'create' | 'edit';
}

export function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>(
    event?.categories.map((c) => ({
      name: c.categoryName,
      price: c.price,
    })) || [{ name: '', price: '' }]
  );

  const addCategory = () => {
    setCategories([...categories, { name: '', price: '' }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, category: Category) => {
    const updated = [...categories];
    updated[index] = category;
    setCategories(updated);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Add categories to form data
      formData.append('categories', JSON.stringify(categories));

      if (mode === 'create') {
        const result = await createEvent(formData);
        if (result.success) {
          router.push('/events');
        }
      } else if (event) {
        const result = await updateEvent(event.id, formData);
        if (result.success) {
          router.push(`/events/${event.id}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        label="Event Name"
        name="name"
        defaultValue={event?.name}
        required
        placeholder="e.g., Manila Marathon 2025"
      />

      <Input
        label="Race Date"
        name="raceDate"
        type="date"
        defaultValue={event?.raceDate}
        required
      />

      <Input
        label="Location / Venue"
        name="location"
        defaultValue={event?.location}
        required
        placeholder="e.g., MOA Concert Grounds, Pasay City"
      />

      <Input
        label="Registration Link"
        name="registrationLink"
        type="url"
        defaultValue={event?.registrationLink || ''}
        placeholder="https://example.com/register"
      />

      <Input
        label="Payment Deadline"
        name="paymentDeadline"
        type="date"
        defaultValue={event?.paymentDeadline || ''}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Race Categories & Prices
        </label>
        {categories.map((category, index) => (
          <CategoryInput
            key={index}
            index={index}
            category={category}
            onChange={(cat) => updateCategory(index, cat)}
            onRemove={() => removeCategory(index)}
            canRemove={categories.length > 1}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCategory}
          className="mt-2"
        >
          + Add Category
        </Button>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Event'
            : 'Update Event'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
