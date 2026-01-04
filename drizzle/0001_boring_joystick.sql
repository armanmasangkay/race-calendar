CREATE TABLE "event_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
