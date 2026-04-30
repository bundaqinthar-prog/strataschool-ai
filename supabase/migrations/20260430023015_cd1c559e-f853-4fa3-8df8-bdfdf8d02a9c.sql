ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_months integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS subscription_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _months integer;
BEGIN
  _months := COALESCE((NEW.raw_user_meta_data->>'subscription_months')::int, 1);
  IF _months NOT IN (1,3,6,12) THEN
    _months := 1;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, school_name, jabatan, status, subscription_months)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'school_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'jabatan', ''),
    'pending',
    _months
  );
  RETURN NEW;
END;
$function$;