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

const eventColors = [
  'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 hover:from-rose-200 hover:to-rose-300',
  'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 hover:from-teal-200 hover:to-teal-300',
  'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 hover:from-amber-200 hover:to-amber-300',
  'bg-gradient-to-r from-violet-100 to-violet-200 text-violet-700 hover:from-violet-200 hover:to-violet-300',
];

export function CalendarDay({ day, events, isCurrentMonth, isToday }: CalendarDayProps) {
  const hasEvents = events.length > 0;

  return (
    <div
      className={cn(
        'min-h-[60px] sm:min-h-[80px] p-1.5 rounded-lg transition-all duration-200',
        'border border-transparent',
        !isCurrentMonth && 'bg-stone-50 text-stone-300',
        isCurrentMonth && 'hover:border-rose-200 hover:bg-rose-50/30',
        isToday && 'bg-gradient-to-br from-amber-50 to-rose-50 border-amber-200',
      )}
    >
      <div className="flex flex-col h-full">
        <span
          className={cn(
            'text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full',
            isToday && 'bg-rose-500 text-white',
            !isToday && isCurrentMonth && 'text-stone-700',
          )}
        >
          {format(day, 'd')}
        </span>
        <div className="flex-1 overflow-hidden mt-1">
          {events.slice(0, 2).map((event, index) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className={cn(
                'block text-xs truncate px-1.5 py-0.5 rounded-md mb-0.5 font-medium',
                'transition-all duration-200 transform hover:scale-105',
                eventColors[index % eventColors.length]
              )}
            >
              🏃 {event.name}
            </Link>
          ))}
          {events.length > 2 && (
            <span className="text-xs text-rose-400 font-semibold">+{events.length - 2} more 🎉</span>
          )}
        </div>
      </div>
    </div>
  );
}
