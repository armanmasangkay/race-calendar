import { AllowedEmail } from '@/lib/db/schema';
import { AllowedEmailCard } from './AllowedEmailCard';

interface AllowedEmailListProps {
  items: AllowedEmail[];
}

export function AllowedEmailList({ items }: AllowedEmailListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 px-6 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 rounded-2xl border border-rose-100">
        <div className="text-4xl mb-3">📧</div>
        <p className="text-stone-600 font-medium">No allowed emails yet</p>
        <p className="text-stone-400 text-sm mt-1">
          Add email addresses to allow users to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <AllowedEmailCard item={item} />
        </div>
      ))}
    </div>
  );
}
