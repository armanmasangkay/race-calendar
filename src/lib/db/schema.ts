import { pgTable, serial, varchar, text, date, timestamp, decimal, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  raceDate: date('race_date').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  registrationLink: text('registration_link'),
  paymentDeadline: date('payment_deadline'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventCategories = pgTable('event_categories', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  categoryName: varchar('category_name', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const eventsRelations = relations(events, ({ many }) => ({
  categories: many(eventCategories),
}));

export const eventCategoriesRelations = relations(eventCategories, ({ one }) => ({
  event: one(events, {
    fields: [eventCategories.eventId],
    references: [events.id],
  }),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventCategory = typeof eventCategories.$inferSelect;
export type NewEventCategory = typeof eventCategories.$inferInsert;

export type EventWithCategories = Event & {
  categories: EventCategory[];
};
