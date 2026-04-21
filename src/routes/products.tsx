import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Nexora" },
      { name: "description", content: "Discover Nexora's product suite: NexCRM, FlowOps, InsightAI, and SecureGate — built to power modern digital business." },
      { property: "og:title", content: "Products — Nexora" },
      { property: "og:description", content: "Modern products for sales, operations, intelligence, and security." },
    ],
  }),
  component: ProductsPage,
});

const products = [
  {
    name: "NexCRM",
    tag: "Sales Platform",
    desc: "An intuitive CRM that gives your sales team a single source of truth — pipelines, automations, and insights without the bloat.",
    features: ["Visual pipelines", "AI lead scoring", "Email & calendar sync", "Custom workflows"],
    accent: false,
  },
  {
    name: "FlowOps",
    tag: "Operations",
    desc: "Automate repetitive operations work with no-code flows that connect your tools and trigger actions in real time.",
    features: ["Visual flow builder", "200+ integrations", "Real-time triggers", "Audit logging"],
    accent: true,
  },
  {
    name: "InsightAI",
    tag: "Analytics",
    desc: "Ask questions of your data in plain language. InsightAI delivers dashboards, anomaly detection, and forecasts in seconds.",
    features: ["Natural language queries", "Auto dashboards", "Anomaly detection", "Forecasting"],
    accent: false,
  },
  {
    name: "SecureGate",
    tag: "Security",
    desc: "Identity, access, and threat detection unified into a single platform — protect users, apps, and APIs from day one.",
    features: ["SSO & MFA", "Threat detection", "API protection", "Compliance reports"],
    accent: false,
  },
];

function ProductsPage() {
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
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((p) => (
            <article
              key={p.name}
              className={`group p-8 rounded-2xl border transition-smooth hover:-translate-y-1 ${
                p.accent
                  ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow hover:shadow-elegant"
                  : "bg-card text-card-foreground border-border shadow-card hover:shadow-elegant"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${p.accent ? "text-primary-foreground/80" : "text-primary-glow"}`}>
                  {p.tag}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">{p.name}</h2>
              <p className={`mt-3 text-sm leading-relaxed ${p.accent ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                {p.desc}
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 shrink-0 ${p.accent ? "text-primary-foreground" : "text-primary-glow"}`} />
                    {f}
                  </li>
                ))}
              </ul>

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
      </section>
    </>
  );
}
