'use server';

import { db } from '@/lib/db';
import { eventQueue, QueueItem } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { queueItemSchema } from '@/lib/validations/queue';
import { assertAdmin } from '@/lib/auth/admin';

export async function createQueueItem(formData: FormData) {
  await assertAdmin();

  const rawData = {
    url: formData.get('url') as string,
    notes: formData.get('notes') as string || undefined,
  };

  const validated = queueItemSchema.parse(rawData);

  const [newItem] = await db.insert(eventQueue).values({
    url: validated.url,
    notes: validated.notes || null,
  }).returning();

  revalidatePath('/');
  revalidatePath('/queue');

  return { success: true, itemId: newItem.id };
}

export async function deleteQueueItem(id: number) {
  await assertAdmin();

  await db.delete(eventQueue).where(eq(eventQueue.id, id));

  revalidatePath('/');
  revalidatePath('/queue');

  return { success: true };
}

export async function getQueueItems(): Promise<QueueItem[]> {
  const result = await db.select().from(eventQueue).orderBy(desc(eventQueue.createdAt));
  return result;
}

export async function getQueueItemById(id: number): Promise<QueueItem | null> {
  const result = await db.select().from(eventQueue).where(eq(eventQueue.id, id)).limit(1);
  return result[0] || null;
}
