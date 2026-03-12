
-- Add jabatan column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS jabatan text NOT NULL DEFAULT '';

-- Replace the handle_new_user trigger function to also save jabatan and school_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, school_name, jabatan, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'school_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'jabatan', ''),
    'pending'
  );
  RETURN NEW;
END;
$function$;
