import { candidate } from "@/lib/content/profile";
import { articlePlainText, getArticle, searchEncyclopedia } from "@/lib/encyclopedia/catalog";
import { formatDocsForChat } from "@/lib/encyclopedia/unity-docs";
import type { ChatTurn, TrainerReply } from "@/lib/encyclopedia/types";

function looksLikeOverclaim(text: string) {
  return /(i have been a team leader|i managed a team of|i shipped a 30-user|our production 3d collaboration|i am an expert in every|i am a technical artist|i shipped a vfx graph library|our production vfx graph)/i.test(
    text
  );
}

function intent(question: string) {
  const q = question.toLowerCase();
  if (/(quiz|test me|check me|drill)/.test(q)) return "quiz";
  if (/(90 second|speak|say this|spoken)/.test(q)) return "speak";
  if (/(wrong with|review this|grade this)/.test(q)) return "review";
  if (/(difference|vs|versus|compare)/.test(q)) return "compare";
  if (/(start|study path|what should i read)/.test(q)) return "path";
  return "explain";
}

function voice(article?: { group: string }) {
  return article?.group === "vfx" ? "Technical Artist" : "Team Lead";
}

export function askTrainer(input: {
  question: string;
  articleId?: string;
  history?: ChatTurn[];
}): TrainerReply {
  const question = input.question.trim();
  if (!question) {
    return {
      text: "Ask about the section you are reading. For example: what would I measure? or explain occupancy in 90 seconds.",
      citations: [],
      suggestions: ["What will this interview test?", "Where should I start?"],
    };
  }

  if (looksLikeOverclaim(question)) {
    const vfx = /technical artist|vfx graph/i.test(question);
    return {
      text: vfx
        ? "Stop. You have not held a Technical Artist title and you have not shipped a production VFX Graph library. Use: you are a Unity engineer who has measured CPU/GPU and will talk Particle System, VFX Graph, Shader Graph, and URP 17 from mechanism and Unity 6 docs — not from a reel you do not have."
        : `Stop. That wording invents experience. ${candidate.forbiddenClaims[0]} is not available to you. Use: you have not held the formal Team Leader title for a full year, then prove migrations, live-title stability, and coordination. If this was about netcode, say you have not shipped a 30-user 3D room; you have shipped SmartFox, REST, and WebSocket clients.`,
      citations: vfx
        ? [{ articleId: "vfx-ta-interview", title: "VFX / Technical Artist interview" }]
        : [{ articleId: "honest-leadership", title: "Leading without the title" }],
      suggestions: vfx
        ? ["Give me the TA opening sentence.", "When do I pick Particle System over VFX Graph?"]
        : [
            "Give me the title-gap sentence and three proofs.",
            "How do I describe SmartFox experience without overclaiming?",
          ],
    };
  }

  const hits = searchEncyclopedia(question, input.articleId);
  const current = input.articleId ? getArticle(input.articleId) : undefined;
  const kind = intent(question);

  if (kind === "path") {
    const vfx =
      current?.group === "vfx" || /(vfx|shader|particle|technical artist)/i.test(question);
    const ebookish =
      current?.group === "ebook" || /(ebook|manual atlas|scripting api|official e-book)/i.test(question);
    const guide = getArticle(vfx ? "vfx-ta-interview" : ebookish ? "ebook" : "study-path");
    return {
      text: vfx
        ? `For the Technical Artist interview: if graphs still feel foreign, start at **VFX in plain language**, then VFX Graph / Shader Graph said simply, then Learn by doing. After that: Render pipelines (Unity 6), Particle System, VFX Graph, Shader Graph, VFX lookdev cost. Opening sentence: you have not held a TA title; you are a Unity engineer who measures GPU. Unity’s VFX PDF is extra homework, not a reprint in this library. Unity 6 docs are on each article.${formatDocsForChat(guide.docs, 3)}`
        : ebookish
          ? `Unity 6 ebook order: cover → New in 6.0 → Manual atlas → Programming in Unity → core Scripting API types → Player loop/Awaitable → graphics → world → UI → content → ship → official Unity PDFs. Manual: https://docs.unity3d.com/6000.0/Documentation/Manual/index.html — API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/index.html${formatDocsForChat(guide.docs, 3)}`
        : `P0 is honest leadership, measurement-first profiling, collaboration rooms, and Unity architecture. P1 is rendering interiors, Addressables, requirements, incidents. Later, a VFX / Technical Artist wing and a Unity 6 ebook that walks the Manual and Scripting API. One evening: one article, three trainer questions, Check yourself, one 90-second recording.${formatDocsForChat(guide.docs, 3)}`,
      citations: [
        { articleId: guide.id, title: guide.title },
        {
          articleId: vfx ? "vfx-explained" : ebookish ? "ebook-manual" : "honest-leadership",
          title: vfx
            ? "VFX in plain language"
            : ebookish
              ? "Ch. 2 — Manual atlas"
              : "Leading without the title",
        },
      ],
      suggestions: guide.suggestedQuestions.slice(0, 3),
    };
  }

  if (hits.length === 0 && current) {
    return {
      text: `I do not have a dedicated paragraph for that phrasing in the library. On **${current.title}**, the article argues: ${current.summary}\n\nA ${voice(current)} still answers unknowns with assumptions, failure modes, who owns the risk, and how you would measure. I will not invent a Unity node or API. Try a heading from this article, open a Unity 6 doc linked on the article, or ask me to quiz you on it.${formatDocsForChat(current.docs)}`,
      citations: [{ articleId: current.id, title: current.title }],
      suggestions: current.suggestedQuestions.slice(0, 3),
    };
  }

  if (hits.length === 0) {
    return {
      text: "I could not find that in the encyclopedia. Ask about profiling, Addressables, occupancy, VFX Graph, Awaitable, the Unity 6 Manual atlas, or the title gap — or open an article so I have context.",
      citations: [],
      suggestions: ["Open Profiling and explain CPU vs GPU", "When do I pick VFX Graph?"],
    };
  }

  const top = hits.slice(0, 3);
  const primary = top[0];

  if (kind === "quiz") {
    const qs =
      primary.article.suggestedQuestions[0] ||
      `In one sentence, what is the production rule in “${primary.heading ?? primary.article.title}”?`;
    return {
      text: `Quiz from **${primary.article.title}**${primary.heading ? ` / ${primary.heading}` : ""}.\n\n${qs}\n\nAnswer in ${voice(primary.article)} voice: mechanism, measurement or failure mode, trade-off. I will mark overclaims. After you answer, I will compare you to the library — not to a slogan.${formatDocsForChat(primary.article.docs, 2)}`,
      citations: top.map((h) => ({
        articleId: h.article.id,
        title: h.article.title,
        heading: h.heading,
      })),
      suggestions: ["Reveal the library answer", "Make it harder", "Another question"],
    };
  }

  if (kind === "speak") {
    const snippet = primary.snippet;
    return {
      text: `Spoken 60–90s from **${primary.article.title}**:\n\n${compressSpoken(snippet, current?.id)}\n\nDo not recast this as a memorized script. If you lack production time on it, add: I have not used that in production, but this is how I would approach it.`,
      citations: [{ articleId: primary.article.id, title: primary.article.title, heading: primary.heading }],
      suggestions: primary.article.suggestedQuestions.slice(0, 2),
    };
  }

  const body = top
    .map((h) => {
      const head = h.heading ? `### ${h.heading}` : `### ${h.article.title}`;
      return `${head}\n${h.snippet}`;
    })
    .join("\n\n");

  const contextLine = current
    ? `You are in **${current.title}**. I pulled the closest library sections.`
    : `I searched the encyclopedia.`;

  const closer =
    kind === "compare"
      ? "\n\nIf two techniques both “batch,” name what each actually reduces (CPU submit vs GPU fill vs memory) and when it fails. Particle System vs VFX Graph: C# access and thousands vs GPU millions and compute."
      : "\n\nIf a sentence is still fuzzy, quote it and ask again. I will stay on mechanism, measurement, and failure — not trivia. Unity 6 docs are linked on the article; I will not invent nodes.";

  return {
    text: `${contextLine}\n\n${body}${closer}${formatDocsForChat(current?.docs ?? primary.article.docs)}`,
    citations: top.map((h) => ({
      articleId: h.article.id,
      title: h.article.title,
      heading: h.heading,
    })),
    suggestions: (current?.suggestedQuestions ?? primary.article.suggestedQuestions).slice(0, 3),
  };
}

