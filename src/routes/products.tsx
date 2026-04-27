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
  link_url: string | null;
  image_1_url: string | null;
  image_2_url: string | null;
  image_3_url: string | null;
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
        supabase.from("products").select("id,name,tag,description,features,accent,link_url,image_1_url,image_2_url,image_3_url").eq("active", true).order("sort_order"),
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
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Projects Showcase</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">Recent work we're proud of.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A selection of projects we've shipped — explore visuals, read the brief, and follow the link to dive in.
            </p>
          </div>

          {loadingProjects ? (
            <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : projects.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">No projects published yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const images = [project.image_1_url, project.image_2_url, project.image_3_url].filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant animate-fade-in">
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {images.length > 0 ? (
          <>
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                  i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } group-hover:scale-[1.03]`}
              />
            ))}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-background/80 backdrop-blur px-2 py-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show image ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-primary-glow" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{project.description}</p>
        {project.link_url && (
          <a
            href={project.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-glow hover:opacity-80 transition-smooth"
          >
            Visit project <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const images = [p.image_1_url, p.image_2_url, p.image_3_url].filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  const accent = p.accent;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-smooth hover:-translate-y-1 animate-fade-in ${
        accent
          ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow hover:shadow-elegant"
          : "bg-card text-card-foreground border-border shadow-card hover:shadow-elegant"
      }`}
    >
      {images.length > 0 && (
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${p.name} screenshot ${i + 1}`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } group-hover:scale-[1.03]`}
            />
          ))}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 rounded-full bg-background/80 backdrop-blur px-2 py-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-primary-glow" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-8">
        {p.tag && (
          <span className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-primary-foreground/80" : "text-primary-glow"}`}>
            {p.tag}
          </span>
        )}
        <h2 className="mt-3 text-2xl font-bold tracking-tight">{p.name}</h2>
        <p className={`mt-3 text-sm leading-relaxed ${accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
          {p.description}
        </p>

        {p.features.length > 0 && (
          <ul className="mt-6 grid grid-cols-2 gap-2">
            {p.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className={`h-4 w-4 shrink-0 ${accent ? "text-primary-foreground" : "text-primary-glow"}`} />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-smooth ${
              accent ? "text-primary-foreground hover:opacity-90" : "text-foreground hover:text-primary-glow"
            }`}
          >
            Request a demo <ArrowRight className="h-4 w-4" />
          </Link>
          {p.link_url && (
            <a
              href={p.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-smooth ${
                accent ? "text-primary-foreground/90 hover:opacity-90" : "text-primary-glow hover:opacity-80"
              }`}
            >
              Visit project <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
