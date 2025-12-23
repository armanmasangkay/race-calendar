'use client';

import { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  format,
} from 'date-fns';
import { CalendarHeader } from './CalendarHeader';
import { CalendarDay } from './CalendarDay';
import { EventWithCategories } from '@/lib/db/schema';
import { useRouter, useSearchParams } from 'next/navigation';

interface CalendarViewProps {
  events: EventWithCategories[];
}

export function CalendarView({ events }: CalendarViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const monthParam = searchParams.get('month');
  const initialMonth = monthParam
    ? new Date(monthParam + '-01')
    : new Date();

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    router.push(`/?month=${format(newMonth, 'yyyy-MM')}`);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    router.push(`/?month=${format(newMonth, 'yyyy-MM')}`);
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.raceDate), day));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <div className="mt-4">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => (
            <CalendarDay
              key={day.toISOString()}
              day={day}
              events={getEventsForDay(day)}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isToday={isToday(day)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
