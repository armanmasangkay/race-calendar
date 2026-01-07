import { pgTable, serial, varchar, text, date, timestamp, decimal, integer, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  raceDate: date('race_date').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  registrationLink: text('registration_link'),
  detailsLink: text('details_link'),
  paymentDeadline: date('payment_deadline'),
  isCancelled: boolean('is_cancelled').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventCategories = pgTable('event_categories', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  categoryName: varchar('category_name', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  promoPrice: decimal('promo_price', { precision: 10, scale: 2 }),
  promoDeadline: date('promo_deadline'),
  registrationLink: text('registration_link'),
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

// Event Queue - for tracking Facebook links to add later
export const eventQueue = pgTable('event_queue', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type QueueItem = typeof eventQueue.$inferSelect;
export type NewQueueItem = typeof eventQueue.$inferInsert;

// NextAuth.js tables
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] }),
]);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
