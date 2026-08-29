import { briefing, cheatsheets, commandHelp, storyTemplates } from "@/lib/content/briefing";
import { diagnosticIds, diagnosticQuestions } from "@/lib/content/diagnostic";
import { findTopic, modules } from "@/lib/content/modules";
import { areaMeta } from "@/lib/content/areas";
import { hydrateQuestion, parseChoiceId } from "@/lib/content/mcq";
import { learnCatalogText, learnQuestionsFor } from "@/lib/content/learn-quiz";
import {
  drillDeck,
  finalExamIds,
  mockEnglishIds,
  mockLeadershipIds,
  mockTechnicalIds,
  questionById,
  registerQuestion,
} from "@/lib/content/questions";
import { evaluateAnswer, verdictLabel } from "@/lib/trainer/evaluate";
import { computeSkillMatrix, prepPlan } from "@/lib/trainer/skill-matrix";
import type {
  Evaluation,
  Message,
  Question,
  SessionMode,
  SessionState,
} from "@/lib/trainer/types";

const STORAGE_KEY = "unity-lead-lab-v3";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function msg(
  role: Message["role"],
  kind: Message["kind"],
  text: string,
  extra?: Partial<Message>
): Message {
  return {
    id: uid(),
    role,
    kind,
    text,
    createdAt: Date.now(),
    ...extra,
  };
}

export function initialState(): SessionState {
  const first = hydrateQuestion(diagnosticQuestions[0]);
  return {
    version: 3,
    mode: "diagnostic",
    phase: "question",
    currentQuestionId: first.id,
    questionQueue: [...diagnosticIds],
    questionIndex: 0,
    messages: [
      msg("trainer", "briefing", formatBriefing()),
      msg("trainer", "question", formatQuestion(first, 1, diagnosticIds.length), {
        questionId: first.id,
      }),
    ],
    evaluations: {},
    progress: [],
    weaknesses: [],
    diagnosticComplete: false,
    skillScores: {},
    learnTopic: null,
    examCoaching: true,
    startedAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function loadState(): SessionState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as SessionState;
    if (!parsed?.version || parsed.version < 3 || !parsed.messages?.length) return initialState();
    return parsed;
  } catch {
    return initialState();
  }
}

export function saveState(state: SessionState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, updatedAt: Date.now() }));
}

export function resetState() {
  const s = initialState();
  saveState(s);
  return s;
}

function formatBriefing() {
  return [
    briefing.title,
    "",
    ...briefing.paragraphs,
    "",
    "Evaluation axes:",
    ...briefing.axes.map((a) => `• ${a.label}: ${a.detail}`),
    "",
    "Rules in this lab: every interview item is multiple choice. Pick the best Team Lead answer. I will not reveal the correct option until you attempt the follow-up. Trap options invent titles or skip measurement. Commands still start with /.",
  ].join("\n");
}

function formatQuestion(q: Question, index: number, total: number) {
  const hydrated = hydrateQuestion(q);
  const head =
    total > 1 ? `Question ${index} of ${total} · ${areaMeta[q.area].label}` : areaMeta[q.area].label;
  const note = hydrated.mcq?.instruction ? `\n\n${hydrated.mcq.instruction}` : "\n\nChoose the best answer. Tap A–D below.";
  return `${head}\n\n${q.prompt}${note}`;
}

function currentQuestion(state: SessionState) {
  if (!state.currentQuestionId) return undefined;
  const raw =
    questionById(state.currentQuestionId) ??
    diagnosticQuestions.find((q) => q.id === state.currentQuestionId);
  return raw ? hydrateQuestion(raw) : undefined;
}

export function getCurrentQuestion(state: SessionState) {
  return currentQuestion(state);
}

export function getActiveMcq(state: SessionState) {
  const q = currentQuestion(state);
  if (!q) return undefined;
  if (state.phase === "follow-up") return q.followUpMcq;
  if (state.phase === "question") return q.mcq;
  return undefined;
}

