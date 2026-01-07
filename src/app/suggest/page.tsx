import { SubmitEventWidget } from '@/components/footer';

export const metadata = {
  title: 'Suggest an Event | Race Calendar',
  description: 'Submit a running event to be added to the Race Calendar',
};

export default function SuggestEventPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-2">
          Suggest an Event
        </h1>
        <p className="text-stone-600 text-sm">
          Know of a running event that should be on our calendar? Submit it below and we&apos;ll review it for inclusion.
        </p>
      </div>

      <SubmitEventWidget defaultExpanded />

      <p className="text-center text-stone-400 text-xs mt-6">
        All submissions are reviewed by our team before being published.
      </p>
    </div>
  );
}
