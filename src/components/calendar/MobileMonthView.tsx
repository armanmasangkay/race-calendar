'use client';

import { useState } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { EventList } from '@/components/events';
import { EventWithCategories } from '@/lib/db/schema';

interface MobileMonthViewProps {
  events: EventWithCategories[];
  currentMonth: string;
}

export function MobileMonthView({ events, currentMonth }: MobileMonthViewProps) {
  const router = useRouter();
  const [month, setMonth] = useState(new Date(currentMonth + '-01'));

  const handlePrevMonth = () => {
    const newMonth = subMonths(month, 1);
    setMonth(newMonth);
    router.push(`/?month=${format(newMonth, 'yyyy-MM')}`);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(month, 1);
    setMonth(newMonth);
    router.push(`/?month=${format(newMonth, 'yyyy-MM')}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-5">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="hover:bg-rose-50 hover:text-rose-500 rounded-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
          <span>📅</span>
          {format(month, 'MMMM yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="hover:bg-rose-50 hover:text-rose-500 rounded-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
      <EventList events={events} />
    </div>
  );
}
