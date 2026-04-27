import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, LogOut, ShieldAlert, Newspaper, Briefcase, Package, Inbox, FolderKanban } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Nexora" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

const adminNav = [
  { to: "/admin", label: "Announcements", icon: Newspaper, exact: true },
  { to: "/admin/services", label: "Services", icon: Briefcase, exact: false },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/messages", label: "Messages", icon: Inbox, exact: false },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  async function grantSelfAdmin() {
    if (!user) return;
    const { error } = await supabase.rpc("bootstrap_first_admin");
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Admin role granted. Reloading…");
    setTimeout(() => window.location.reload(), 600);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="mt-5 text-xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.email}</span>, but this account doesn't have the admin role yet.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Bootstrap mode: if you're the project owner, click below to grant yourself the admin role. Afterwards, only existing admins can promote new users.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={grantSelfAdmin}
              className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
            >
              Grant me admin
            </button>
            <button
              onClick={() => signOut().then(() => navigate({ to: "/" }))}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-smooth"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Admin</span>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">Content dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <button
          onClick={() => signOut().then(() => navigate({ to: "/" }))}
          className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-secondary transition-smooth"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border">
        {adminNav.map((tab) => {
          const active = tab.exact
            ? location.pathname === tab.to
            : location.pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-smooth ${
                active
                  ? "border-primary-glow text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
