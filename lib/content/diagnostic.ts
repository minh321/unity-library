import { diagnosticQuestionsPart1 } from "@/lib/content/diagnostic-p1";
import { diagnosticQuestionsPart2 } from "@/lib/content/diagnostic-p2";
import { diagnosticQuestionsPart3 } from "@/lib/content/diagnostic-p3";
import type { Question } from "@/lib/trainer/types";

export const diagnosticQuestions: Question[] = [
  ...diagnosticQuestionsPart1,
  ...diagnosticQuestionsPart2,
  ...diagnosticQuestionsPart3,
];

export const diagnosticIds = diagnosticQuestions.map((q) => q.id);
