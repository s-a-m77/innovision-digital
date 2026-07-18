import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, X } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AnnouncementsAdmin,
});

interface Announcement {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
}

const schema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  excerpt: z.string().trim().max(280).optional().or(z.literal("")),
  body: z.string().trim().min(1, "Body required").max(10000),
  cover_image_url: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
});

const empty = { title: "", excerpt: "", body: "", cover_image_url: "", published: true };

function AnnouncementsAdmin() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function togglePublish(item: Announcement) {
    const { error } = await supabase
      .from("announcements")
      .update({ published: !item.published })
      .eq("id", item.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Announcements</h2>
          <p className="text-sm text-muted-foreground">Posts shown on the public /blog page.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.published ? "bg-primary-glow/15 text-primary-glow" : "bg-muted text-muted-foreground"}`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>
                {item.excerpt && (
                  <p className="mt-1 text-sm text-muted-foreground truncate">{item.excerpt}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <IconBtn
                  onClick={() => togglePublish(item)}
                  title={item.published ? "Unpublish" : "Publish"}
                >
                  {item.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconBtn>
                <IconBtn onClick={() => setEditing(item)} title="Edit">
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn onClick={() => remove(item.id)} title="Delete" danger>
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <Editor
          initial={editing ?? empty}
          isNew={creating}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function IconBtn({
  children,
  danger,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      {...props}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-secondary transition-smooth ${danger ? "hover:text-destructive hover:border-destructive/30" : ""}`}
    >
      {children}
    </button>
  );
}

function Editor({
  initial,
  isNew,
  onClose,
  onSaved,
}: {
  initial: {
    id?: string;
    title: string;
    excerpt: string | null;
    body: string;
    cover_image_url: string | null;
    published: boolean;
  };
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: initial.title,
    excerpt: initial.excerpt ?? "",
    body: initial.body,
    cover_image_url: initial.cover_image_url ?? "",
    published: initial.published,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSaving(true);
    const payload = {
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      body: parsed.data.body,
      cover_image_url: parsed.data.cover_image_url || null,
      published: parsed.data.published,
    };
    const { error } = isNew
      ? await supabase.from("announcements").insert(payload)
      : await supabase.from("announcements").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Post created" : "Post updated");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isNew ? "New announcement" : "Edit announcement"}
          </h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary transition-smooth">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={200}
              className={inputCls}
            />
          </Field>
          <Field label="Excerpt (optional)">
            <input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              maxLength={280}
              className={inputCls}
            />
          </Field>
          <Field label="Cover image URL (optional)">
            <input
              value={form.cover_image_url}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
              maxLength={500}
              className={inputCls}
              placeholder="https://..."
            />
          </Field>
          <Field label="Body">
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={8}
              maxLength={10000}
              className={`${inputCls} resize-y`}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on public blog)
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition-smooth"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
