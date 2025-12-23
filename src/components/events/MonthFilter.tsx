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
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <span className="text-sm font-medium min-w-[120px] text-center">
          {format(current, 'MMMM yyyy')}
        </span>
        <Button variant="ghost" size="sm" onClick={handleNextMonth}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
      {currentMonth && (
        <Button variant="outline" size="sm" onClick={handleClear}>
          Show All
        </Button>
      )}
    </div>
  );
}