function compressSpoken(snippet: string, articleId?: string) {
  const article = articleId ? getArticle(articleId) : undefined;
  const honest =
    articleId === "networking" || articleId === "animation-physics"
      ? " I have not shipped this exact 3D collaboration product; I would still start from server occupancy and snapshots."
      : article?.group === "vfx"
        ? " I have not held a Technical Artist title; I would still start from the Unity 6 chooser, a measured capture, and a named quality tier."
        : "";
  const cut = snippet.replace(/\s+/g, " ").slice(0, 420);
  return cut + (cut.length === 420 ? "…" : "") + honest;
}

export function greetingFor(articleId?: string): TrainerReply {
  const article = articleId ? getArticle(articleId) : getArticle("home");
  const extra =
    article.group === "vfx"
      ? " This wing is the Technical Artist interview. I will not invent a TA title or a VFX Graph shipping credit."
      : " I will not invent your Team Leader title.";
  return {
    text: `Trainer is on **${article.title}**.\n\n${article.summary}\n\nAsk about a heading you do not understand. I answer from this encyclopedia.${extra}${formatDocsForChat(article.docs, 3)}`,
    citations: [{ articleId: article.id, title: article.title }],
    suggestions: article.suggestedQuestions.slice(0, 3),
  };
}

export function articleDigest(articleId: string) {
  const article = getArticle(articleId);
  return {
    title: article.title,
    summary: article.summary,
    text: articlePlainText(article).slice(0, 6000),
  };
}
