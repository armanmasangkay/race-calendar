import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-stone-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-2.5 border-2 border-stone-200 rounded-xl',
            'bg-white shadow-sm',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-0 focus:border-teal-400',
            'focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)]',
            'placeholder:text-stone-400',
            'disabled:bg-stone-100 disabled:cursor-not-allowed',
            error && 'border-rose-400 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-rose-500 flex items-center gap-1">
            <span>!</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
