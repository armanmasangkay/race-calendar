import { notFound } from 'next/navigation';
import Link from 'next/link';
import { EventForm } from '@/components/events';
import { getEventById } from '@/lib/actions/events';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEventById(parseInt(id));

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href={`/events/${event.id}`}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Event
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Race Event</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <EventForm event={event} mode="edit" />
      </div>
    </div>
  );
}
