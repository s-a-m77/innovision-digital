
-- 1) Lock down SECURITY DEFINER functions.
-- RLS policies invoke these as the table owner, so revoking EXECUTE from
-- anon/authenticated does not break policy evaluation.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.bootstrap_first_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- 2) Restrict public storage bucket listing.
-- Public URLs (GET on the public object endpoint) do not go through RLS,
-- so images remain publicly viewable via their URL. Only listing is restricted.
DROP POLICY IF EXISTS "Project images are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;

CREATE POLICY "Admins list project images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins list product images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Replace the always-true INSERT policy on contact_submissions
-- with a real validation check.
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;

CREATE POLICY "Anyone can submit valid contact"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 200
    AND char_length(btrim(email)) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(btrim(message)) BETWEEN 1 AND 5000
    AND handled = false
  );
