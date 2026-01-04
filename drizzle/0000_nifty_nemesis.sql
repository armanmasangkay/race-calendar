CREATE TABLE "event_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"promo_price" numeric(10, 2),
	"promo_deadline" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"race_date" date NOT NULL,
	"location" varchar(255) NOT NULL,
	"registration_link" text,
	"payment_deadline" date,
	"is_cancelled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_categories" ADD CONSTRAINT "event_categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;