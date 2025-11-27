ALTER TABLE "changelog"
ADD COLUMN IF NOT EXISTS "product_name" varchar(255) NOT NULL DEFAULT '';
