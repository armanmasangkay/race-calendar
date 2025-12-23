'use client';

import { useRouter } from 'next/navigation';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui';

interface MonthFilterProps {
  currentMonth?: string;
  basePath?: string;
}

export function MonthFilter({ currentMonth, basePath = '/events' }: MonthFilterProps) {
  const router = useRouter();

  const current = currentMonth ? new Date(currentMonth + '-01') : new Date();

  const handlePrevMonth = () => {
    const newMonth = subMonths(current, 1);
    router.push(`${basePath}?month=${format(newMonth, 'yyyy-MM')}`);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(current, 1);
    router.push(`${basePath}?month=${format(newMonth, 'yyyy-MM')}`);
  };

  const handleClear = () => {
    router.push(basePath);
  };

  return (
    <div className="flex items-center gap-4 mb-6 bg-white rounded-2xl p-4 border border-rose-100 shadow-sm">
      <div className="flex items-center gap-3">
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
        <span className="text-sm font-bold min-w-[140px] text-center text-stone-700 flex items-center justify-center gap-2">
          <span>📆</span>
          {format(current, 'MMMM yyyy')}
        </span>
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
      {currentMonth && (
        <Button variant="outline" size="sm" onClick={handleClear}>
          🎯 Show All
        </Button>
      )}
    </div>
  );
}
