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

function isPromoActive(promoDeadline: string | null): boolean {
  if (!promoDeadline) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(promoDeadline) >= today;
}

export function EventCard({ event, showActions = true, compact = false }: EventCardProps) {
  const isDeadlinePassed =
    event.paymentDeadline && new Date(event.paymentDeadline) < new Date();

  const raceDate = new Date(event.raceDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const raceDateOnly = new Date(raceDate);
  raceDateOnly.setHours(0, 0, 0, 0);
  const isHappeningToday = raceDateOnly.getTime() === today.getTime();
  const isUpcoming = raceDate >= new Date();
  const isCancelled = event.isCancelled;

  return (
    <Card className={cn(
      'p-5 transition-all duration-300',
      isHappeningToday && !isCancelled && 'ring-2 ring-rose-400 animate-glow-pulse bg-gradient-to-r from-rose-50 to-amber-50',
      !isUpcoming && !isCancelled && !isHappeningToday && 'opacity-60 grayscale',
      isCancelled && 'opacity-70 bg-stone-50'
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link href={`/events/${event.id}`} className="group">
            <h3 className={cn(
              'text-lg font-bold text-stone-800 group-hover:text-rose-500 transition-colors flex items-center gap-2',
              isCancelled && 'line-through text-stone-500'
            )}>
              <span className="text-xl">🏃</span>
              {event.name}
              {isCancelled && (
                <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full uppercase no-underline inline-block" style={{ textDecoration: 'none' }}>
                  Cancelled
                </span>
              )}
            </h3>
          </Link>
          <div className={cn('flex items-center gap-2 mt-2', isCancelled && 'line-through text-stone-400')}>
            <span className="text-teal-500">📅</span>
            <span className="text-sm text-stone-600 font-medium">
              {format(raceDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className={cn('flex items-center gap-2 mt-1', isCancelled && 'line-through text-stone-400')}>
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
          <div className={cn('mt-4 flex flex-wrap gap-2', isCancelled && 'opacity-50')}>
            {event.categories.map((cat, index) => {
              const hasActivePromo = cat.promoPrice && isPromoActive(cat.promoDeadline);

              return (
                <span
                  key={cat.id}
                  className={cn(
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    categoryColors[index % categoryColors.length]
                  )}
                >
                  🏅 {cat.categoryName}:{' '}
                  {hasActivePromo ? (
                    <>
                      <span className="line-through opacity-60 mx-1">P{parseFloat(cat.price).toLocaleString()}</span>
                      <span className="font-bold">P{parseFloat(cat.promoPrice!).toLocaleString()}</span>
                    </>
                  ) : (
                    <>P{parseFloat(cat.price).toLocaleString()}</>
                  )}
                </span>
              );
            })}
          </div>

          {/* Payment Deadline - hide when cancelled */}
          {!isCancelled && (
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
          )}

          {/* Registration Links - hide when cancelled */}
          {!isCancelled && (() => {
            const categoryLinks = event.categories.filter(cat => cat.registrationLink);

            if (categoryLinks.length > 0) {
              return (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-stone-600 flex items-center gap-2">
                    <span>🎯</span> Registration
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categoryLinks.map((cat) => (
                      <a
                        key={cat.id}
                        href={cat.registrationLink!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-teal-600 bg-teal-50 rounded-full hover:bg-teal-100 transition-colors"
                      >
                        {cat.categoryName}
                        <span>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            } else if (event.registrationLink) {
              return (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
                >
                  🎯 Register Here
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              );
            }
            return null;
          })()}

          {/* Official Page Link - hide when cancelled */}
          {!isCancelled && event.detailsLink && (
            <a
              href={event.detailsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors group"
            >
              🌐 Official Page
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          )}
        </>
      )}
    </Card>
  );
}
