import Link from 'next/link';
import { Suspense } from 'react';
import { AlertBanner, Button } from '@/components/ui';
import { EventList, MonthFilter, SearchBar } from '@/components/events';
import { getEvents, getEventsByYear, searchEvents } from '@/lib/actions/events';
import { auth } from '@/lib/auth';
import { format } from 'date-fns';

interface EventsPageProps {
  searchParams: Promise<{ month?: string; year?: string; search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.isAdmin ?? false;
  const currentYear = params.year || format(new Date(), 'yyyy');
  const isYearView = !params.month;
  const isSearching = !!params.search;

  const events = isSearching
    ? await searchEvents(params.search!)
    : params.month
      ? await getEvents(params.month)
      : await getEventsByYear(currentYear);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-4xl">🎯</span>
          All Race Events
        </h1>
{isAdmin && (
          <Link href="/events/new">
            <Button>✨ Add Event</Button>
          </Link>
        )}
      </div>

      <AlertBanner />

      <Suspense fallback={null}>
        <SearchBar className="mb-4" />
      </Suspense>

      {!isSearching && (
        <MonthFilter currentMonth={params.month} currentYear={currentYear} />
      )}

      {isSearching && (
        <p className="text-stone-500 mb-4">
          {events.length} result{events.length !== 1 ? 's' : ''} for &quot;{params.search}&quot;
        </p>
      )}

      <EventList events={events} groupByMonth={isYearView && !isSearching} isAdmin={isAdmin} />
    </div>
  );
}
