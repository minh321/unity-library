"use client";

import { useEffect, useMemo } from "react";
import {
  AlertTriangle,
  BookOpen,
  Compass,
  ExternalLink,
  Lightbulb,
  List,
  MessageSquarePlus,
  Shield,
} from "lucide-react";
import { useEncyclopedia } from "@/components/encyclopedia/provider";
import { RichText } from "@/components/encyclopedia/rich-text";
import { getArticle } from "@/lib/encyclopedia/catalog";
import { learnQuestionsFor } from "@/lib/content/learn-quiz";
import { findTopic } from "@/lib/content/modules";
import { PracticeBlock } from "@/components/encyclopedia/practice";
import type { Block } from "@/lib/encyclopedia/types";
import { cn } from "@/lib/utils";

const calloutIcon = {
  warn: AlertTriangle,
  honest: Shield,
  lead: Compass,
  tip: Lightbulb,
};

export function ArticleView() {
  const { articleId, askAbout } = useEncyclopedia();
  const article = getArticle(articleId);
  const topic = article.practiceTopic ? findTopic(article.practiceTopic) : null;
  const practice = topic && article.practiceTopic && topic.id === article.practiceTopic ? learnQuestionsFor(topic) : [];
  const outline = useMemo(
    () => article.blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2"),
    [article]
  );

  useEffect(() => {
    document.getElementById("article-scroll")?.scrollTo({ top: 0 });
  }, [articleId]);

  return (
    <article className="article-body mx-auto w-full max-w-[46rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-accent">{article.group}</p>
      <h1 className="mt-2 text-balance font-serif text-[2rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2.35rem]">
        {article.title}
      </h1>
      <p className="mt-4 text-[1.05rem] leading-7 text-muted-foreground">
        <RichText text={article.summary} />
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
          {article.readMinutes} min read
        </span>
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/80 bg-card px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {article.docs && article.docs.length > 0 ? (
        <section className="mt-7 rounded-xl border border-border bg-card/80 px-4 py-4 shadow-[inset_0_1px_0_hsl(38_22%_100%/0.04)]">
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
            <BookOpen className="h-3.5 w-3.5" />
            Unity 6 documentation
          </p>
          <ul className="mt-3 space-y-2.5">
            {article.docs.map((doc) => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-start gap-2 text-[14px] leading-snug text-foreground hover:text-accent"
                >
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-accent" />
                  <span>
                    <span className="underline decoration-border underline-offset-4 group-hover:decoration-accent/60">
                      {doc.title}
                    </span>
                    {doc.note ? <span className="block text-[13px] text-muted-foreground"> {doc.note}</span> : null}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {outline.length > 2 ? (
        <nav className="mt-6 rounded-xl border border-border bg-muted/30 px-4 py-3" aria-label="On this page">
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <List className="h-3.5 w-3.5" />
            On this page
          </p>
          <ol className="mt-2 columns-1 gap-x-6 sm:columns-2">
            {outline.map((h, i) => (
              <li key={h.id} className="break-inside-avoid py-0.5">
                <button
                  type="button"
                  className="text-left text-[13.5px] leading-snug text-muted-foreground hover:text-accent"
                  onClick={() =>
                    document.getElementById(h.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                >
                  <span className="font-mono text-[11px] text-accent/80">{String(i + 1).padStart(2, "0")}</span>{" "}
                  {h.text}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="mt-8 flex flex-col gap-5">
        {article.blocks.map((block, i) => (
          <BlockView key={`${article.id}-${i}`} block={block} onAsk={askAbout} />
        ))}
      </div>

      {article.related.length > 0 && <Related ids={article.related} />}

      {practice.length > 0 && topic && <PracticeBlock topicTitle={topic.title} questions={practice} />}

      <p className="mt-10 pb-4">
        <button
          type="button"
          className="text-[13px] text-muted-foreground underline decoration-border underline-offset-4 hover:text-accent"
          onClick={() => document.getElementById("article-scroll")?.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
        </button>
      </p>
    </article>
  );
}

function BlockView({ block, onAsk }: { block: Block; onAsk: (q: string) => void }) {
  switch (block.type) {
    case "h2":
      return (
        <div className="mt-6 flex items-start justify-between gap-3 border-t border-border/80 pt-7">
          <h2 id={block.id} className="scroll-mt-6 text-balance font-serif text-[1.55rem] font-semibold tracking-tight">
            {block.text}
          </h2>
          <button
            type="button"
            onClick={() =>
              onAsk(
                `I don't understand this section: ${block.text}. Explain it at Team Lead level, then give a 90-second spoken version.`
              )
            }
            className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground hover:border-accent/50 hover:text-accent"
            title="Ask the trainer about this heading"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      );
    case "h3":
      return (
        <h3 id={block.id} className="scroll-mt-6 font-serif text-[1.2rem] font-semibold tracking-tight text-foreground">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-[1.0625rem] leading-[1.8]">
          <RichText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2.5 text-[1.02rem] leading-7">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-2.5 pl-6 text-[1.02rem] leading-7 marker:font-mono marker:text-sm marker:text-accent">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <RichText text={item} />
            </li>
          ))}
        </ol>
      );
    case "checklist":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border/70 bg-card/40 px-3 py-2.5 text-[15px] leading-6"
            >
              <span className="mt-0.5 font-mono text-accent" aria-hidden>
                ☐
              </span>
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "callout": {
      const Icon = calloutIcon[block.tone];
      return (
        <aside
          className={cn(
            "rounded-xl border px-4 py-3.5",
            block.tone === "warn" && "border-danger/35 bg-danger/[0.07]",
            block.tone === "honest" && "border-accent/40 bg-accent/[0.07]",
            block.tone === "lead" && "border-pass/40 bg-pass/[0.08]",
            block.tone === "tip" && "border-border bg-muted/45"
          )}
        >
          <p
            className={cn(
              "flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em]",
              block.tone === "warn" && "text-danger",
              block.tone === "honest" && "text-accent",
              block.tone === "lead" && "text-pass",
              block.tone === "tip" && "text-muted-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {block.title}
          </p>
          <p className="mt-1.5 text-[15.5px] leading-7">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    }
    case "table":
      return (
        <div className="-mx-1 overflow-x-auto rounded-xl border border-border sm:mx-0">
          <table className="w-full min-w-[28rem] text-left text-[14.5px]">
            <thead className="bg-muted/70 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                {block.headers.map((h) => (
                  <th key={h} className="px-3.5 py-2.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border even:bg-muted/20">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={cn("px-3.5 py-2.5 align-top leading-6", j === 0 && "font-medium text-foreground")}
                    >
                      <RichText text={cell} />
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
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/40 px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Question</p>
            <p className="mt-1 font-medium leading-6">
              <RichText text={block.q} />
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              How to answer
            </p>
            <p className="mt-1 text-[15.5px] leading-7 text-foreground/90">
              <RichText text={block.a} />
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function Related({ ids }: { ids: string[] }) {
  const { setArticleId } = useEncyclopedia();
  return (
    <div className="mt-12 border-t border-border pt-7">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Keep reading
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {ids.map((id) => {
          const a = getArticle(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setArticleId(id)}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-left text-sm leading-5 hover:border-accent/50 hover:text-accent"
            >
              {a.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
