import Link from 'next/link';
import { format } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { EventWithCategories } from '@/lib/db/schema';

interface EventCardProps {
  event: EventWithCategories;
  showActions?: boolean;
  compact?: boolean;
}

export function EventCard({ event, showActions = true, compact = false }: EventCardProps) {
  const isDeadlinePassed =
    event.paymentDeadline && new Date(event.paymentDeadline) < new Date();

  const raceDate = new Date(event.raceDate);
  const isUpcoming = raceDate >= new Date();

  return (
    <Card className={`p-4 ${!isUpcoming ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link href={`/events/${event.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600">
              {format(raceDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-600">{event.location}</span>
          </div>
        </div>
        {showActions && (
          <Link href={`/events/${event.id}/edit`}>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </Link>
        )}
      </div>

      {!compact && (
        <>
          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-2">
            {event.categories.map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {cat.categoryName}: P{parseFloat(cat.price).toLocaleString()}
              </span>
            ))}
          </div>

          {/* Payment Deadline */}
          {event.paymentDeadline && (
            <p
              className={`text-xs mt-3 flex items-center gap-1 ${
                isDeadlinePassed ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payment deadline: {format(new Date(event.paymentDeadline), 'MMM d, yyyy')}
              {isDeadlinePassed && ' (Passed)'}
            </p>
          )}

          {/* Registration Link */}
          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Register Here
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </>
      )}
    </Card>
  );
}
