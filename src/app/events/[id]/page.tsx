import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Card } from '@/components/ui';
import { DeleteButton, CancelButton } from '@/components/events';
import { getEventById } from '@/lib/actions/events';
import { cn } from '@/lib/utils/cn';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

const categoryBgColors = ['bg-rose-50', 'bg-teal-50', 'bg-amber-50', 'bg-violet-50'];
const categoryTextColors = ['text-rose-600', 'text-teal-600', 'text-amber-600', 'text-violet-600'];

function isPromoActive(promoDeadline: string | null): boolean {
  if (!promoDeadline) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(promoDeadline) >= today;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(parseInt(id));

  if (!event) {
    notFound();
  }

  const raceDate = new Date(event.raceDate);
  const isDeadlinePassed =
    event.paymentDeadline && new Date(event.paymentDeadline) < new Date();
  const isCancelled = event.isCancelled;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Events
      </Link>

      <Card className={cn('p-8', isCancelled && 'bg-stone-50')}>
        {isCancelled && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-bold text-center uppercase tracking-wide">
              This event has been cancelled
            </p>
          </div>
        )}

        <h1 className={cn(
          'text-3xl font-bold text-stone-800 mb-6 flex items-center gap-3',
          isCancelled && 'line-through text-stone-500'
        )}>
          <span className="text-4xl">🏃</span>
          {event.name}
        </h1>

        <div className="space-y-4">
          <div className={cn('flex items-center gap-3', isCancelled && 'opacity-60')}>
            <span className="text-2xl">📅</span>
            <span className={cn('text-lg text-stone-700 font-medium', isCancelled && 'line-through')}>
              {format(raceDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          <div className={cn('flex items-center gap-3', isCancelled && 'opacity-60')}>
            <span className="text-2xl">📍</span>
            <span className={cn('text-lg text-stone-700', isCancelled && 'line-through')}>
              {event.location}
            </span>
          </div>

          {!isCancelled && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <span className={cn(
                'text-lg font-medium',
                isDeadlinePassed ? 'text-rose-500' : event.paymentDeadline ? 'text-stone-700' : 'text-stone-400 italic'
              )}>
                Payment Deadline:{' '}
                {event.paymentDeadline
                  ? format(new Date(event.paymentDeadline), 'MMMM d, yyyy')
                  : 'To be announced'}
                {isDeadlinePassed && ' (Passed ❌)'}
              </span>
            </div>
          )}
        </div>

        <div className={cn('mt-8', isCancelled && 'opacity-60')}>
          <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <span>🏅</span>
            Race Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.categories.map((cat, index) => {
              const hasActivePromo = cat.promoPrice && isPromoActive(cat.promoDeadline);

              return (
                <div
                  key={cat.id}
                  className={cn(
                    'rounded-xl px-5 py-4 border border-transparent hover:border-rose-200 transition-all',
                    categoryBgColors[index % categoryBgColors.length]
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800">{cat.categoryName}</span>
                    {hasActivePromo ? (
                      <div className="text-right">
                        <span className="line-through text-stone-400 text-sm mr-2">
                          P{parseFloat(cat.price).toLocaleString()}
                        </span>
                        <span className={cn('font-bold', categoryTextColors[index % categoryTextColors.length])}>
                          P{parseFloat(cat.promoPrice!).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className={cn('font-bold', categoryTextColors[index % categoryTextColors.length])}>
                        P{parseFloat(cat.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {hasActivePromo && cat.promoDeadline && (
                    <p className="text-xs text-teal-600 mt-2">
                      Promo until {format(new Date(cat.promoDeadline), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isCancelled && (() => {
          const categoryLinks = event.categories.filter(cat => cat.registrationLink);
          const buttonColors = [
            'bg-gradient-to-r from-rose-500 to-rose-400 shadow-rose-200',
            'bg-gradient-to-r from-teal-500 to-teal-400 shadow-teal-200',
            'bg-gradient-to-r from-amber-500 to-amber-400 shadow-amber-200',
            'bg-gradient-to-r from-violet-500 to-violet-400 shadow-violet-200',
          ];

          if (categoryLinks.length > 0) {
            return (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <span>🎯</span>
                  Registration
                </h2>
                <div className="flex flex-wrap gap-3">
                  {categoryLinks.map((cat, index) => (
                    <a
                      key={cat.id}
                      href={cat.registrationLink!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-lg text-white',
                        buttonColors[index % buttonColors.length]
                      )}
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
              <div className="mt-8">
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-teal-400 text-white px-8 py-4 rounded-xl hover:from-teal-600 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-bold text-lg shadow-lg shadow-teal-200"
                >
                  🎯 Register Now
                  <span>→</span>
                </a>
              </div>
            );
          }
          return null;
        })()}

        <div className="mt-10 pt-6 border-t border-rose-100 flex gap-4 flex-wrap">
          <Link href={`/events/${event.id}/edit`}>
            <Button>✏️ Edit Event</Button>
          </Link>
          <CancelButton eventId={event.id} isCancelled={isCancelled} />
          <DeleteButton eventId={event.id} />
        </div>
      </Card>
    </div>
  );
}
