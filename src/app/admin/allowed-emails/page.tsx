import { AllowedEmailList, AllowedEmailForm } from '@/components/allowed-emails';
import { getAllowedEmails } from '@/lib/actions/allowedEmails';

export default async function AllowedEmailsPage() {
  const items = await getAllowedEmails();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent flex items-center gap-3">
          <span className="text-4xl">📧</span>
          Allowed Emails
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AllowedEmailList items={items} />
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-6 sticky top-24">
            <h2 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span>➕</span>
              Add Allowed Email
            </h2>
            <AllowedEmailForm />
          </div>
        </div>
      </div>
    </div>
  );
}
