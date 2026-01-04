import { QueueItem } from '@/lib/db/schema';
import { QueueItemCard } from './QueueItemCard';

interface QueueListProps {
  items: QueueItem[];
  compact?: boolean;
}

export function QueueList({ items, compact = false }: QueueListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-6 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-100">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-stone-600 font-medium">No events in queue</p>
        <p className="text-stone-400 text-sm mt-1">
          Save Facebook event links to add later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <QueueItemCard item={item} compact={compact} />
        </div>
      ))}
    </div>
  );
}
