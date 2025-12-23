import Link from 'next/link';
import { Button } from '@/components/ui';
import { EventList, MonthFilter } from '@/components/events';
import { getEvents, getAllEvents } from '@/lib/actions/events';

interface EventsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const events = params.month ? await getEvents(params.month) : await getAllEvents();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-4xl">🎯</span>
          All Race Events
        </h1>
        <Link href="/events/new">
          <Button>✨ Add Event</Button>
        </Link>
      </div>

      <MonthFilter currentMonth={params.month} />

      <EventList events={events} />
    </div>
  );
}
