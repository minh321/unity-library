import type { LearnTopic } from "@/lib/content/modules";
import type { Question, SkillArea } from "@/lib/trainer/types";
import { quizzesPart1 } from "@/lib/content/learn-quiz-p1";
import { quizzesPart2 } from "@/lib/content/learn-quiz-p2";
import { quizzesPart3 } from "@/lib/content/learn-quiz-p3";

const areaByTopic: Record<string, SkillArea> = {
  "value-ref": "csharp-fundamentals",
  "async-unity": "advanced-csharp",
  solid: "oop-solid",
  boundaries: "unity-architecture",
  lifecycle: "unity-lifecycle",
  process: "profiling",
  batching: "rendering",
  addressables: "assets",
  "shared-interact": "animation",
  canvas: "ui",
  authority: "networking",
  tiers: "cross-platform",
  incident: "debugging",
  req: "requirements",
  "title-gap": "leadership",
  ai: "documentation",
  particles: "rendering",
  "vfx-graph": "rendering",
  "shader-graph": "rendering",
  "render-pipeline": "rendering",
  "vfx-perf": "rendering",
};

const quizzes: Record<string, (area: SkillArea) => Question[]> = {
  ...quizzesPart1,
  ...quizzesPart2,
  ...quizzesPart3,
};

export function learnQuestionsFor(topic: LearnTopic): Question[] {
  const area = areaByTopic[topic.id] ?? "unity-architecture";
  const build = quizzes[topic.id];
  if (!build) return [];
  return build(area).map((question, i) => ({
    ...question,
    id: `learn-${topic.id}-${i + 1}`,
    title: `${topic.title} · check ${i + 1}`,
  }));
}

export function learnCatalogText() {
  return [
    "Learn mode is a lesson, then four check questions with plausible options—not one giant paragraph versus three jokes.",
    "",
    "Type one of these:",
    ...Object.keys(quizzes).map((id) => `/learn ${id}`),
    "",
    "Or a shortcut: /learn networking  ·  /learn profiling  ·  /learn addressables  ·  /learn leadership",
    "Module letters work too: /learn J",
  ].join("\n");
}
