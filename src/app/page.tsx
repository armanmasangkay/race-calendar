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
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-amber-500 to-teal-500 bg-clip-text text-transparent inline-flex items-center gap-3">
          <span className="animate-bounce-subtle">🏃</span>
          Race Calendar
          <span className="animate-bounce-subtle" style={{ animationDelay: '0.5s' }}>🎉</span>
        </h1>
        <p className="text-stone-600 mt-3 text-lg">
          Find your next adventure! 🏅
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-rose-100 animate-pulse">
              <div className="h-8 bg-rose-100 rounded-xl w-1/3 mb-4"></div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="h-16 bg-orange-50 rounded-lg"></div>
                ))}
              </div>
            </div>
          }>
            <CalendarView events={events} />
          </Suspense>
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
            <span>📆</span>
            Events in {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
          </h2>
          <EventList events={events} compact />
        </div>
      </div>
    </div>
  );
}
