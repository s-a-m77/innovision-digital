import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code2,
  Cloud,
  Smartphone,
  Sparkles,
  Shield,
  LineChart,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Nexora" },
      { name: "description", content: "Explore Nexora's full range of services: custom software, cloud & DevOps, mobile apps, AI integration, cybersecurity, and data analytics." },
      { property: "og:title", content: "Services — Nexora" },
      { property: "og:description", content: "Custom software, cloud, mobile, AI, security, and analytics services." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Code2,
    title: "Custom Software Development",
    desc: "We design and build bespoke web platforms, internal tools, and SaaS products engineered around your exact workflows and business goals.",
    points: ["Modern web stacks", "API & integrations", "Long-term maintainability"],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    desc: "Scalable, observable, secure cloud infrastructure with automated CI/CD pipelines that deploy with confidence — from staging to production.",
    points: ["AWS · GCP · Azure", "Infrastructure as code", "Zero-downtime deploys"],
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    desc: "Native-quality iOS and Android experiences delivered with cross-platform frameworks for faster time-to-market without compromise.",
    points: ["iOS & Android", "React Native · Flutter", "App Store launch support"],
  },
  {
    icon: Sparkles,
    title: "AI & Machine Learning",
    desc: "Embed intelligence into your product — from chat interfaces and recommendations to document understanding and predictive analytics.",
    points: ["LLM integrations", "Custom ML pipelines", "Responsible AI practices"],
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    desc: "Protect what you've built. Security audits, penetration testing, and architecture reviews that harden your stack against modern threats.",
    points: ["Security audits", "Compliance readiness", "Incident response"],
  },
  {
    icon: LineChart,
    title: "Data & Analytics",
    desc: "Turn raw data into decisions with modern data warehouses, real-time dashboards, and BI tooling tailored to your team.",
    points: ["Data warehouses", "BI dashboards", "Real-time pipelines"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Services</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            End-to-end services to design, build, and scale your product.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 leading-relaxed">
            Whether you need a small focused engagement or a long-term technology partner, Nexora delivers expertise across the full stack of modern digital business.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.title}
              className="group p-7 rounded-2xl bg-card border border-border shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mt-5 text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <ul className="mt-5 space-y-2">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

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
