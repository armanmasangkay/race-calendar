'use client';

import { Input, Button } from '@/components/ui';

interface Category {
  name: string;
  price: string;
}

interface CategoryInputProps {
  index: number;
  category: Category;
  onChange: (category: Category) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function CategoryInput({
  index,
  category,
  onChange,
  onRemove,
  canRemove,
}: CategoryInputProps) {
  return (
    <div className="flex gap-2 items-end mb-2">
      <div className="flex-1">
        <Input
          label={index === 0 ? 'Category' : undefined}
          placeholder="e.g., 5K, 10K, Half Marathon"
          value={category.name}
          onChange={(e) => onChange({ ...category, name: e.target.value })}
        />
      </div>
      <div className="w-32">
        <Input
          label={index === 0 ? 'Price' : undefined}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={category.price}
          onChange={(e) => onChange({ ...category, price: e.target.value })}
        />
      </div>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      )}
    </div>
  );
}
