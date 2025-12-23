'use server';

import { db } from '@/lib/db';
import { events, eventCategories, EventWithCategories } from '@/lib/db/schema';
import { eq, gte, lte, asc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { eventSchema } from '@/lib/validations/event';

export async function createEvent(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    raceDate: formData.get('raceDate') as string,
    location: formData.get('location') as string,
    registrationLink: formData.get('registrationLink') as string,
    paymentDeadline: formData.get('paymentDeadline') as string,
    categories: JSON.parse(formData.get('categories') as string),
  };

  const validated = eventSchema.parse(rawData);

  const [newEvent] = await db.insert(events).values({
    name: validated.name,
    raceDate: validated.raceDate,
    location: validated.location,
    registrationLink: validated.registrationLink || null,
    paymentDeadline: validated.paymentDeadline || null,
  }).returning();

  if (validated.categories.length > 0) {
    await db.insert(eventCategories).values(
      validated.categories.map((cat) => ({
        eventId: newEvent.id,
        categoryName: cat.name,
        price: cat.price,
      }))
    );
  }

  revalidatePath('/');
  revalidatePath('/events');

  return { success: true, eventId: newEvent.id };
}

export async function updateEvent(id: number, formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    raceDate: formData.get('raceDate') as string,
    location: formData.get('location') as string,
    registrationLink: formData.get('registrationLink') as string,
    paymentDeadline: formData.get('paymentDeadline') as string,
    categories: JSON.parse(formData.get('categories') as string),
  };

  const validated = eventSchema.parse(rawData);

  await db.update(events).set({
    name: validated.name,
    raceDate: validated.raceDate,
    location: validated.location,
    registrationLink: validated.registrationLink || null,
    paymentDeadline: validated.paymentDeadline || null,
    updatedAt: new Date(),
  }).where(eq(events.id, id));

  // Delete existing categories and insert new ones
  await db.delete(eventCategories).where(eq(eventCategories.eventId, id));

  if (validated.categories.length > 0) {
    await db.insert(eventCategories).values(
      validated.categories.map((cat) => ({
        eventId: id,
        categoryName: cat.name,
        price: cat.price,
      }))
    );
  }

  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath(`/events/${id}`);

  return { success: true };
}

export async function deleteEvent(id: number) {
  await db.delete(events).where(eq(events.id, id));

  revalidatePath('/');
  revalidatePath('/events');

  return { success: true };
}

export async function getEvents(month?: string): Promise<EventWithCategories[]> {
  let whereClause;

  if (month) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);

    whereClause = and(
      gte(events.raceDate, startDate.toISOString().split('T')[0]),
      lte(events.raceDate, endDate.toISOString().split('T')[0])
    );
  }

  const result = await db.query.events.findMany({
    where: whereClause,
    with: {
      categories: true,
    },
    orderBy: [asc(events.raceDate)],
  });

  return result;
}

export async function getAllEvents(): Promise<EventWithCategories[]> {
  const result = await db.query.events.findMany({
    with: {
      categories: true,
    },
    orderBy: [asc(events.raceDate)],
  });

  return result;
}

export async function getEventById(id: number): Promise<EventWithCategories | null> {
  const result = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: {
      categories: true,
    },
  });

  return result || null;
}

export async function getEventsByYear(year: string): Promise<EventWithCategories[]> {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const result = await db.query.events.findMany({
    where: and(
      gte(events.raceDate, startDate),
      lte(events.raceDate, endDate)
    ),
    with: {
      categories: true,
    },
    orderBy: [asc(events.raceDate)],
  });

  return result;
}
