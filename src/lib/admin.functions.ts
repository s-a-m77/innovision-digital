import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const bootstrapFirstAdmin = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    const { count, error: countError } = await supabaseAdmin
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    if (countError) throw new Error(countError.message);
    if ((count ?? 0) > 0) {
      throw new Error('Admin already exists. Ask an existing admin to grant access.');
    }

    const { error: insertError } = await supabaseAdmin
      .from('user_roles')
      .insert({ user_id: context.userId, role: 'admin' });
    if (insertError) throw new Error(insertError.message);

    return { ok: true };
  });
