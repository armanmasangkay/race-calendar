'use client';

import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { EventWithCategories } from '@/lib/db/schema';
import Link from 'next/link';

interface CalendarDayProps {
  day: Date;
  events: EventWithCategories[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function CalendarDay({ day, events, isCurrentMonth, isToday }: CalendarDayProps) {
  const hasEvents = events.length > 0;

  return (
    <div
      className={cn(
        'min-h-[60px] sm:min-h-[80px] p-1 border border-gray-100',
        !isCurrentMonth && 'bg-gray-50 text-gray-400',
        isToday && 'bg-blue-50',
      )}
    >
      <div className="flex flex-col h-full">
        <span
          className={cn(
            'text-sm font-medium',
            isToday && 'text-blue-600',
          )}
        >
          {format(day, 'd')}
        </span>
        <div className="flex-1 overflow-hidden">
          {events.slice(0, 2).map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block text-xs truncate bg-blue-100 text-blue-800 px-1 py-0.5 rounded mb-0.5 hover:bg-blue-200"
            >
              {event.name}
            </Link>
          ))}
          {events.length > 2 && (
            <span className="text-xs text-gray-500">+{events.length - 2} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
