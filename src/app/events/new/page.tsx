import { EventForm } from '@/components/events';

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Race Event</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