function recordEvaluation(state: SessionState, question: Question, evaluation: Evaluation) {
  const prev = state.evaluations[question.id] ?? [];
  state.evaluations = { ...state.evaluations, [question.id]: [...prev, evaluation] };

  const existing = state.progress.find((p) => p.topic === question.area);
  const mistake = evaluation.problems[0] ?? "None this round";
  const nextExercise = `/learn ${areaMeta[question.area].module} then /drill ${question.area}`;
  if (existing) {
    existing.lastScore = evaluation.overall;
    existing.bestScore = Math.max(existing.bestScore, evaluation.overall);
    existing.attempts += 1;
    if (evaluation.overall < 3.5) existing.recurringMistake = mistake;
    existing.nextExercise = nextExercise;
  } else {
    state.progress = [
      ...state.progress,
      {
        topic: question.area,
        lastScore: evaluation.overall,
        bestScore: evaluation.overall,
        recurringMistake: evaluation.overall < 3.5 ? mistake : "—",
        nextExercise,
        attempts: 1,
      },
    ];
  }

  for (const p of evaluation.problems) {
    const id = p.slice(0, 80);
    const w = state.weaknesses.find((x) => x.label === p);
    if (w) {
      w.count += 1;
      w.lastSeenQuestionId = question.id;
    } else {
      state.weaknesses = [
        ...state.weaknesses,
        { id, label: p, count: 1, lastSeenQuestionId: question.id, nextExercise },
      ];
    }
  }
}

function formatEvaluation(e: Evaluation, coaching: boolean) {
  const lines = [
    `Verdict: ${verdictLabel(e.verdict)}  ·  overall ${e.overall.toFixed(1)} / 5`,
    "",
    "Scores",
    `• Technical correctness  ${e.scores.technicalCorrectness}`,
    `• Depth  ${e.scores.depth}`,
    `• Production thinking  ${e.scores.productionThinking}`,
    `• Leadership  ${e.scores.leadership}`,
    `• Communication  ${e.scores.communication}`,
    `• Evidence  ${e.scores.evidence}`,
    "",
    "What was strong",
    e.strong.length ? e.strong.map((s) => `• ${s}`).join("\n") : "• Nothing I will give credit for yet.",
    "",
    "Problems",
    e.problems.length ? e.problems.map((s) => `• ${s}`).join("\n") : "• No major holes in this pass.",
  ];
  if (coaching && e.englishNotes.length) {
    lines.push("", "English notes");
    for (const n of e.englishNotes) {
      lines.push(`• ${n.issue} → ${n.suggestion}`);
    }
  }
  lines.push("", "Covered concepts");
  for (const c of e.hitConcepts) {
    lines.push(`${c.hit ? "✓" : "○"} ${c.label}${c.required ? "" : " (bonus)"}`);
  }
  return lines.join("\n");
}

function formatImproved(e: Evaluation) {
  return [
    "Improved answer — spoken (60–90s)",
    e.spokenAnswer,
    "",
    "Deeper technical version",
    e.deepAnswer,
    "",
    "Key phrases",
    ...e.keyPhrases.map((k) => `• ${k}`),
  ].join("\n");
}

function nextInQueue(state: SessionState) {
  const nextIndex = state.questionIndex + 1;
  if (nextIndex >= state.questionQueue.length) {
    state.phase = "complete";
    state.currentQuestionId = null;
    const recap = buildRecap(state);
    state.messages = [...state.messages, msg("trainer", "recap", recap)];
    if (state.mode === "diagnostic") state.diagnosticComplete = true;
    return;
  }
  state.questionIndex = nextIndex;
  const id = state.questionQueue[nextIndex];
  state.currentQuestionId = id;
  state.phase = "question";
  const q = questionById(id);
  if (q) {
    state.messages = [
      ...state.messages,
      msg("trainer", "question", formatQuestion(q, nextIndex + 1, state.questionQueue.length), {
        questionId: q.id,
      }),
    ];
  }
}

