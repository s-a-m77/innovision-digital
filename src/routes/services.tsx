import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Nexora" },
      { name: "description", content: "Explore Nexora's full range of services: custom software, cloud, AI, security, and more." },
      { property: "og:title", content: "Services — Nexora" },
      { property: "og:description", content: "Custom software, cloud, mobile, AI, security, and analytics services." },
    ],
  }),
  component: ServicesPage,
});

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
}

function getIcon(name: string | null) {
  if (!name) return Icons.Sparkles;
  const lib = Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return lib[name] ?? Icons.Sparkles;
}

function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("services")
        .select("id,title,description,icon")
        .eq("active", true)
        .order("sort_order");
      if (mounted) {
        setItems(data ?? []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Services</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            End-to-end services to design, build, and scale your product.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 leading-relaxed">
            Whether you need a focused engagement or a long-term technology partner, Nexora delivers expertise across the full stack of modern digital business.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <article
                  key={s.id}
                  className="group p-7 rounded-2xl bg-card border border-border shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1 animate-fade-in"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow"
          >
            Discuss your project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
