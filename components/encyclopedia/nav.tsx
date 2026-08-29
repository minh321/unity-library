"use client";

import { useMemo, useState } from "react";
import { articles, groups } from "@/lib/encyclopedia/catalog";
import { useEncyclopedia } from "@/components/encyclopedia/provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function EncyclopediaNav({ onNavigate }: { onNavigate?: () => void }) {
  const { articleId, setArticleId } = useEncyclopedia();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) ||
        a.summary.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.toLowerCase().includes(needle)) ||
        (a.docs ?? []).some((d) => d.title.toLowerCase().includes(needle))
    );
  }, [q]);

  function go(id: string) {
    setArticleId(id);
    onNavigate?.();
  }

  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar">
      <div className="px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          Unity Lead Library
        </p>
        <h1 className="mt-1 font-serif text-xl leading-tight">Team Leader encyclopedia</h1>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
          Rooms · Mobile + PC · Unity 6 Manual. Later: VFX / TA. Ask any heading.
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles"
          className="mt-3 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none ring-ring placeholder:text-muted-foreground/70 focus:ring-2"
        />
      </div>
      <ScrollArea className="flex-1 px-2 pb-4">
        {filtered ? (
          <div className="flex flex-col gap-0.5">
            {filtered.map((a) => (
              <NavLink key={a.id} id={a.id} title={a.title} active={articleId === a.id} onClick={go} />
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-3 text-xs text-muted-foreground">No article titles match.</p>
            )}
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.id} className="mb-4">
              <p className="sticky top-0 z-10 bg-sidebar/95 px-2 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
                {g.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {g.articleIds.map((id) => {
                  const a = articles.find((x) => x.id === id);
                  if (!a) return null;
                  return (
                    <NavLink
                      key={id}
                      id={id}
                      title={a.title}
                      active={articleId === id}
                      onClick={go}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </aside>
  );
}

function NavLink({
  id,
  title,
  active,
  onClick,
}: {
  id: string;
  title: string;
  active: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={cn(
        "w-full rounded-md px-2.5 py-1.5 text-left text-[13px] leading-snug",
        active
          ? "bg-accent/15 font-medium text-accent ring-1 ring-accent/25"
          : "text-foreground/85 hover:bg-muted/70 hover:text-foreground"
      )}
    >
      {title}
    </button>
  );
}