function buildRecap(state: SessionState) {
  const rows = computeSkillMatrix(state.evaluations);
  const plan = prepPlan(rows);
  const ranked = [...state.progress].sort((a, b) => b.lastScore - a.lastScore);
  const strong = ranked.slice(0, 3);
  const weak = [...state.progress].sort((a, b) => a.lastScore - b.lastScore).slice(0, 3);
  const p0 = rows.filter((r) => r.priority === "P0");

  const lines = [
    state.mode === "diagnostic" ? "Diagnostic complete. Skill matrix follows." : "Session block complete.",
    "",
    "Three strongest areas",
    ...(strong.length
      ? strong.map((s) => `• ${areaMeta[s.topic].label} (${s.lastScore.toFixed(1)})`)
      : ["• Not enough answers yet"]),
    "",
    "Three weakest areas",
    ...(weak.length
      ? weak.map((s) => `• ${areaMeta[s.topic].label} (${s.lastScore.toFixed(1)}) — ${s.recurringMistake}`)
      : ["• Not enough answers yet"]),
    "",
    "P0 gaps",
    ...p0.map((r) => `• ${r.label}: ${r.gap}`),
    "",
    "Preparation plan",
    ...plan.weeks.map((w) => `• ${w.name}: ${w.items.join("; ")}`),
    "",
    "Five questions for next session",
    "• How do you know a room is GPU-bound on a mid-range Android device?",
    "• When can an Addressable room pack actually leave memory?",
    "• What is server-authoritative in a 30-user training room?",
    "• How do you cut 'create virtual rooms' to a two-week MVP?",
    "• Why are you ready to lead without the formal title?",
    "",
    "Practical assignment: Record a 90-second intro using the title-gap sentence and three numbers from your real history.",
    "Leadership exercise: Write the STAR for protecting the revenue title. Split I / team.",
    "English exercise: Answer the GPU-bound question out loud twice. Cut filler on the second take.",
    "",
    "Continue with /learn networking, /drill profiling, /stories, or /mock technical.",
  ];
  return lines.join("\n");
}

function startQueue(state: SessionState, mode: SessionMode, ids: string[], intro: string) {
  const questions = ids.map(questionById).filter(Boolean) as Question[];
  if (questions.length === 0) {
    state.messages = [...state.messages, msg("trainer", "note", "I do not have that question set.")];
    return;
  }
  state.mode = mode;
  state.questionQueue = questions.map((q) => q.id);
  state.questionIndex = 0;
  state.currentQuestionId = questions[0].id;
  state.phase = "question";
  state.examCoaching = mode !== "final-exam";
  state.messages = [
    ...state.messages,
    msg("system", "command", intro),
    msg("trainer", "question", formatQuestion(questions[0], 1, questions.length), {
      questionId: questions[0].id,
    }),
  ];
}

function formatLearn(topicQuery: string) {
  const t = findTopic(topicQuery);
  return {
    text: [
      `/learn ${t.title}  ·  Module ${t.module}`,
      "",
      "1. Simple explanation",
      t.simple,
      "",
      "2. Production-level explanation",
      t.production,
      "",
      "3. Unity example",
      t.unityExample,
      "",
      "4. Common mistakes",
      ...t.mistakes.map((m) => `• ${m}`),
      "",
      "5. Trade-offs",
      ...t.tradeoffs.map((m) => `• ${m}`),
      "",
      "6. Checks",
      "Four multiple-choice checks follow. Each has one best answer and three plausible distractors—not joke options.",
      "",
      "Typical interview prompt (for when you speak this later)",
      t.interviewQuestion,
      "",
      "Summary card",
      ...t.summary.map((m) => `• ${m}`),
    ].join("\n"),
    follow: t.interviewQuestion,
    followUps: t.followUps,
    topic: t,
  };
}

