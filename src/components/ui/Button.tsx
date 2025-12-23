import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold cursor-pointer',
          'rounded-xl transition-all duration-300 ease-out',
          'transform hover:scale-105 hover:-translate-y-0.5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-400',
          'disabled:pointer-events-none disabled:opacity-50 disabled:transform-none',
          'shadow-sm hover:shadow-md',
          {
            'bg-gradient-to-r from-rose-500 to-rose-400 text-white hover:from-rose-600 hover:to-rose-500': variant === 'primary',
            'bg-teal-100 text-teal-700 hover:bg-teal-200': variant === 'secondary',
            'border-2 border-rose-300 bg-transparent text-rose-600 hover:bg-rose-50 hover:border-rose-400': variant === 'outline',
            'bg-transparent text-stone-600 hover:bg-rose-50 hover:text-rose-600 shadow-none': variant === 'ghost',
            'bg-gradient-to-r from-red-500 to-red-400 text-white hover:from-red-600 hover:to-red-500': variant === 'danger',
          },
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-5': size === 'md',
            'h-13 px-7 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button };
