import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Nexora" },
      { name: "description", content: "Admin sign-in for the Nexora team." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin/dashboard" });
  }, [user, isAdmin, loading, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) {
        throw new Error("Unable to verify your account.");
      }

      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) throw roleError;

      if (!roleRow) {
        await supabase.auth.signOut();
        toast.error("You do not have administrator permissions.");
        return;
      }

      toast.success("Welcome back");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/login`,
      });
      if (error) throw error;
      toast.success("Password reset email sent.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not send password reset email";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center bg-gradient-hero">
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="rounded-2xl border border-white/10 bg-card p-8 shadow-elegant">
          <h1 className="text-2xl font-bold tracking-tight">Admin sign in</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <div className="mt-1.5 relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                  maxLength={255}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <div className="mt-1.5 relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  minLength={6}
                  maxLength={128}
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={submitting}
              className="w-full text-sm font-medium text-primary-glow hover:text-foreground transition-smooth disabled:opacity-60"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
