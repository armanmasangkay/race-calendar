import { EventWithCategories } from '@/lib/db/schema';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui';
import Link from 'next/link';

interface EventListProps {
  events: EventWithCategories[];
  compact?: boolean;
}

export function EventList({ events, compact = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 px-6 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-100">
        <div className="text-6xl mb-4 animate-bounce-subtle">🏃</div>
        <p className="text-stone-600 text-lg font-medium">No races scheduled yet!</p>
        <p className="text-stone-400 mt-2">Time to find your next adventure! 🎉</p>
        <Link href="/events/new" className="inline-block mt-6">
          <Button>
            ✨ Add Your First Race
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <EventCard event={event} compact={compact} />
        </div>
      ))}
    </div>
  );
}
