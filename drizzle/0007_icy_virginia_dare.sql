CREATE TABLE "feedback_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" text NOT NULL,
	"email" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"submitter_ip" varchar(45),
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
