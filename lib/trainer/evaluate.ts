import { hydrateQuestion, parseChoiceId, scoresForTier, bestChoice } from "@/lib/content/mcq";
import { round1 } from "@/lib/utils";
import type {
  ChoiceReview,
  Evaluation,
  HitConcept,
  Mcq,
  Question,
  ScoreBreakdown,
  Verdict,
} from "@/lib/trainer/types";

function verdictForTier(tier: "best" | "partial" | "weak" | "trap", difficulty: Question["difficulty"]): Verdict {
  if (tier === "best") return difficulty === "team-lead" || difficulty === "senior" ? "team-lead" : "senior";
  if (tier === "partial") return "mid";
  if (tier === "weak") return "junior";
  return "not-acceptable";
}

function overallOf(scores: ScoreBreakdown) {
  return round1(
    scores.technicalCorrectness * 0.22 +
      scores.depth * 0.18 +
      scores.productionThinking * 0.18 +
      scores.leadership * 0.14 +
      scores.communication * 0.14 +
      scores.evidence * 0.14
  );
}

function pickFollowUpStem(question: Question) {
  return (
    question.followUpMcq?.instruction ||
    question.followUps.find((r) => r.always)?.question ||
    question.followUps[0]?.question ||
    "Which failure mode did that choice ignore?"
  );
}

export function evaluateAnswer(question: Question, answer: string, phase: "question" | "follow-up" = "question"): Evaluation {
  const q = hydrateQuestion(question);
  const mcq: Mcq | undefined = phase === "follow-up" ? q.followUpMcq : q.mcq;
  if (!mcq?.choices.length) {
    return evaluateMissing(q, answer);
  }

  const selected = parseChoiceId(answer, mcq);
  const best = bestChoice(mcq);

  if (!selected) {
    return {
      scores: scoresForTier("weak"),
      overall: overallOf(scoresForTier("weak")),
      verdict: "not-acceptable",
      strong: [],
      problems: [
        "That was not one of the options. Tap A–D. Commands still start with /.",
      ],
      hitConcepts: q.concepts.map((c) => ({
        id: c.id,
        label: c.label,
        required: c.required,
        hit: false,
      })),
      antiPatterns: [],
      englishNotes: [],
      followUp: pickFollowUpStem(q),
      spokenAnswer: q.spokenAnswer,
      deepAnswer: q.deepAnswer,
      keyPhrases: q.keyPhrases,
      wordCount: answer.trim().split(/\s+/).filter(Boolean).length,
      isBest: false,
      choiceReview: reviewList(mcq, undefined, best.id),
    };
  }

  const scores = scoresForTier(selected.tier);
  const hitIds = new Set(selected.conceptIds ?? []);
  const hitConcepts: HitConcept[] = q.concepts.map((c) => ({
    id: c.id,
    label: c.label,
    required: c.required,
    hit: hitIds.has(c.id),
  }));

  const strong =
    selected.tier === "best"
      ? [selected.why]
      : selected.tier === "partial"
        ? ["Part of the mechanism is right. It is not enough for Team Lead."]
        : [];

  const problems =
    selected.tier === "best"
      ? []
      : phase === "follow-up"
        ? [selected.why, `Best option was ${best.id}: ${best.text}`]
        : [selected.why, "The best option is not shown yet. Answer the follow-up first."];

  if (selected.tier === "trap") {
    problems.unshift("This option would fail a real panel.");
  }

  return {
    scores,
    overall: overallOf(scores),
    verdict: verdictForTier(selected.tier, q.difficulty),
    strong,
    problems,
    hitConcepts,
    antiPatterns:
      selected.tier === "trap"
        ? [
            {
              id: "trap",
              label: "Trap option",
              note: selected.why,
              kind: "overclaim",
            },
          ]
        : [],
    englishNotes:
      selected.tier === "best"
        ? [
            {
              issue: "Spoken version",
              suggestion: "If asked to talk this, use the model answer's 60–90s form—not the multiple-choice paragraph.",
            },
          ]
        : [],
    followUp: pickFollowUpStem(q),
    spokenAnswer: q.spokenAnswer,
    deepAnswer: `${q.deepAnswer}\n\nWhy ${best.id} is best: ${best.why}`,
    keyPhrases: q.keyPhrases,
    wordCount: selected.text.split(/\s+/).length,
    selectedChoiceId: selected.id,
    isBest: selected.tier === "best",
    revealBest: phase === "follow-up" || selected.tier === "best",
    choiceReview: reviewList(mcq, selected.id, best.id),
  };
}

function reviewList(mcq: Mcq, selectedId: string | undefined, bestId: string): ChoiceReview[] {
  return mcq.choices.map((c) => ({
    id: c.id,
    text: c.text,
    tier: c.tier,
    selected: c.id === selectedId,
    best: c.id === bestId,
    why: c.why,
  }));
}

function evaluateMissing(question: Question, answer: string): Evaluation {
  const scores = scoresForTier("weak");
  return {
    scores,
    overall: overallOf(scores),
    verdict: "not-acceptable",
    strong: [],
    problems: ["This item has no multiple-choice options yet."],
    hitConcepts: [],
    antiPatterns: [],
    englishNotes: [],
    followUp: "Type /skip to continue.",
    spokenAnswer: question.spokenAnswer,
    deepAnswer: question.deepAnswer,
    keyPhrases: question.keyPhrases,
    wordCount: answer.trim().split(/\s+/).length,
  };
}

export function verdictLabel(v: Verdict) {
  switch (v) {
    case "team-lead":
      return "Team Lead level";
    case "senior":
      return "Senior level";
    case "mid":
      return "Mid-level";
    case "junior":
      return "Junior level";
    default:
      return "Not yet acceptable";
  }
}

export function wouldPass(v: Verdict) {
  return v === "senior" || v === "team-lead" || v === "mid";
}
