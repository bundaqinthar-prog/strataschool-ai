
-- Function to promote a user to admin (can only be called via service role)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
BEGIN
  SELECT id INTO _user_id FROM public.profiles WHERE email = _email;
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', _email;
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  UPDATE public.profiles SET status = 'approved' WHERE id = _user_id;
END;
$$;
