-- Guestbook storage for siphoyawe.com
-- Run once against the Neon database:
--   psql "$DATABASE_URL" -f schema.sql
-- gen_random_uuid() is provided by the pgcrypto extension (built into Neon).

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  ip_hash text
);

CREATE INDEX IF NOT EXISTS guestbook_entries_approved_created_idx
  ON guestbook_entries (approved, created_at DESC);
