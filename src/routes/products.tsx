import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, ExternalLink, ImageOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & Projects — Nexora" },
      { name: "description", content: "Discover Nexora's product suite and recent project showcase — built to power modern digital business." },
      { property: "og:title", content: "Products & Projects — Nexora" },
      { property: "og:description", content: "Modern products and a portfolio of recent work for sales, operations, intelligence, and security." },
    ],
  }),
  component: ProductsPage,
});

interface Product {
  id: string;
  name: string;
  tag: string | null;
  description: string;
  features: string[];
  accent: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  link_url: string | null;
  image_1_url: string | null;
  image_2_url: string | null;
  image_3_url: string | null;
}

function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ data: productsData }, { data: projectsData }] = await Promise.all([
        supabase.from("products").select("id,name,tag,description,features,accent").eq("active", true).order("sort_order"),
        supabase.from("projects").select("id,title,description,link_url,image_1_url,image_2_url,image_3_url").eq("active", true).order("sort_order"),
      ]);
      if (mounted) {
        setItems(productsData ?? []);
        setProjects((projectsData ?? []) as Project[]);
        setLoading(false);
        setLoadingProjects(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Products</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Software products that work the way your team does.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 leading-relaxed">
            Our suite of products is built on the same foundations we use to ship customer projects — modern, fast, and designed for real business outcomes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {items.map((p) => (
              <article
                key={p.id}
                className={`group p-8 rounded-2xl border transition-smooth hover:-translate-y-1 animate-fade-in ${
                  p.accent
                    ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow hover:shadow-elegant"
                    : "bg-card text-card-foreground border-border shadow-card hover:shadow-elegant"
                }`}
              >
                {p.tag && (
                  <span className={`text-xs font-semibold uppercase tracking-wider ${p.accent ? "text-primary-foreground/80" : "text-primary-glow"}`}>
                    {p.tag}
                  </span>
                )}
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{p.name}</h2>
                <p className={`mt-3 text-sm leading-relaxed ${p.accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                  {p.description}
                </p>

                {p.features.length > 0 && (
                  <ul className="mt-6 grid grid-cols-2 gap-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${p.accent ? "text-primary-foreground" : "text-primary-glow"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-7">
                  <Link
                    to="/contact"
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-smooth ${
                      p.accent ? "text-primary-foreground hover:opacity-90" : "text-foreground hover:text-primary-glow"
                    }`}
                  >
                    Request a demo <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
