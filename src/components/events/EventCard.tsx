import Link from 'next/link';
import { format } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { EventWithCategories } from '@/lib/db/schema';
import { cn } from '@/lib/utils/cn';

interface EventCardProps {
  event: EventWithCategories;
  showActions?: boolean;
  compact?: boolean;
}

const categoryColors = [
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
];

export function EventCard({ event, showActions = true, compact = false }: EventCardProps) {
  const isDeadlinePassed =
    event.paymentDeadline && new Date(event.paymentDeadline) < new Date();

  const raceDate = new Date(event.raceDate);
  const isUpcoming = raceDate >= new Date();

  return (
    <Card className={cn(
      'p-5 transition-all duration-300',
      !isUpcoming && 'opacity-60 grayscale'
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link href={`/events/${event.id}`} className="group">
            <h3 className="text-lg font-bold text-stone-800 group-hover:text-rose-500 transition-colors flex items-center gap-2">
              <span className="text-xl">🏃</span>
              {event.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-teal-500">📅</span>
            <span className="text-sm text-stone-600 font-medium">
              {format(raceDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-amber-500">📍</span>
            <span className="text-sm text-stone-600">{event.location}</span>
          </div>
        </div>
        {showActions && (
          <Link href={`/events/${event.id}/edit`}>
            <Button variant="ghost" size="sm" className="text-stone-400 hover:text-rose-500">
              ✏️ Edit
            </Button>
          </Link>
        )}
      </div>

      {!compact && (
        <>
          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-2">
            {event.categories.map((cat, index) => (
              <span
                key={cat.id}
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                  categoryColors[index % categoryColors.length]
                )}
              >
                🏅 {cat.categoryName}: P{parseFloat(cat.price).toLocaleString()}
              </span>
            ))}
          </div>

          {/* Payment Deadline */}
          <p
            className={cn(
              'text-sm mt-4 flex items-center gap-2 font-medium',
              isDeadlinePassed ? 'text-rose-500' : event.paymentDeadline ? 'text-stone-500' : 'text-stone-400 italic'
            )}
          >
            <span>⏰</span>
            Payment deadline:{' '}
            {event.paymentDeadline
              ? format(new Date(event.paymentDeadline), 'MMM d, yyyy')
              : 'To be announced'}
            {isDeadlinePassed && ' (Passed ❌)'}
          </p>

          {/* Registration Link */}
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
            >
              🎯 Register Here
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          )}
        </>
      )}
    </Card>
  );
}