function formatBank(topic: string) {
  const deck = drillDeck(topic).length ? drillDeck(topic) : diagnosticQuestions;
  const groups = {
    Basic: deck.filter((q) => q.difficulty === "basic"),
    Intermediate: deck.filter((q) => q.difficulty === "intermediate"),
    Senior: deck.filter((q) => q.difficulty === "senior"),
    "Team Lead": deck.filter((q) => q.difficulty === "team-lead"),
  };
  const lines = [`Question bank — ${topic || "diagnostic mix"}`, ""];
  for (const [name, list] of Object.entries(groups)) {
    lines.push(name);
    const items = list.length ? list : deck.slice(0, 2);
    for (const q of items) {
      lines.push(`• ${q.prompt}`);
    }
    lines.push("");
  }
  lines.push("Follow-up traps");
  lines.push("• What would you measure?");
  lines.push("• Which Unity tools?");
  lines.push("• What evidence confirms the bottleneck?");
  lines.push("• What trade-offs?");
  lines.push("• How do you validate on device?");
  lines.push("• What do you tell Product / art / QA?");
  lines.push("", "Say /drill " + (topic || "profiling") + " to be tested without seeing answers.");
  return lines.join("\n");
}

function formatWeaknesses(state: SessionState) {
  const sorted = [...state.weaknesses].sort((a, b) => b.count - a.count);
  if (sorted.length === 0) {
    return "No recurring weaknesses recorded yet. Complete a few answers first.";
  }
  return [
    "Recurring weaknesses",
    ...sorted.slice(0, 8).map((w) => `• (${w.count}×) ${w.label}\n  Next: ${w.nextExercise}`),
    "",
    "Progress",
    ...state.progress.map(
      (p) =>
        `• ${areaMeta[p.topic].label}: last ${p.lastScore.toFixed(1)}, best ${p.bestScore.toFixed(1)} — ${p.recurringMistake}`
    ),
  ].join("\n");
}

