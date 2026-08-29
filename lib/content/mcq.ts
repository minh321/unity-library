import type { Choice, ChoiceTier, Mcq, Question, ScoreBreakdown } from "@/lib/trainer/types";
import { mcqBankPart1 } from "@/lib/content/mcq-p1";
import { mcqBankPart2 } from "@/lib/content/mcq-p2";
import { mcqBankPart3 } from "@/lib/content/mcq-p3";

const scoresByTier: Record<ChoiceTier, ScoreBreakdown> = {
  best: {
    technicalCorrectness: 4.7,
    depth: 4.6,
    productionThinking: 4.7,
    leadership: 4.5,
    communication: 4.6,
    evidence: 4.4,
  },
  partial: {
    technicalCorrectness: 3.2,
    depth: 2.8,
    productionThinking: 2.9,
    leadership: 2.7,
    communication: 3.4,
    evidence: 2.6,
  },
  weak: {
    technicalCorrectness: 1.8,
    depth: 1.5,
    productionThinking: 1.6,
    leadership: 1.7,
    communication: 2.4,
    evidence: 1.4,
  },
  trap: {
    technicalCorrectness: 0.8,
    depth: 0.7,
    productionThinking: 0.9,
    leadership: 0.5,
    communication: 1.8,
    evidence: 0.4,
  },
};

export function scoresForTier(tier: ChoiceTier): ScoreBreakdown {
  return { ...scoresByTier[tier] };
}

function C(
  id: Choice["id"],
  tier: ChoiceTier,
  text: string,
  why: string,
  conceptIds?: string[]
): Choice {
  return { id, text, tier, why, conceptIds };
}

function block(choices: [Choice, Choice, Choice, Choice], instruction?: string): Mcq {
  return { instruction, choices };
}

export interface McqPack {
  mcq: Mcq;
  followUpMcq: Mcq;
}

export const mcqBank = {
  ...mcqBankPart1,
  ...mcqBankPart2,
  ...mcqBankPart3,
};

export function fallbackMcq(question: Question): McqPack {
  return {
    mcq: block([
      C("A", "best", question.spokenAnswer, "This matches the production explanation.", question.concepts.map((c) => c.id)),
      C("B", "partial", "Cover the main definition, skip failure modes and team impact.", "Incomplete for Team Lead.", []),
      C("C", "weak", "I would look it up and optimize later.", "Vague. No measurement, no ownership.", []),
      C("D", "trap", "I have already shipped this exact system at scale as Team Leader.", "Do not invent experience.", []),
    ]),
    followUpMcq: block([
      C(
        "A",
        "best",
        question.followUps.find((f) => f.always)?.question
          ? question.deepAnswer.slice(0, 280)
          : question.deepAnswer.slice(0, 280),
        "Stays specific about failure and validation.",
        []
      ),
      C("B", "partial", "Handle the happy path and add tests later.", "Missing the failure case.", []),
      C("C", "weak", "Restart the app if it goes wrong.", "Not a production plan.", []),
      C("D", "trap", "Ship and let QA discover edge cases in production.", "Unacceptable.", []),
    ]),
  };
}

export function hydrateQuestion(question: Question): Question {
  if (question.mcq?.choices.length && question.followUpMcq?.choices.length) return question;
  const pack = mcqBank[question.id] ?? fallbackMcq(question);
  return {
    ...question,
    mcq: question.mcq ?? pack.mcq,
    followUpMcq: question.followUpMcq ?? pack.followUpMcq,
  };
}

export function parseChoiceId(answer: string, mcq: Mcq): Choice | undefined {
  const raw = answer.trim();
  const letter = raw.match(/^\s*([A-Da-d])(?:[\).:\s-]|$)/);
  if (letter) {
    const id = letter[1].toUpperCase() as Choice["id"];
    return mcq.choices.find((c) => c.id === id);
  }
  const lowered = raw.toLowerCase();
  return mcq.choices.find(
    (c) => lowered === c.text.toLowerCase() || lowered.includes(c.text.toLowerCase().slice(0, 40))
  );
}

export function bestChoice(mcq: Mcq) {
  return mcq.choices.find((c) => c.tier === "best") ?? mcq.choices[0];
}

export function mcqForLearn(prompt: string, production: string, summary: string[]): McqPack {
  return {
    mcq: block([
      C("A", "partial", summary.map((s) => s).join(" ") || "Name the terms and stop.", "Keywords without production constraints.", []),
      C("B", "best", production, "Production-level: mechanism, constraint, and team impact.", ["mech", "prod"]),
      C("C", "trap", "I already run this in production as the Team Leader of a 30-user simulation.", "Do not invent that experience.", []),
      C("D", "weak", "I would use the default Unity sample and iterate if players complain.", "No measurement, no ownership.", []),
    ], prompt),
    followUpMcq: block([
      C("A", "best", `Validate on target devices, name a failure mode, and assign who owns the trade-off (eng/art/QA). ${summary[0] ?? ""}`, "Failure + owner.", ["prod"]),
      C("B", "partial", "Write a doc and hope the team reads it.", "Docs without a test or owner.", []),
      C("C", "weak", "Ship the tutorial settings.", "Tutorial ≠ production.", []),
      C("D", "trap", "Trust the first AI-generated implementation.", "Review is required.", []),
    ]),
  };
}
