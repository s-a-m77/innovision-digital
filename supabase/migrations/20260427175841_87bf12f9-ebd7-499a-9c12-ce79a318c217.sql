-- Bootstrap function: lets the very first signed-in user claim the admin role.
-- Once any admin exists, the function refuses further bootstrap attempts.
-- Subsequent admin assignments must be done by an existing admin (via the
-- existing "Admins can manage roles" RLS policy).

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_uid uuid := auth.uid();
  admin_count integer;
BEGIN
  IF current_uid IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  SELECT count(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';

  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin already exists. Ask an existing admin to grant access.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_uid, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO authenticated;