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
        className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Event
      </Link>

      <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-8 flex items-center gap-3">
        <span className="text-4xl">✏️</span>
        Edit Race Event
      </h1>
      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8">
        <EventForm event={event} mode="edit" />
      </div>
    </div>
  );
}
