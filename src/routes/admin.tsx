import { createFileRoute, Outlet, useNavigate, Link, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, LogOut, Newspaper, Briefcase, Package, Inbox, FolderKanban } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Nexora" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLayout,
});

const adminNav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Newspaper, exact: true },
  { to: "/admin/services", label: "Services", icon: Briefcase, exact: false },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { to: "/admin/messages", label: "Messages", icon: Inbox, exact: false },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/admin/login";

  useEffect(() => {
    if (!loading && (!user || !isAdmin) && !isLoginRoute) navigate({ to: "/admin/login" });
    if (!loading && user && isAdmin && location.pathname === "/admin") {
      navigate({ to: "/admin/dashboard" });
    }
  }, [user, isAdmin, loading, navigate, location.pathname, isLoginRoute]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoginRoute) {
    return <Outlet />;
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">
            Admin
          </span>
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
