'use client';

import { Input, Button } from '@/components/ui';

interface Category {
  name: string;
  price: string;
  promoPrice?: string;
  promoDeadline?: string;
  hasPromo?: boolean;
  registrationLink?: string;
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
  const togglePromo = () => {
    onChange({
      ...category,
      hasPromo: !category.hasPromo,
      promoPrice: !category.hasPromo ? category.promoPrice : '',
      promoDeadline: !category.hasPromo ? category.promoDeadline : '',
    });
  };

  return (
    <div className="mb-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
      <div className="flex gap-3 items-end">
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
            label={index === 0 ? 'Regular Price' : undefined}
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
            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 mb-0.5"
          >
            ❌
          </Button>
        )}
      </div>

      <label className="flex items-center gap-2 mt-3 cursor-pointer text-sm text-stone-600">
        <input
          type="checkbox"
          checked={category.hasPromo || false}
          onChange={togglePromo}
          className="w-4 h-4 rounded border-stone-300 text-teal-500 focus:ring-teal-400"
        />
        <span>Add promo pricing</span>
      </label>

      {category.hasPromo && (
        <div className="flex gap-3 mt-3 pl-4 border-l-2 border-teal-200">
          <div className="w-32">
            <Input
              label="Promo Price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={category.promoPrice || ''}
              onChange={(e) => onChange({ ...category, promoPrice: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Promo Deadline"
              type="date"
              value={category.promoDeadline || ''}
              onChange={(e) => onChange({ ...category, promoDeadline: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="mt-3">
        <Input
          label="Registration Link (optional)"
          type="url"
          placeholder="https://example.com/register/category"
          value={category.registrationLink || ''}
          onChange={(e) => onChange({ ...category, registrationLink: e.target.value })}
        />
        <p className="text-xs text-stone-500 mt-1">
          Leave blank to use the event&apos;s main registration link
        </p>
      </div>
    </div>
  );
}
