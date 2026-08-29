import { coreArticles } from "@/lib/encyclopedia/articles-core";
import { unityArticles } from "@/lib/encyclopedia/articles-unity";
import { vfxArticles } from "@/lib/encyclopedia/articles-vfx";
import { vfxPlainArticles } from "@/lib/encyclopedia/articles-vfx-plain";
import { ebookArticles } from "@/lib/encyclopedia/articles-ebook";
import { docsFor } from "@/lib/encyclopedia/unity-docs";
import type { Article, ArticleGroup, Block, DocLink } from "@/lib/encyclopedia/types";

function withDocs(article: Article): Article {
  const fromMap = docsFor(article.id);
  const existing = article.docs ?? [];
  const seen = new Set(existing.map((d) => d.url));
  const merged: DocLink[] = [...existing];
  for (const d of fromMap) {
    if (!seen.has(d.url)) {
      merged.push(d);
      seen.add(d.url);
    }
  }
  return { ...article, docs: merged };
}

export const articles: Article[] = [
  ...coreArticles,
  ...unityArticles,
  ...vfxArticles,
  ...vfxPlainArticles,
  ...ebookArticles,
].map(withDocs);

export const articleMap = new Map(articles.map((a) => [a.id, a]));

export const groups: ArticleGroup[] = [
  { id: "start", title: "Start here", articleIds: ["home", "role-and-product", "study-path"] },
  {
    id: "engineering",
    title: "Unity engineering",
    articleIds: [
      "csharp",
      "solid-patterns",
      "unity-architecture",
      "lifecycle",
      "profiling",
      "rendering",
      "assets",
      "animation-physics",
      "ui",
    ],
  },
  {
    id: "collaboration",
    title: "Rooms and platforms",
    articleIds: ["networking", "platforms"],
  },
  {
    id: "delivery",
    title: "Delivery",
    articleIds: ["testing-incidents", "requirements", "ai-workflow"],
  },
  {
    id: "leadership",
    title: "Leadership",
    articleIds: ["honest-leadership", "team-leadership"],
  },
  {
    id: "vfx",
    title: "VFX / Technical Artist",
    articleIds: [
      "vfx-ta-interview",
      "vfx-explained",
      "vfx-graph-plain",
      "shader-plain",
      "vfx-plus-shader",
      "vfx-learn-by-doing",
      "particle-system",
      "vfx-graph",
      "shader-graph",
      "render-pipelines",
      "vfx-performance",
      "vfx-question-bank",
    ],
  },
  {
    id: "ebook",
    title: "Unity 6 ebook",
    articleIds: [
      "ebook",
      "ebook-unity6",
      "ebook-manual",
      "ebook-scripting",
      "ebook-api-core",
      "ebook-api-loop",
      "ebook-graphics",
      "ebook-simulation",
      "ebook-ui",
      "ebook-content",
      "ebook-ship",
      "ebook-unity-books",
    ],
  },
  {
    id: "interview",
    title: "Interview craft",
    articleIds: ["interview-playbook", "spoken-english", "stories", "cheatsheets", "question-bank"],
  },
  {
    id: "reference",
    title: "Reference",
    articleIds: ["glossary", "checklists", "resources"],
  },
];

export function getArticle(id: string) {
  return articleMap.get(id) ?? articles[0];
}

export function blockText(block: Block): string {
  switch (block.type) {
    case "p":
    case "h2":
    case "h3":
      return block.text;
    case "ul":
    case "ol":
    case "checklist":
      return block.items.join(" ");
    case "callout":
      return `${block.title} ${block.text}`;
    case "table":
      return `${block.headers.join(" ")} ${block.rows.flat().join(" ")}`;
    case "qa":
      return `${block.q} ${block.a}`;
    default:
      return "";
  }
}

export function articlePlainText(article: Article) {
  const docs = (article.docs ?? []).map((d) => `${d.title} ${d.note ?? ""}`).join(" ");
  return `${article.blocks.map(blockText).join("\n")}\n${docs}`;
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export interface SearchHit {
  article: Article;
  heading?: string;
  headingId?: string;
  score: number;
  snippet: string;
}

export function searchEncyclopedia(query: string, preferArticleId?: string): SearchHit[] {
  const words = tokenize(query);
  if (words.length === 0) return [];
  const hits: SearchHit[] = [];

  for (const article of articles) {
    let heading = "";
    let headingId = "";
    const docBlob = (article.docs ?? []).map((d) => d.title).join(" ");
    for (const block of article.blocks) {
      if (block.type === "h2" || block.type === "h3") {
        heading = block.text;
        headingId = block.id;
        continue;
      }
      const field = `${article.title} ${article.summary} ${article.tags.join(" ")} ${heading} ${blockText(block)} ${docBlob}`;
      const lower = field.toLowerCase();
      let score = 0;
      for (const w of words) {
        if (article.title.toLowerCase().includes(w)) score += 6;
        if (article.tags.some((t) => t.toLowerCase().includes(w))) score += 4;
        if (heading.toLowerCase().includes(w)) score += 5;
        if (docBlob.toLowerCase().includes(w)) score += 3;
        if (article.group === "vfx" && /(vfx|particle|shader|render|ta|artist)/.test(w)) score += 1;
        if (article.group === "ebook" && /(ebook|manual|scripting api|6000)/.test(w)) score += 2;
        if (lower.includes(w)) score += 1;
      }
      if (preferArticleId && article.id === preferArticleId) score += 18;
      if (score > 0) {
        hits.push({
          article,
          heading: heading || undefined,
          headingId: headingId || undefined,
          score,
          snippet: blockText(block).slice(0, 280),
        });
      }
    }
  }

  hits.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const unique: SearchHit[] = [];
  for (const h of hits) {
    const key = `${h.article.id}:${h.headingId ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(h);
    if (unique.length >= 8) break;
  }
  return unique;
}
