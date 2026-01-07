ALTER TABLE "event_queue" ADD COLUMN "title" varchar(255);--> statement-breakpoint
ALTER TABLE "event_queue" ADD COLUMN "source" varchar(20) DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE "event_queue" ADD COLUMN "submitter_ip" varchar(45);