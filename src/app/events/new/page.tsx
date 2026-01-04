import { EventForm } from '@/components/events';
import { getQueueItemById } from '@/lib/actions/queue';

interface NewEventPageProps {
  searchParams: Promise<{ fromQueue?: string }>;
}

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const params = await searchParams;
  const queueItemId = params.fromQueue ? parseInt(params.fromQueue) : null;
  const queueItem = queueItemId ? await getQueueItemById(queueItemId) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-8 flex items-center gap-3">
        <span className="text-4xl">✨</span>
        Add New Race Event
      </h1>

      {queueItem && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-sm text-teal-700 font-medium flex items-center gap-2">
            <span>🔗</span>
            Creating from queue item
          </p>
          <a
            href={queueItem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline truncate block mt-1"
          >
            {queueItem.url} ↗
          </a>
          {queueItem.notes && (
            <p className="text-sm text-teal-600 mt-2">
              <span className="font-medium">Notes:</span> {queueItem.notes}
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-8">
        <EventForm mode="create" queueItemId={queueItemId} />
      </div>
    </div>
  );
}
