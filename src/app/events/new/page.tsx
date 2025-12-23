import { EventForm } from '@/components/events';

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-8 flex items-center gap-3">
        <span className="text-4xl">✨</span>
        Add New Race Event
      </h1>
      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
