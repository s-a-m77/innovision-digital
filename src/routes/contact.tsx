import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Nexora" },
      { name: "description", content: "Get in touch with the Nexora team. Tell us about your project and we'll respond within one business day." },
      { property: "og:title", content: "Contact Us — Nexora" },
      { property: "og:description", content: "Reach out to start a project or learn more about our services." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please share a bit more detail").max(1000, "Message is too long"),
});

type FormState = { name: string; email: string; company: string; message: string };
const initialState: FormState = { name: "", email: "", company: "", message: "" };

function ContactPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: result.data.name,
      email: result.data.email,
      company: result.data.company || null,
      message: result.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send your message. Please try again.");
      return;
    }
    toast.success("Message sent — we'll be in touch.");
    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Contact</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Let's build something exceptional together.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 leading-relaxed">
            Tell us about your project, your goals, or just say hi. We respond within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
              <h2 className="font-semibold text-lg">Reach us directly</h2>
              <ul className="mt-5 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow shrink-0">
                    <Mail className="h-4 w-4 text-primary-foreground" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                    <div className="mt-0.5 font-medium">hello@nexora.tech</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow shrink-0">
                    <Phone className="h-4 w-4 text-primary-foreground" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Phone</div>
                    <div className="mt-0.5 font-medium">+1 (555) 010-2024</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow shrink-0">
                    <MapPin className="h-4 w-4 text-primary-foreground" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Office</div>
                    <div className="mt-0.5 font-medium">Stockholm · Remote-first</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
              <h3 className="font-semibold">Working hours</h3>
              <p className="mt-2 text-sm opacity-90">Mon – Fri · 9:00 – 18:00 CET</p>
              <p className="mt-1 text-sm opacity-90">Enterprise support available 24/7.</p>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-7 md:p-9 rounded-2xl bg-card border border-border shadow-card"
              noValidate
            >
              {submitted ? (
                <div className="text-center py-10">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                    <CheckCircle2 className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">Message sent</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    Thanks for reaching out. We'll get back to you within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-smooth"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Send us a message</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Share a few details and we'll be in touch shortly.
                  </p>

                  <div className="mt-6 grid sm:grid-cols-2 gap-5">
                    <Field label="Name" error={errors.name}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Jane Doe"
                        maxLength={100}
                      />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="jane@company.com"
                        maxLength={255}
                      />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <Field label="Company (optional)" error={errors.company}>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Acme Inc."
                        maxLength={100}
                      />
                    </Field>
                  </div>

                  <div className="mt-5">
                    <Field label="How can we help?" error={errors.message}>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm resize-none transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Tell us about your project, timeline, and goals…"
                        maxLength={1000}
                      />
                    </Field>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow hover:scale-[1.01] disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitting ? "Sending…" : "Send message"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
