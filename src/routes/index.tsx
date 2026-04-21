import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Target,
  Eye,
  Code2,
  Cloud,
  Smartphone,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora — Digital Solutions for Real-World Problems" },
      { name: "description", content: "We engineer modern, innovative technology solutions tailored to your business. Discover Nexora's services and products." },
      { property: "og:title", content: "Nexora — Digital Solutions for Real-World Problems" },
      { property: "og:description", content: "We engineer modern, innovative technology solutions tailored to your business." },
    ],
  }),
  component: HomePage,
});

const previewServices = [
  { icon: Code2, title: "Custom Software", desc: "Tailored web platforms engineered around your workflows." },
  { icon: Cloud, title: "Cloud & DevOps", desc: "Scalable infrastructure with zero-downtime deployments." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native-quality cross-platform apps users love." },
  { icon: Sparkles, title: "AI Integration", desc: "Embed intelligence into your products with confidence." },
];

const stats = [
  { value: "120+", label: "Projects Delivered" },
  { value: "45+", label: "Enterprise Clients" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Expert Support" },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/0 via-transparent to-background/0 dark:from-background/20" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" />
              Building the future of digital business
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Digital solutions that <span className="text-gradient-primary">solve real problems.</span>
            </h1>
            <p className="mt-6 text-lg text-white/75 max-w-2xl leading-relaxed">
              Nexora partners with ambitious teams to design, build, and scale technology that delivers measurable impact — from custom software to AI-powered products.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02]"
              >
                Start a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-smooth hover:bg-white/10"
              >
                Explore services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About / Intro */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">About Nexora</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              A team of engineers, designers, and strategists building what's next.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              We exist to bridge the gap between bold ideas and production-grade software. With deep expertise across cloud, mobile, AI, and enterprise systems, Nexora helps companies of every size ship faster and operate smarter.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Outcome-driven engineering, not feature factories",
                "Modern architectures designed to scale with you",
                "Transparent process from kickoff to launch",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1">
              <Target className="h-8 w-8 text-primary-glow" />
              <h3 className="mt-4 font-semibold text-lg">Our Mission</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                To meet our customers' needs by delivering effective, innovative digital solutions that create lasting value.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow hover:-translate-y-1 sm:mt-8">
              <Eye className="h-8 w-8" />
              <h3 className="mt-4 font-semibold text-lg">Our Vision</h3>
              <p className="mt-2 text-sm opacity-90 leading-relaxed">
                To become a leading provider of technology-driven services trusted by businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">What we do</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Services built for ambitious teams.
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {previewServices.map((s) => (
              <div
                key={s.title}
                className="group p-6 rounded-2xl bg-card border border-border shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary-glow transition-smooth"
            >
              See all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 md:p-16 text-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover" }} aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Ready to build something great?
            </h2>
            <p className="mt-4 text-white/75 max-w-xl mx-auto">
              Let's talk about your project. We'll get back to you within one business day.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.02]"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
