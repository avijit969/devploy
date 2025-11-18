ALTER TABLE "projects" ADD COLUMN "live_url" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "deploy_status" varchar(50) DEFAULT 'pending' NOT NULL;