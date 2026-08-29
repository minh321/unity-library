"use client";

import { useState } from "react";
import { EncyclopediaProvider, useEncyclopedia } from "./provider";
import { EncyclopediaNav } from "./nav";
import { ArticleView } from "./article-view";
import { TrainerChat } from "./trainer-chat";
import { getArticle } from "@/lib/encyclopedia/catalog";

function EncyclopediaLayout() {
  const { articleId, setOpenChat } = useEncyclopedia();
  const [navOpen, setNavOpen] = useState(false);
  const article = getArticle(articleId);

  return (
    <div className="flex h-[100dvh] flex-col bg-background text-foreground">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-3 py-2 lg:hidden">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium"
        >
          Library
        </button>
        <p className="min-w-0 truncate text-sm font-semibold">{article.title}</p>
        <button
          type="button"
          onClick={() => setOpenChat(true)}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
        >
          Trainer
        </button>
      </header>
      {navOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close library"
            className="absolute inset-0 bg-background/70"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(92vw,360px)] overflow-hidden border-r border-border bg-card">
            <EncyclopediaNav onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[280px] shrink-0 lg:block">
          <EncyclopediaNav />
        </div>
        <main id="article-scroll" className="article-scroll min-w-0 flex-1 overflow-y-auto">
          <ArticleView />
        </main>
        <TrainerChat />
      </div>
    </div>
  );
}

export function EncyclopediaShell() {
  return (
    <EncyclopediaProvider>
      <EncyclopediaLayout />
    </EncyclopediaProvider>
  );
}
