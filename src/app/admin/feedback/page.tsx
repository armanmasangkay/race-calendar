import { FeedbackList } from '@/components/feedback';
import { getFeedbackItems, getFeedbackCounts } from '@/lib/actions/feedback';

export default async function FeedbackPage() {
  const [items, counts] = await Promise.all([
    getFeedbackItems(),
    getFeedbackCounts(),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-4xl">💬</span>
          User Feedback
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-rose-100 shadow-sm">
          <p className="text-2xl font-bold text-stone-800">{counts.total}</p>
          <p className="text-xs text-stone-500">Total</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-sm">
          <p className="text-2xl font-bold text-amber-700">{counts.pending}</p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-200 shadow-sm">
          <p className="text-2xl font-bold text-teal-700">{counts.features}</p>
          <p className="text-xs text-teal-600">Features</p>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 shadow-sm">
          <p className="text-2xl font-bold text-rose-700">{counts.bugs}</p>
          <p className="text-xs text-rose-600">Bugs</p>
        </div>
      </div>

      <FeedbackList items={items} />
    </div>
  );
}
