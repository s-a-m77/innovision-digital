-- Restore execute permission for the role helper used by RLS policies.
-- The application relies on public/anon/authenticated requests being able to
-- evaluate has_role() during normal reads.

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO PUBLIC;