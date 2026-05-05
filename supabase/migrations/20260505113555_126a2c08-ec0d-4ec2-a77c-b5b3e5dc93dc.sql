
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS province text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS postal_code text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;
