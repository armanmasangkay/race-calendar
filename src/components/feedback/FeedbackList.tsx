import { FeedbackItem } from '@/lib/db/schema';
import { FeedbackItemCard } from './FeedbackItemCard';

interface FeedbackListProps {
  items: FeedbackItem[];
}

export function FeedbackList({ items }: FeedbackListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-6 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-100">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-stone-600 font-medium">No feedback yet</p>
        <p className="text-stone-400 text-sm mt-1">
          User feedback will appear here
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
          <FeedbackItemCard item={item} />
        </div>
      ))}
    </div>
  );
}