function handleCommand(state: SessionState, raw: string): SessionState {
  const text = raw.trim();
  const [cmd, ...rest] = text.split(/\s+/);
  const arg = rest.join(" ").trim();
  const c = cmd.toLowerCase();

  if (c === "/diagnose") {
    const fresh = initialState();
    fresh.messages = [
      msg("system", "command", "Diagnostic restarted. Same rules: one question, then a follow-up."),
      ...fresh.messages,
    ];
    return fresh;
  }
  if (c === "/reset") return resetState();
  if (c === "/help" || c === "/commands") {
    state.messages = [
      ...state.messages,
      msg(
        "trainer",
        "note",
        ["Commands", ...commandHelp.map((x) => `${x.cmd} — ${x.why}`)].join("\n")
      ),
    ];
    return state;
  }
  if (c === "/learn") {
    if (!arg) {
      state.messages = [
        ...state.messages,
        msg("trainer", "teach", learnCatalogText()),
      ];
      state.mode = "learn";
      state.phase = "complete";
      state.currentQuestionId = null;
      state.questionQueue = [];
      return state;
    }
    const learned = formatLearn(arg);
    const questions = learnQuestionsFor(learned.topic);
    if (questions.length === 0) {
      state.messages = [
        ...state.messages,
        msg("trainer", "note", `No lesson pack for "${arg}".\n\n${learnCatalogText()}`),
      ];
      return state;
    }
    for (const item of questions) registerQuestion(item);
    state.mode = "learn";
    state.learnTopic = learned.topic.id;
    state.examCoaching = true;
    state.questionQueue = questions.map((item) => item.id);
    state.questionIndex = 0;
    state.currentQuestionId = questions[0].id;
    state.phase = "question";
    state.messages = [
      ...state.messages,
      msg(
        "system",
        "command",
        `Learn: ${learned.topic.title}. Read the lesson, then four checks. The best option is explained after each pick.`
      ),
      msg("trainer", "teach", learned.text),
      msg("trainer", "question", formatQuestion(questions[0], 1, questions.length), {
        questionId: questions[0].id,
      }),
    ];
    return state;
  }
  if (c === "/drill") {
    const deck = drillDeck(arg || "profiling");
    const ids = (deck.length ? deck : diagnosticQuestions.slice(2, 8)).map((q) => q.id);
    startQueue(state, "drill", ids, `Drill started: ${arg || "core Unity"}. No model answers until you reply.`);
    return state;
  }
  if (c === "/mock" && arg.startsWith("technical")) {
    startQueue(state, "mock-technical", mockTechnicalIds, "Technical mock. Senior bar. One question at a time.");
    return state;
  }
  if (c === "/mock" && arg.startsWith("leadership")) {
    startQueue(state, "mock-leadership", mockLeadershipIds, "Leadership mock. STAR with I/we split. No invented title.");
    return state;
  }
  if (c === "/mock" && (arg.startsWith("system") || arg.startsWith("system-design"))) {
    startQueue(state, "mock-system-design", ["sd-rooms", "diag-11-network", "diag-09-delivery"], "System design mock. I will add constraints after your first answer.");
    return state;
  }
  if (c === "/mock" && arg.startsWith("english")) {
    startQueue(state, "mock-english", mockEnglishIds, "English mock. I will correct language after each answer. Keep your natural style.");
    return state;
  }
  if (c === "/final-exam") {
    startQueue(state, "final-exam", finalExamIds, "Final exam. I will not coach until the end. Answer as if the panel is in the room.");
    return state;
  }
  if (c === "/review-answer") {
    state.mode = "review";
    state.phase = "question";
    state.currentQuestionId = "diag-06-profiling";
    state.questionQueue = ["diag-06-profiling"];
    state.questionIndex = 0;
    state.messages = [
      ...state.messages,
      msg(
        "trainer",
        "note",
        "Choose the best answer for a measurement-first optimization question. This mode is still multiple choice.",
      ),
    ];
    return state;
  }
  if (c === "/question-bank") {
    state.messages = [...state.messages, msg("trainer", "note", formatBank(arg || "unity"))];
    return state;
  }
  if (c === "/weaknesses") {
    state.messages = [...state.messages, msg("trainer", "note", formatWeaknesses(state))];
    return state;
  }
  if (c === "/cheatsheet") {
    const key = (arg || "profiling").toLowerCase();
    const sheet =
      cheatsheets[key] ||
      Object.entries(cheatsheets).find(([k]) => key.includes(k) || k.includes(key))?.[1] ||
      cheatsheets.profiling;
    const text = [sheet.title, ...sheet.bullets.flatMap((b) => ["", b.h, ...b.lines.map((l) => `• ${l}`)])].join(
      "\n"
    );
    state.messages = [...state.messages, msg("trainer", "teach", text)];
    return state;
  }
  if (c === "/stories") {
    const text = storyTemplates
      .map(
        (s) =>
          `${s.title}\n${s.prompt}\nFields: ${s.fields.join(" · ")}\nCoach: ${s.coaching}`
      )
      .join("\n\n");
    state.mode = "stories";
    state.messages = [
      ...state.messages,
      msg(
        "trainer",
        "teach",
        "Pick how you would frame each story. Use the intro question as a template: honest gap, numbers, I/we split. Commands: stay on /diagnose to train the framing as MCQ.\n\n" + text
      ),
    ];
    state.currentQuestionId = "diag-01-intro";
    state.phase = "question";
    return state;
  }
  if (c === "/skip") {
    if (state.phase === "follow-up" || state.phase === "improved") {
      nextInQueue(state);
    } else {
      state.messages = [...state.messages, msg("trainer", "note", "Nothing to skip. Answer the current question.")];
    }
    return state;
  }
  if (c === "/reveal") {
    const q = currentQuestion(state);
    const last = q ? state.evaluations[q.id]?.at(-1) : undefined;
    if (last) {
      state.phase = "improved";
      state.messages = [...state.messages, msg("trainer", "improved", formatImproved(last))];
    } else {
      state.messages = [
        ...state.messages,
        msg("trainer", "note", "No answer to reveal yet. Attempt the question first."),
      ];
    }
    return state;
  }
  if (c === "/matrix" || c === "/plan") {
    const rows = computeSkillMatrix(state.evaluations);
    const plan = prepPlan(rows);
    const text = [
      "Skill matrix (0–5). Target is Team Lead judgment, not trivia.",
      ...rows.map(
        (r) =>
          `${r.priority}  ${r.label}: ${r.current.toFixed(1)} → ${r.target}  |  ${r.gap}`
      ),
      "",
      "Plan",
      ...plan.weeks.map((w) => `${w.name}: ${w.items.join("; ")}`),
    ].join("\n");
    state.messages = [...state.messages, msg("trainer", "recap", text)];
    return state;
  }
  if (c === "/modules") {
    const text = modules
      .map((m) => `Module ${m.letter}: ${m.title}\n${m.goal}\nTopics: ${m.topics.map((t) => t.title).join("; ")}`)
      .join("\n\n");
    state.messages = [...state.messages, msg("trainer", "teach", text + "\n\nOpen one with /learn A or /learn occupancy.")];
    return state;
  }

  state.messages = [
    ...state.messages,
    msg("trainer", "note", `Unknown command ${cmd}. Type /help for the list.`),
  ];
  return state;
}

