'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({ currentMonth, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevMonth}
        className="hover:bg-rose-50 hover:text-rose-500 rounded-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>
      <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
        <span>📅</span>
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNextMonth}
        className="hover:bg-rose-50 hover:text-rose-500 rounded-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  );
}
