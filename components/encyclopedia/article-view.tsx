"use client";

import { ExternalLink, MessageSquarePlus } from "lucide-react";
import { useEncyclopedia } from "@/components/encyclopedia/provider";
import { getArticle } from "@/lib/encyclopedia/catalog";
import { learnQuestionsFor } from "@/lib/content/learn-quiz";
import { findTopic } from "@/lib/content/modules";
import { PracticeBlock } from "@/components/encyclopedia/practice";
import type { Block } from "@/lib/encyclopedia/types";
import { cn } from "@/lib/utils";

export function ArticleView() {
  const { articleId, askAbout } = useEncyclopedia();
  const article = getArticle(articleId);
  const topic = article.practiceTopic ? findTopic(article.practiceTopic) : null;
  const practice = topic && article.practiceTopic && topic.id === article.practiceTopic ? learnQuestionsFor(topic) : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{article.group}</p>
      <h1 className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">{article.title}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">{article.summary}</p>
      <p className="mt-2 font-mono text-[11px] text-muted-foreground">
        {article.readMinutes} min · {article.tags.join(" · ")}
      </p>

      {article.docs && article.docs.length > 0 ? (
        <section className="mt-6 rounded-lg border border-border bg-card px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            Unity 6 documentation
          </p>
          <ul className="mt-2 space-y-1.5">
            {article.docs.map((doc) => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1.5 text-[13px] leading-snug text-foreground hover:text-accent"
                >
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span>
                    {doc.title}
                    {doc.note ? <span className="text-muted-foreground"> — {doc.note}</span> : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-col gap-5">
        {article.blocks.map((block, i) => (
          <BlockView key={`${article.id}-${i}`} block={block} onAsk={askAbout} />
        ))}
      </div>

      {article.related.length > 0 && (
        <Related ids={article.related} />
      )}

      {practice.length > 0 && topic && (
        <PracticeBlock topicTitle={topic.title} questions={practice} />
      )}
    </article>
  );
}

function BlockView({ block, onAsk }: { block: Block; onAsk: (q: string) => void }) {
  switch (block.type) {
    case "h2":
      return (
        <div className="mt-4 flex items-start justify-between gap-3 border-t border-border pt-6">
          <h2 id={block.id} className="font-serif text-2xl tracking-tight">
            {block.text}
          </h2>
          <button
            type="button"
            onClick={() => onAsk(`I don't understand this section: ${block.text}. Explain it at Team Lead level, then give a 90-second spoken version.`)}
            className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-accent/50 hover:text-accent"
            title="Ask the trainer about this heading"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Ask
          </button>
        </div>
      );
    case "h3":
      return (
        <h3 id={block.id} className="font-serif text-xl">
          {block.text}
        </h3>
      );
    case "p":
      return <p className="text-[16.5px] leading-[1.65]">{block.text}</p>;
    case "ul":
      return (
        <ul className="list-disc space-y-1.5 pl-5 text-[15.5px] leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-1.5 pl-5 text-[15.5px] leading-relaxed">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "checklist":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2 text-[15px]">
              <span className="mt-0.5 text-accent">□</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <aside
          className={cn(
            "rounded-lg border px-4 py-3",
            block.tone === "warn" && "border-danger/40 bg-danger/5",
            block.tone === "honest" && "border-accent/40 bg-accent/5",
            block.tone === "lead" && "border-pass/40 bg-pass/5",
            block.tone === "tip" && "border-border bg-muted/40"
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {block.tone} · {block.title}
          </p>
          <p className="mt-1 text-[15px] leading-relaxed">{block.text}</p>
        </aside>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 align-top leading-relaxed">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "qa":
      return (
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <p className="font-medium">{block.q}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{block.a}</p>
        </div>
      );
    default:
      return null;
  }
}

function Related({ ids }: { ids: string[] }) {
  const { setArticleId } = useEncyclopedia();
  return (
    <div className="mt-10 border-t border-border pt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Related</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ids.map((id) => {
          const a = getArticle(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setArticleId(id)}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent/50 hover:text-accent"
            >
              {a.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