export function submitAnswer(state: SessionState, text: string): SessionState {
  const trimmed = text.trim();
  if (!trimmed) return state;
  const next: SessionState = {
    ...state,
    messages: [...state.messages],
    evaluations: { ...state.evaluations },
    progress: state.progress.map((p) => ({ ...p })),
    weaknesses: state.weaknesses.map((w) => ({ ...w })),
  };

  if (trimmed.startsWith("/")) {
    next.messages.push(msg("candidate", "command", trimmed));
    return handleCommand(next, trimmed);
  }

  const question = currentQuestion(next);
  if (!question) {
    next.messages.push(msg("candidate", "answer", trimmed));
    next.messages.push(
      msg("trainer", "note", "No active question. Type /diagnose, /learn profiling, or /mock technical.")
    );
    return next;
  }

  const activeMcq = next.phase === "follow-up" ? question.followUpMcq : question.mcq;
  const picked = activeMcq ? parseChoiceId(trimmed, activeMcq) : undefined;
  const display = picked ? `${picked.id}. ${picked.text}` : trimmed;
  next.messages.push(msg("candidate", "answer", display, { questionId: question.id }));

  if (next.mode === "learn") {
    const evaluation = evaluateAnswer(question, trimmed, "follow-up");
    recordEvaluation(next, question, evaluation);
    next.messages.push(
      msg("trainer", "evaluation", formatEvaluation(evaluation, true), {
        evaluation,
        questionId: question.id,
      })
    );
    next.phase = "improved";
    nextInQueue(next);
    return next;
  }

  if (next.phase === "follow-up") {
    const evaluation = evaluateAnswer(question, trimmed, "follow-up");
    recordEvaluation(next, question, evaluation);
    if (next.examCoaching) {
      next.messages.push(
        msg("trainer", "evaluation", formatEvaluation(evaluation, next.mode === "mock-english" || next.examCoaching), {
          evaluation,
          questionId: question.id,
        })
      );
      next.messages.push(msg("trainer", "improved", formatImproved(evaluation)));
    } else {
      next.messages.push(msg("trainer", "note", "Recorded. Next question. Coaching comes at the end of the exam."));
    }
    next.phase = "improved";
    nextInQueue(next);
    return next;
  }

  const evaluation = evaluateAnswer(question, trimmed, "question");
  recordEvaluation(next, question, evaluation);

  if (!next.examCoaching) {
    next.messages.push(msg("trainer", "note", "Recorded."));
    next.phase = "follow-up";
    next.messages.push(
      msg("trainer", "follow-up", evaluation.followUp, { questionId: question.id, evaluation })
    );
    return next;
  }

  next.messages.push(
    msg("trainer", "evaluation", formatEvaluation(evaluation, true), {
      evaluation,
      questionId: question.id,
    })
  );
  next.messages.push(
    msg(
      "trainer",
      "follow-up",
      `Follow-up pressure question\n\n${evaluation.followUp}\n\nChoose A–D below. The model answer stays hidden until you pick one.`,
      { questionId: question.id, evaluation }
    )
  );
  next.phase = "follow-up";
  return next;
}

export function getMatrix(state: SessionState) {
  return computeSkillMatrix(state.evaluations);
}

export { formatEvaluation, verdictLabel };
