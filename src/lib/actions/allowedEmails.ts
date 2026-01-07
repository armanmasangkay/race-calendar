'use server';

import { db } from '@/lib/db';
import { allowedEmails, AllowedEmail } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { allowedEmailSchema } from '@/lib/validations/allowedEmail';
import { assertAdmin } from '@/lib/auth/admin';
import { auth } from '@/lib/auth';

export async function addAllowedEmail(formData: FormData) {
  const session = await assertAdmin();

  const rawData = {
    email: formData.get('email') as string,
  };

  const validated = allowedEmailSchema.parse(rawData);

  // Check if email already exists
  const existing = await db.select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, validated.email))
    .limit(1);

  if (existing.length > 0) {
    throw new Error('Email is already in the allowed list');
  }

  await db.insert(allowedEmails).values({
    email: validated.email,
    addedBy: session.user.id,
  });

  revalidatePath('/admin/allowed-emails');

  return { success: true };
}

export async function removeAllowedEmail(id: number) {
  await assertAdmin();

  await db.delete(allowedEmails).where(eq(allowedEmails.id, id));

  revalidatePath('/admin/allowed-emails');

  return { success: true };
}

export async function getAllowedEmails(): Promise<AllowedEmail[]> {
  return db.select()
    .from(allowedEmails)
    .orderBy(desc(allowedEmails.createdAt));
}

export async function isEmailAllowed(email: string): Promise<boolean> {
  const result = await db.select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, email.toLowerCase()))
    .limit(1);

  return result.length > 0;
}
