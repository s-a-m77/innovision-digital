import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
}

const schema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
  icon: z.string().trim().max(40).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999),
  active: z.boolean(),
});

const empty = { title: "", description: "", icon: "Code2", sort_order: 0, active: true };

function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function toggleActive(item: Service) {
    const { error } = await supabase.from("services").update({ active: !item.active }).eq("id", item.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Services</h2>
          <p className="text-sm text-muted-foreground">Cards shown on the public /services page.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
        >
          <Plus className="h-4 w-4" /> New service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No services yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">#{item.sort_order}</span>
                  {!item.active && <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <IconBtn onClick={() => toggleActive(item)} title={item.active ? "Hide" : "Show"}>
                  {item.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconBtn>
                <IconBtn onClick={() => setEditing(item)} title="Edit"><Pencil className="h-4 w-4" /></IconBtn>
                <IconBtn onClick={() => remove(item.id)} title="Delete" danger><Trash2 className="h-4 w-4" /></IconBtn>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <Editor
          initial={editing ?? empty}
          isNew={creating}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function IconBtn({ children, danger, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button {...props} className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-secondary transition-smooth ${danger ? "hover:text-destructive hover:border-destructive/30" : ""}`}>
      {children}
    </button>
  );
}

function Editor({ initial, isNew, onClose, onSaved }: {
  initial: { id?: string; title: string; description: string; icon: string | null; sort_order: number; active: boolean };
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: initial.title,
    description: initial.description,
    icon: initial.icon ?? "",
    sort_order: initial.sort_order,
    active: initial.active,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setSaving(true);
    const payload = { ...parsed.data, icon: parsed.data.icon || null };
    const { error } = isNew
      ? await supabase.from("services").insert(payload)
      : await supabase.from("services").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Service created" : "Service updated");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{isNew ? "New service" : "Edit service"}</h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary transition-smooth"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} className={inputCls} /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} maxLength={1000} className={`${inputCls} resize-y`} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Icon (lucide name)"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Code2" maxLength={40} className={inputCls} /></Field>
            <Field label="Sort order"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} className={inputCls} /></Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Active (visible on public site)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-smooth">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
