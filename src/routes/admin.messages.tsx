import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trash2, Mail, Building2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

interface Submission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  handled: boolean;
  created_at: string;
}

function MessagesAdmin() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "open" | "handled">("open");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleHandled(item: Submission) {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ handled: !item.handled })
      .eq("id", item.id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((p) => p.id === item.id ? { ...p, handled: !p.handled } : p));
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = items.filter((i) =>
    filter === "all" ? true : filter === "open" ? !i.handled : i.handled
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Contact messages</h2>
          <p className="text-sm text-muted-foreground">Submissions from the public contact form.</p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-card p-1 text-sm">
          {(["open", "handled", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded transition-smooth capitalize ${filter === f ? "bg-secondary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No messages.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {filtered.map((item) => (
            <li key={item.id} className={`rounded-xl border p-5 shadow-card transition-smooth ${item.handled ? "border-border bg-muted/30" : "border-border bg-card"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{item.name}</h3>
                    <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 text-xs text-primary-glow hover:underline">
                      <Mail className="h-3 w-3" /> {item.email}
                    </a>
                    {item.company && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" /> {item.company}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{item.message}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleHandled(item)}
                    title={item.handled ? "Mark as open" : "Mark as handled"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-secondary transition-smooth"
                  >
                    {item.handled ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-primary-glow" />}
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    title="Delete"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-secondary hover:text-destructive hover:border-destructive/30 transition-smooth"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
