import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Announcements — Nexora" },
      { name: "description", content: "Product updates, engineering notes, and announcements from the Nexora team." },
      { property: "og:title", content: "Blog & Announcements — Nexora" },
      { property: "og:description", content: "Product updates, engineering notes, and announcements from the Nexora team." },
    ],
  }),
  component: BlogPage,
});

interface Announcement {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  created_at: string;
}

function BlogPage() {
  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("id,title,excerpt,body,cover_image_url,created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (mounted) {
        if (!error && data) setPosts(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-glow">Blog</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Announcements, updates, and stories from the Nexora team.
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 leading-relaxed">
            Product news, behind-the-scenes engineering, and what we're learning as we ship.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No posts yet. Check back soon.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-0.5"
              >
                {post.cover_image_url && (
                  <div className="aspect-[16/6] overflow-hidden bg-muted">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-7 md:p-9">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={post.created_at}>
                      {new Date(post.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-3 text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  )}
                  <div className="mt-5 whitespace-pre-wrap text-sm text-foreground/85 leading-relaxed">
                    {post.body}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
