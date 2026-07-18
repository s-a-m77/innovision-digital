-- Remove the bootstrap-admin RPC entirely.
-- Admin roles should be assigned directly in the database or through a trusted backend tool.

DROP FUNCTION IF EXISTS public.bootstrap_first_admin(uuid);
DROP FUNCTION IF EXISTS public.bootstrap_first_admin();