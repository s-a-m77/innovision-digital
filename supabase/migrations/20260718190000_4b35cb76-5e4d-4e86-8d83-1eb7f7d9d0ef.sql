-- Keep first-admin bootstrap from tripping over orphaned role rows.
-- Only a role linked to a live auth user should block the initial admin claim.

CREATE OR REPLACE FUNCTION public.bootstrap_first_admin(current_uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  admin_count integer;
BEGIN
  IF current_uid IS NULL THEN
    RAISE EXCEPTION 'Must be signed in';
  END IF;

  SELECT count(*) INTO admin_count
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
    AND EXISTS (
      SELECT 1
      FROM auth.users au
      WHERE au.id = ur.user_id
    );

  IF admin_count > 0 THEN
    RAISE EXCEPTION 'Admin already exists. Ask an existing admin to grant access.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (current_uid, 'admin')
  ON CONFLICT DO NOTHING;

  RETURN true;
END;
$$;