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
import { CountUp } from "@/components/CountUp";

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

type Stat =
  | { kind: "count"; end: number; suffix?: string; decimals?: number; label: string }
  | { kind: "static"; value: string; label: string };

const stats: Stat[] = [
  { kind: "count", end: 120, suffix: "+", label: "Projects Delivered" },
  { kind: "count", end: 45, suffix: "+", label: "Enterprise Clients" },
  { kind: "count", end: 99.9, decimals: 1, suffix: "%", label: "Uptime SLA" },
  { kind: "static", value: "24/7", label: "Expert Support" },
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
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]" style={{ fontFamily: '"Orbitron", sans-serif' }}>
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
            <div key={s.label} className="text-center animate-fade-in">
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary tabular-nums">
                {s.kind === "count" ? (
                  <CountUp end={s.end} suffix={s.suffix} decimals={s.decimals} />
                ) : (
                  s.value
                )}
              </div>
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
        <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-hero p-10 md:p-20 shadow-elegant">
          {/* Ambient background */}
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-40"
            style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            aria-hidden="true"
          />
          {/* Glow orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-pulse" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />

          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
                Let's build together
              </span>
              <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05]" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                Ready to build <span className="text-gradient-primary">something great?</span>
              </h2>
              <p className="mt-5 text-white/75 max-w-xl leading-relaxed">
                Tell us about your project. We reply within one business day with a clear next step — no sales fluff.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-[1.03]"
                >
                  Start a project <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-smooth hover:bg-white/10"
                >
                  Browse services
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/70">
                {["Reply in < 24h", "Free discovery call", "NDA on request"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary-glow" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decorative stat card */}
            <div className="hidden md:block">
              <div className="relative rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md shadow-elegant">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Currently accepting</div>
                    <div className="text-xs text-white/60">Q3 · limited slots</div>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { k: "Avg. response", v: "< 24h" },
                    { k: "Kickoff", v: "1–2 weeks" },
                    { k: "Satisfaction", v: "99%" },
                  ].map((r) => (
                    <div key={r.k} className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{r.k}</span>
                      <span className="font-semibold text-white">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-4/5 bg-gradient-primary" />
                </div>
                <div className="mt-2 text-[11px] text-white/50">4 of 5 slots reserved</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
