import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Eye, EyeOff, Star } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

interface Product {
  id: string;
  name: string;
  tag: string | null;
  description: string;
  features: string[];
  accent: boolean;
  sort_order: number;
  active: boolean;
}

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  tag: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().min(1).max(1000),
  featuresText: z.string().max(2000),
  accent: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
  active: z.boolean(),
});

const empty = { name: "", tag: "", description: "", featuresText: "", accent: false, sort_order: 0, active: true };

function ProductsAdmin() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function toggleActive(item: Product) {
    const { error } = await supabase.from("products").update({ active: !item.active }).eq("id", item.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">Cards shown on the public /products page.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth">
          <Plus className="h-4 w-4" /> New product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No products yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  {item.tag && <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary-glow/15 text-primary-glow">{item.tag}</span>}
                  {item.accent && <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary"><Star className="h-3 w-3" /> Featured</span>}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">#{item.sort_order}</span>
                  {!item.active && <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                {item.features.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">{item.features.length} features</p>
                )}
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
  initial: { id?: string; name: string; tag: string | null; description: string; features?: string[]; featuresText?: string; accent: boolean; sort_order: number; active: boolean };
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    tag: initial.tag ?? "",
    description: initial.description,
    featuresText: initial.featuresText ?? (initial.features ?? []).join("\n"),
    accent: initial.accent,
    sort_order: initial.sort_order,
    active: initial.active,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setSaving(true);
    const features = parsed.data.featuresText.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12);
    const payload = {
      name: parsed.data.name,
      tag: parsed.data.tag || null,
      description: parsed.data.description,
      features,
      accent: parsed.data.accent,
      sort_order: parsed.data.sort_order,
      active: parsed.data.active,
    };
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Product created" : "Product updated");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{isNew ? "New product" : "Edit product"}</h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary transition-smooth"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} className={inputCls} /></Field>
            <Field label="Tag"><input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Sales Platform" maxLength={60} className={inputCls} /></Field>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={1000} className={`${inputCls} resize-y`} /></Field>
          <Field label="Features (one per line)">
            <textarea value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} rows={5} maxLength={2000} className={`${inputCls} resize-y`} placeholder="Visual pipelines&#10;AI lead scoring&#10;..." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort order"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} className={inputCls} /></Field>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active
              </label>
            </div>
          </div>
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
