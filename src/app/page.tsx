import { Suspense } from 'react';
import { format } from 'date-fns';
import { CalendarView } from '@/components/calendar';
import { EventList } from '@/components/events';
import { getEvents } from '@/lib/actions/events';

interface HomePageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentMonth = params.month || format(new Date(), 'yyyy-MM');
  const events = await getEvents(currentMonth);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Race Calendar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="bg-white rounded-lg shadow p-4">Loading calendar...</div>}>
            <CalendarView events={events} />
          </Suspense>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Events in {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
          </h2>
          <EventList events={events} compact />
        </div>
      </div>
    </div>
  );
}
