'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QueueItem } from '@/lib/db/schema';
import { QueueList } from './QueueList';
import { QueueForm } from './QueueForm';
import { Button } from '@/components/ui';

interface QuickQueueViewProps {
  items: QueueItem[];
}

export function QuickQueueView({ items }: QuickQueueViewProps) {
  const [showForm, setShowForm] = useState(false);
  const displayItems = items.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-stone-800 flex items-center gap-2">
          <span>📋</span>
          Events to Add
          {items.length > 0 && (
            <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Quick Add'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 pb-4 border-b border-rose-100">
          <QueueForm
            compact
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      <QueueList items={displayItems} compact />

      {items.length > 3 && (
        <Link href="/queue" className="block mt-4">
          <Button variant="outline" size="sm" className="w-full">
            View all {items.length} items →
          </Button>
        </Link>
      )}
    </div>
  );
}
