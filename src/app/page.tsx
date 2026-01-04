import { Suspense } from 'react';
import { format } from 'date-fns';
import { CalendarView, MobileMonthView } from '@/components/calendar';
import { EventList, SearchBar } from '@/components/events';
import { QuickQueueView } from '@/components/queue';
import { getEvents, searchEvents } from '@/lib/actions/events';
import { getQueueItems } from '@/lib/actions/queue';

interface HomePageProps {
  searchParams: Promise<{ month?: string; search?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentMonth = params.month || format(new Date(), 'yyyy-MM');
  const isSearching = !!params.search;

  const [events, searchResults, queueItems] = await Promise.all([
    getEvents(currentMonth),
    isSearching ? searchEvents(params.search!) : Promise.resolve([]),
    getQueueItems(),
  ]);

  const displayEvents = isSearching ? searchResults : events;

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

      <Suspense fallback={null}>
        <SearchBar className="max-w-xl mx-auto mb-8" />
      </Suspense>

      {isSearching ? (
        <div>
          <p className="text-stone-500 mb-4">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{params.search}&quot;
          </p>
          <EventList events={searchResults} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Desktop: Calendar view */}
          <div className="hidden lg:block lg:col-span-2">
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

          {/* Mobile: Events list with month navigation */}
          <div className="lg:hidden">
            <MobileMonthView events={events} currentMonth={currentMonth} />
          </div>

          <div className="space-y-6">
            <QuickQueueView items={queueItems} />

            {/* Desktop only: Events sidebar */}
            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <span>📆</span>
                Events in {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
              </h2>
              <EventList events={events} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
