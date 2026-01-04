import { QueueList, QueueForm } from '@/components/queue';
import { getQueueItems } from '@/lib/actions/queue';

export default async function QueuePage() {
  const items = await getQueueItems();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-4xl">📋</span>
          Events to Add
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <QueueList items={items} />
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 sticky top-24">
            <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span>➕</span>
              Add to Queue
            </h2>
            <QueueForm />
          </div>
        </div>
      </div>
    </div>
  );
}
