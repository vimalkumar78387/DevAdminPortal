DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'changelog' AND column_name = 'id'
  ) THEN
    ALTER TABLE "changelog" ADD COLUMN id uuid;
  END IF;
END$$;

UPDATE "changelog" SET id = gen_random_uuid() WHERE id IS NULL;

ALTER TABLE "changelog" ALTER COLUMN id SET DEFAULT gen_random_uuid();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'changelog' AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE "changelog" ADD CONSTRAINT changelog_pkey PRIMARY KEY (id);
  END IF;
END$$;
