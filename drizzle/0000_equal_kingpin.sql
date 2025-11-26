CREATE TABLE IF NOT EXISTS "admin_activity_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "admin_username" varchar(150) NOT NULL,
  "action" varchar(50) NOT NULL,
  "target_type" varchar(50) NOT NULL,
  "target_id" uuid NOT NULL,
  "details" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
