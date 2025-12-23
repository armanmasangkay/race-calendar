import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button, Card } from '@/components/ui';
import { DeleteButton } from '@/components/events';
import { getEventById } from '@/lib/actions/events';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
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

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/events"
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>

      <Card className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-lg text-gray-700">
              {format(raceDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-lg text-gray-700">{event.location}</span>
          </div>

          {event.paymentDeadline && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-lg ${isDeadlinePassed ? 'text-red-500' : 'text-gray-700'}`}>
                Payment Deadline: {format(new Date(event.paymentDeadline), 'MMMM d, yyyy')}
                {isDeadlinePassed && ' (Passed)'}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Race Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {event.categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
              >
                <span className="font-medium text-gray-900">{cat.categoryName}</span>
                <span className="text-blue-600 font-semibold">
                  P{parseFloat(cat.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {event.registrationLink && (
          <div className="mt-6">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              Register Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
          <Link href={`/events/${event.id}/edit`}>
            <Button>Edit Event</Button>
          </Link>
          <DeleteButton eventId={event.id} />
        </div>
      </Card>
    </div>
  );
}
