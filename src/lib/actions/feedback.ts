'use server';

import { db } from '@/lib/db';
import { feedbackQueue, FeedbackItem } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { adminFeedbackSchema } from '@/lib/validations/feedback';
import { assertAdmin } from '@/lib/auth/admin';

export async function getFeedbackItems(): Promise<FeedbackItem[]> {
  const result = await db.select().from(feedbackQueue).orderBy(desc(feedbackQueue.createdAt));
  return result;
}

export async function getFeedbackItemById(id: number): Promise<FeedbackItem | null> {
  const result = await db.select().from(feedbackQueue).where(eq(feedbackQueue.id, id)).limit(1);
  return result[0] || null;
}

export async function updateFeedbackStatus(id: number, formData: FormData) {
  await assertAdmin();

  const rawData = {
    status: formData.get('status') as string,
    adminNotes: formData.get('adminNotes') as string || undefined,
  };

  const validated = adminFeedbackSchema.parse(rawData);

  await db.update(feedbackQueue)
    .set({
      status: validated.status,
      adminNotes: validated.adminNotes || null,
      updatedAt: new Date(),
    })
    .where(eq(feedbackQueue.id, id));

  revalidatePath('/admin/feedback');

  return { success: true };
}

export async function deleteFeedbackItem(id: number) {
  await assertAdmin();

  await db.delete(feedbackQueue).where(eq(feedbackQueue.id, id));

  revalidatePath('/admin/feedback');

  return { success: true };
}

export async function getFeedbackCounts() {
  const items = await db.select().from(feedbackQueue);
  return {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    features: items.filter(i => i.type === 'feature').length,
    bugs: items.filter(i => i.type === 'bug').length,
  };
}
