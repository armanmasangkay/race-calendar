import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Card } from '@/components/ui';
import { DeleteButton } from '@/components/events';
import { getEventById } from '@/lib/actions/events';
import { cn } from '@/lib/utils/cn';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

const categoryBgColors = ['bg-rose-50', 'bg-teal-50', 'bg-amber-50', 'bg-violet-50'];
const categoryTextColors = ['text-rose-600', 'text-teal-600', 'text-amber-600', 'text-violet-600'];

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(parseInt(id));

  if (!event) {
    notFound();
  }

  const raceDate = new Date(event.raceDate);
  const isDeadlinePassed =
    event.paymentDeadline && new Date(event.paymentDeadline) < new Date();

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Events
      </Link>

      <Card className="p-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">🏃</span>
          {event.name}
        </h1>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <span className="text-lg text-stone-700 font-medium">
              {format(raceDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <span className="text-lg text-stone-700">{event.location}</span>
          </div>

          {event.paymentDeadline && (
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <span className={cn(
                'text-lg font-medium',
                isDeadlinePassed ? 'text-rose-500' : 'text-stone-700'
              )}>
                Payment Deadline: {format(new Date(event.paymentDeadline), 'MMMM d, yyyy')}
                {isDeadlinePassed && ' (Passed ❌)'}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <span>🏅</span>
            Race Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.categories.map((cat, index) => (
              <div
                key={cat.id}
                className={cn(
                  'flex justify-between items-center rounded-xl px-5 py-4 border border-transparent hover:border-rose-200 transition-all',
                  categoryBgColors[index % categoryBgColors.length]
                )}
              >
                <span className="font-bold text-stone-800">{cat.categoryName}</span>
                <span className={cn('font-bold', categoryTextColors[index % categoryTextColors.length])}>
                  P{parseFloat(cat.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {event.registrationLink && (
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
        )}

        <div className="mt-10 pt-6 border-t border-rose-100 flex gap-4">
          <Link href={`/events/${event.id}/edit`}>
            <Button>✏️ Edit Event</Button>
          </Link>
          <DeleteButton eventId={event.id} />
        </div>
      </Card>
    </div>
  );
}
