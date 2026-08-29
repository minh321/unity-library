export type SkillArea =
  | "csharp-fundamentals"
  | "advanced-csharp"
  | "oop-solid"
  | "design-patterns"
  | "dsa"
  | "unity-lifecycle"
  | "unity-architecture"
  | "profiling"
  | "rendering"
  | "memory"
  | "assets"
  | "animation"
  | "physics"
  | "ui"
  | "networking"
  | "cross-platform"
  | "testing"
  | "debugging"
  | "documentation"
  | "estimation"
  | "leadership"
  | "mentoring"
  | "conflict"
  | "requirements"
  | "technical-english";

export type SessionMode =
  | "diagnostic"
  | "learn"
  | "drill"
  | "mock-technical"
  | "mock-leadership"
  | "mock-system-design"
  | "mock-english"
  | "review"
  | "question-bank"
  | "cheatsheet"
  | "stories"
  | "final-exam";

export type Verdict =
  | "not-acceptable"
  | "junior"
  | "mid"
  | "senior"
  | "team-lead";

export type ScoreCategory =
  | "technicalCorrectness"
  | "depth"
  | "productionThinking"
  | "leadership"
  | "communication"
  | "evidence";

export interface Concept {
  id: string;
  label: string;
  synonyms: string[];
  weight: number;
  required: boolean;
  seniority?: "mid" | "senior" | "lead";
}

export interface AntiPattern {
  id: string;
  label: string;
  patterns: string[];
  penalty: number;
  note: string;
  kind: "technical" | "communication" | "leadership" | "overclaim";
}

export interface FollowUpRule {
  ifMissing?: string[];
  ifAntiPattern?: string[];
  always?: boolean;
  question: string;
}

export type ChoiceTier = "best" | "partial" | "weak" | "trap";

export interface Choice {
  id: "A" | "B" | "C" | "D";
  text: string;
  tier: ChoiceTier;
  why: string;
  conceptIds?: string[];
}

export interface Mcq {
  instruction?: string;
  choices: Choice[];
}

export interface Question {
  id: string;
  mode: SessionMode;
  area: SkillArea;
  relatedAreas?: SkillArea[];
  title: string;
  prompt: string;
  interviewerNote?: string;
  concepts: Concept[];
  antiPatterns: AntiPattern[];
  followUps: FollowUpRule[];
  spokenAnswer: string;
  deepAnswer: string;
  keyPhrases: string[];
  englishTips: string[];
  difficulty: "basic" | "intermediate" | "senior" | "team-lead";
  mcq?: Mcq;
  followUpMcq?: Mcq;
}

export interface ScoreBreakdown {
  technicalCorrectness: number;
  depth: number;
  productionThinking: number;
  leadership: number;
  communication: number;
  evidence: number;
}

export interface HitConcept {
  id: string;
  label: string;
  hit: boolean;
  required: boolean;
}

export interface FoundAntiPattern {
  id: string;
  label: string;
  note: string;
  kind: AntiPattern["kind"];
}

export interface EnglishNote {
  issue: string;
  suggestion: string;
}

export interface ChoiceReview {
  id: Choice["id"];
  text: string;
  tier: ChoiceTier;
  selected: boolean;
  best: boolean;
  why: string;
}

export interface Evaluation {
  scores: ScoreBreakdown;
  overall: number;
  verdict: Verdict;
  strong: string[];
  problems: string[];
  hitConcepts: HitConcept[];
  antiPatterns: FoundAntiPattern[];
  englishNotes: EnglishNote[];
  followUp: string;
  spokenAnswer: string;
  deepAnswer: string;
  keyPhrases: string[];
  wordCount: number;
    selectedChoiceId?: string;
  isBest?: boolean;
  revealBest?: boolean;
  choiceReview?: ChoiceReview[];
}

export interface Message {
  id: string;
  role: "trainer" | "candidate" | "system";
  kind:
    | "briefing"
    | "question"
    | "answer"
    | "evaluation"
    | "follow-up"
    | "improved"
    | "teach"
    | "recap"
    | "command"
    | "note";
  text: string;
  questionId?: string;
  evaluation?: Evaluation;
  createdAt: number;
}

export interface ProgressEntry {
  topic: SkillArea;
  lastScore: number;
  bestScore: number;
  recurringMistake: string;
  nextExercise: string;
  attempts: number;
}

export interface Weakness {
  id: string;
  label: string;
  count: number;
  lastSeenQuestionId: string;
  nextExercise: string;
}

export interface SessionState {
  version: number;
  mode: SessionMode;
  phase: "briefing" | "question" | "follow-up" | "improved" | "complete";
  currentQuestionId: string | null;
  questionQueue: string[];
  questionIndex: number;
  messages: Message[];
  evaluations: Record<string, Evaluation[]>;
  progress: ProgressEntry[];
  weaknesses: Weakness[];
  diagnosticComplete: boolean;
  skillScores: Partial<Record<SkillArea, number>>;
  learnTopic: string | null;
  examCoaching: boolean;
  startedAt: number;
  updatedAt: number;
}

export interface SkillRow {
  area: SkillArea;
  label: string;
  current: number;
  target: number;
  evidence: string;
  gap: string;
  priority: "P0" | "P1" | "P2" | "P3";
}
