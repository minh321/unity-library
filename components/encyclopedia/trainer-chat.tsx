"use client";

import { useEffect, useRef, useState } from "react";
import { getArticle } from "@/lib/encyclopedia/catalog";
import { RichText } from "./rich-text";
import { useEncyclopedia } from "./provider";

export function TrainerChat() {
  const { articleId, chat, sendChat, pending, openChat, setOpenChat, setArticleId } = useEncyclopedia();
  const article = getArticle(articleId);
  const [question, setQuestion] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, pending]);

  useEffect(() => {
    if (openChat) input.current?.focus();
  }, [openChat, articleId]);

  const last = [...chat].reverse().find((m) => m.role === "trainer");

  function submit() {
    const q = question.trim();
    if (!q || pending) return;
    setQuestion("");
    void sendChat(q);
  }

  const panel = (
    <aside className="flex h-full min-h-0 flex-col border-border bg-card lg:border-l">
      <header className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
            Live trainer
          </p>
          <p className="mt-1 text-sm font-semibold">Reading: {article.title}</p>
          <p className="text-[11px] text-muted-foreground">
            Ask about this article. The agent stays inside the library and cites Unity 6 docs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpenChat(false)}
          className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground lg:hidden"
        >
          Close
        </button>
      </header>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {chat.map((m) => (
          <div key={m.id} className={m.role === "user" ? "ml-6" : "mr-2"}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {m.role === "user" ? "You" : "Trainer"}
            </p>
            <div className="mt-1 whitespace-pre-wrap rounded-lg border border-border bg-background px-3 py-2.5 text-[14px] leading-7">
              <RichText text={m.text} />
            </div>
            {m.citations && m.citations.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.citations.map((c, i) => (
                  <button
                    key={`${c.articleId}-${i}`}
                    type="button"
                    onClick={() => setArticleId(c.articleId)}
                    className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground hover:border-accent hover:text-accent"
                  >
                    {c.title}
                    {c.heading ? ` · ${c.heading}` : ""}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        {pending ? (
          <p className="text-xs text-muted-foreground">Trainer is reading the current article…</p>
        ) : null}
        <div ref={bottom} />
      </div>
      {last?.suggestions && last.suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 border-t border-border px-4 py-2">
          {last.suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void sendChat(s)}
              className="rounded-full border border-border px-2.5 py-1 text-left text-[11px] leading-4 text-muted-foreground hover:border-accent hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          ref={input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="I don’t understand the section on…"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">Enter to send · Shift+Enter newline</p>
          <button
            type="submit"
            disabled={pending || !question.trim()}
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground disabled:opacity-40"
          >
            Ask trainer
          </button>
        </div>
      </form>
    </aside>
  );

  return (
    <>
      <div className="hidden h-full min-h-0 lg:block lg:w-[380px] lg:shrink-0">{panel}</div>
      {openChat ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close trainer"
            className="absolute inset-0 bg-background/70"
            onClick={() => setOpenChat(false)}
          />
          <div className="absolute inset-x-0 bottom-0 h-[85vh] overflow-hidden rounded-t-2xl border-t border-border">
            {panel}
          </div>
        </div>
      ) : null}
    </>
  );
}
