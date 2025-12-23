import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl border border-rose-100',
          'shadow-[0_4px_20px_-5px_rgba(244,63,94,0.1)]',
          'transition-all duration-300 ease-out',
          'hover:shadow-[0_8px_30px_-5px_rgba(244,63,94,0.15)]',
          'hover:-translate-y-1',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
export { Card };
