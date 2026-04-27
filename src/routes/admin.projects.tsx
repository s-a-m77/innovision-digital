import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Eye, EyeOff, Upload, Image as ImageIcon } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsAdmin,
});

interface Project {
  id: string;
  title: string;
  description: string;
  link_url: string | null;
  image_1_url: string | null;
  image_2_url: string | null;
  image_3_url: string | null;
  active: boolean;
  sort_order: number;
}

const schema = z.object({
  title: z.string().trim().min(1, "Title required").max(120),
  description: z.string().trim().min(1, "Description required").max(1000),
  link_url: z.string().trim().url("Must be a valid URL").max(500).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999),
  active: z.boolean(),
});

const empty: Project = {
  id: "", title: "", description: "", link_url: "",
  image_1_url: null, image_2_url: null, image_3_url: null,
  active: true, sort_order: 0,
};

function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Project[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(item: Project) {
    if (!confirm("Delete this project?")) return;
    // Best-effort cleanup of uploaded images
    const paths = [item.image_1_url, item.image_2_url, item.image_3_url]
      .filter(Boolean)
      .map((u) => extractStoragePath(u as string))
      .filter(Boolean) as string[];
    if (paths.length) await supabase.storage.from("project-images").remove(paths);
    const { error } = await supabase.from("projects").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function toggleActive(item: Project) {
    const { error } = await supabase.from("projects").update({ active: !item.active }).eq("id", item.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-sm text-muted-foreground">Portfolio cards shown on the public /products page.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => {
            const imgs = [item.image_1_url, item.image_2_url, item.image_3_url].filter(Boolean) as string[];
            return (
              <li key={item.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="hidden sm:flex w-20 h-20 shrink-0 rounded-lg bg-muted overflow-hidden items-center justify-center">
                  {imgs[0] ? <img src={imgs[0]} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">#{item.sort_order}</span>
                    {!item.active && <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Hidden</span>}
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary-glow/10 text-primary-glow">{imgs.length}/3 images</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  {item.link_url && <p className="mt-1 text-xs text-primary-glow truncate">{item.link_url}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconBtn onClick={() => toggleActive(item)} title={item.active ? "Hide" : "Show"}>
                    {item.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </IconBtn>
                  <IconBtn onClick={() => setEditing(item)} title="Edit"><Pencil className="h-4 w-4" /></IconBtn>
                  <IconBtn onClick={() => remove(item)} title="Delete" danger><Trash2 className="h-4 w-4" /></IconBtn>
                </div>
              </li>
            );
          })}
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

function extractStoragePath(publicUrl: string): string | null {
  const marker = "/object/public/project-images/";
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return publicUrl.slice(i + marker.length);
}

function Editor({ initial, isNew, onClose, onSaved }: {
  initial: Project; isNew: boolean; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: initial.title,
    description: initial.description,
    link_url: initial.link_url ?? "",
    sort_order: initial.sort_order,
    active: initial.active,
  });
  const [images, setImages] = useState<(string | null)[]>([
    initial.image_1_url, initial.image_2_url, initial.image_3_url,
  ]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleUpload(idx: number, file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setUploadingIdx(idx);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { cacheControl: "3600", upsert: false });
    setUploadingIdx(null);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    const next = [...images];
    // Remove previous image at this slot
    const prev = images[idx];
    if (prev) {
      const prevPath = extractStoragePath(prev);
      if (prevPath) supabase.storage.from("project-images").remove([prevPath]);
    }
    next[idx] = data.publicUrl;
    setImages(next);
  }

  function clearImage(idx: number) {
    const prev = images[idx];
    if (prev) {
      const prevPath = extractStoragePath(prev);
      if (prevPath) supabase.storage.from("project-images").remove([prevPath]);
    }
    const next = [...images];
    next[idx] = null;
    setImages(next);
  }

  async function save() {
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setSaving(true);
    const payload = {
      title: parsed.data.title,
      description: parsed.data.description,
      link_url: parsed.data.link_url || null,
      sort_order: parsed.data.sort_order,
      active: parsed.data.active,
      image_1_url: images[0],
      image_2_url: images[1],
      image_3_url: images[2],
    };
    const { error } = isNew
      ? await supabase.from("projects").insert(payload)
      : await supabase.from("projects").update(payload).eq("id", initial.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Project created" : "Project updated");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{isNew ? "New project" : "Edit project"}</h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary transition-smooth"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={120} className={inputCls} /></Field>
          <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} maxLength={1000} className={`${inputCls} resize-y`} /></Field>
          <Field label="Project link (URL)"><input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://example.com" maxLength={500} className={inputCls} /></Field>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Images (up to 3)</span>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <ImageSlot
                  key={i}
                  idx={i}
                  url={images[i]}
                  uploading={uploadingIdx === i}
                  onUpload={(f) => handleUpload(i, f)}
                  onClear={() => clearImage(i)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Sort order"><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })} className={inputCls} /></Field>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active (visible publicly)
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

function ImageSlot({ idx, url, uploading, onUpload, onClear }: {
  idx: number; url: string | null; uploading: boolean;
  onUpload: (f: File) => void; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="relative group aspect-square rounded-lg border border-dashed border-input bg-background overflow-hidden">
      {url ? (
        <>
          <img src={url} alt={`Preview ${idx + 1}`} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-1.5 right-1.5 rounded-md bg-background/90 p-1.5 opacity-0 group-hover:opacity-100 transition-smooth hover:text-destructive"
            title="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span>Image {idx + 1}</span>
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
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
