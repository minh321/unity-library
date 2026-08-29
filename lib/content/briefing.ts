export const briefing = {
  title: "What this interview actually evaluates",
  paragraphs: [
    "This is not a Unity gameplay-programmer screen. The panel is hiring a Team Leader for an interactive 3D simulation and online collaboration product on Mobile and PC. They will test whether you can keep a room stable on weak hardware, design maintainable Unity architecture, reason about shared real-time state, and lead delivery with designers, artists, and QA.",
    "They will score you on technical judgment, not keyword fluency. Every item in this lab is multiple choice: pick the answer a Team Lead would give. Trap options invent titles, skip measurement, or hide behind 'we'. The best option is not revealed until you attempt the follow-up.",
    "Your advantage is production mileage: more than 15 shipped games, large migrations, live-title stability, Addressables, Profiler work, and cross-discipline coordination. Your risk is sounding like an implementer, overclaiming the title, or staying vague on networking and system design. This lab will be strict on those points.",
  ],
  axes: [
    { label: "Senior Unity", detail: "Lifecycle, architecture, rendering, memory, assets, UI" },
    { label: "Production", detail: "Profiler evidence, device tiers, incidents, rollback" },
    { label: "Collaboration systems", detail: "Authority, sync, reconnection, occupancy" },
    { label: "Leadership", detail: "Breakdown, review, mentoring, risk, estimation" },
    { label: "Product thinking", detail: "Requirements, cuts, documentation, stakeholders" },
    { label: "English", detail: "The spoken model after each item is what you would say in the real room" },
  ],
};

export const cheatsheets: Record<
  string,
  { title: string; bullets: { h: string; lines: string[] }[] }
> = {
  profiling: {
    title: "Profiling — spoken checklist",
    bullets: [
      {
        h: "Process",
        lines: [
          "Reproduce on a development player build of the target device",
          "Baseline frame time p50/p95, not only average fps",
          "Classify: CPU main, render thread, GPU, memory, IO, network, load",
          "One hypothesis, one change, measure again, check art/QA regressions",
        ],
      },
      {
        h: "Tools",
        lines: [
          "Unity Profiler, Profile Analyzer, Memory Profiler",
          "Frame Debugger / Rendering Debugger",
          "RenderDoc, Android GPU Inspector, Xcode Instruments",
        ],
      },
      {
        h: "Do not confuse",
        lines: [
          "Draw calls ≠ GPU cost",
          "Batching ≠ instancing",
          "Memory usage ≠ leak",
          "Editor ≠ player",
        ],
      },
    ],
  },
  networking: {
    title: "Collaboration rooms — revision sheet",
    bullets: [
      {
        h: "Authority",
        lines: [
          "Server owns shared objects, occupancy, persistent room state, scores",
          "Client owns input; maybe predicted locomotion only",
          "P2P is a poor default for 30 users and mobile hosts",
        ],
      },
      {
        h: "Sync",
        lines: [
          "Snapshots + deltas at a tick; interpolate remotes",
          "Prediction = local guess; reconciliation = correction",
          "Reconnect = full snapshot, then resume deltas",
        ],
      },
      {
        h: "Honest line",
        lines: [
          "I have not shipped this exact 3D collaboration product.",
          "I have shipped clients against SmartFox, REST, and WebSockets.",
          "I would approach it from authority and failure modes first.",
        ],
      },
    ],
  },
  leadership: {
    title: "Title gap — allowed wording",
    bullets: [
      {
        h: "Open",
        lines: [
          "I have not yet held the formal Team Leader title for a full year, but I have already performed several lead-level responsibilities.",
        ],
      },
      {
        h: "Evidence you actually have",
        lines: [
          "Owning migrations and client adaptations",
          "Protecting a revenue-critical live game",
          "Coordinating with design, art, QA",
          "Working in a shared production codebase",
          "Investigating issues where downtime matters",
        ],
      },
      {
        h: "Never",
        lines: [
          "I managed a team of N",
          "As Team Leader I…",
          "Invented metrics",
        ],
      },
    ],
  },
  rendering: {
    title: "Rendering — one-liners",
    bullets: [
      {
        h: "Techniques",
        lines: [
          "Static batching: combine static same-material meshes; memory cost; no motion",
          "GPU instancing: many copies of one mesh/material",
          "SRP Batcher: fewer SetPass calls when shader variants match",
          "Overdraw/fill rate: stacked transparents, VFX, UI",
        ],
      },
    ],
  },
  addressables: {
    title: "Addressables — unload and delivery",
    bullets: [
      {
        h: "Unload",
        lines: [
          "Ref count must hit zero",
          "No leftover handles, static caches, instanced materials, or loaded scenes",
          "Compare Memory Profiler snapshots",
        ],
      },
      {
        h: "Delivery",
        lines: [
          "Remote catalog, per-room groups, platform variants",
          "Resume, retry, disk, offline lobby",
          "Content compatibility window with the client",
        ],
      },
    ],
  },
  lifecycle: {
    title: "Lifecycle — review rejects",
    bullets: [
      {
        h: "Rules",
        lines: [
          "OnEnable/OnDisable pair",
          "No lambdas on static events",
          "Awake is local; Start talks to others",
          "Do not use Script Execution Order as architecture",
        ],
      },
    ],
  },
  english: {
    title: "Spoken answer skeleton",
    bullets: [
      {
        h: "Technical",
        lines: [
          "Clarify context",
          "State the principle",
          "How I measure",
          "The change",
          "Trade-off",
          "How I validate",
          "One true example",
        ],
      },
      {
        h: "Leadership",
        lines: [
          "Situation, Task, Action, Reasoning, Result, Learning",
          "I owned / the team owned",
        ],
      },
    ],
  },
};

export const storyTemplates = [
  {
    id: "stability",
    title: "Production-critical maintenance",
    prompt:
      "The live casino/slot title with very little downtime. Describe a period where stability was at risk. What did you personally do?",
    fields: [
      "Initial condition",
      "Business impact",
      "Your responsibility (not the team's)",
      "Investigation",
      "Decision and trade-offs",
      "Collaboration",
      "Result (honest, no invented %)",
      "Lesson for a simulation product",
    ],
    coaching:
      "Do not say you 'kept it alive' without a concrete action: hotfix path, race-condition fix, client adaptation, or blocking a risky change.",
  },
  {
    id: "bug",
    title: "A difficult technical bug",
    prompt:
      "Pick a race condition, async bug, or Unity lifecycle bug you actually debugged.",
    fields: [
      "Symptom",
      "Why it was hard to reproduce",
      "How you isolated it",
      "The actual cause",
      "The fix",
      "How you prevented recurrence",
    ],
    coaching:
      "Interviewers want the isolation method more than the punchline.",
  },
  {
    id: "perf",
    title: "Performance optimization",
    prompt:
      "A Profiler-backed change: GC, batching, occlusion, loading, or UI. If you lack exact ms numbers, say so.",
    fields: [
      "Device / platform",
      "What you measured first",
      "Bottleneck class",
      "One change",
      "What you did not change",
      "Validation",
    ],
    coaching:
      "If you only remember 'it got smoother', describe the Profiler view you used. Do not invent milliseconds.",
  },
  {
    id: "migration",
    title: "Migration or modernization",
    prompt:
      "Unity upgrades, Haxe→Cocos, or ~30 server-migration client adaptations.",
    fields: [
      "Scale (counts you actually have)",
      "What broke",
      "How you sequenced the work",
      "How you protected live users",
      "What you documented or transferred",
    ],
    coaching:
      "This is lead evidence: sequencing, risk, and knowledge transfer—not just porting scripts.",
  },
  {
    id: "lead",
    title: "Leadership, coordination, or mentoring",
    prompt:
      "A time you influenced other people's work without the Team Leader title.",
    fields: [
      "Situation",
      "What you owned",
      "What others owned",
      "How you communicated",
      "Pushback you handled",
      "Result and learning",
    ],
    coaching:
      "Open with the title-gap sentence only if asked about readiness. In a STAR story, start with the situation.",
  },
];

export const commandHelp = [
  { cmd: "/diagnose", why: "Restart the 15-question diagnostic, one question at a time" },
  { cmd: "/learn [topic]", why: "Lesson, then four real check questions" },
  { cmd: "/drill [topic]", why: "Rapid questions. Answers stay hidden until you reply" },
  { cmd: "/mock technical", why: "Senior Unity technical loop plus one system design" },
  { cmd: "/mock leadership", why: "Behavioral and management scenarios" },
  { cmd: "/mock system-design", why: "One large design problem with added constraints" },
  { cmd: "/mock english", why: "Same questions, stricter language notes" },
  { cmd: "/review-answer", why: "Paste any answer for scoring and a rewrite" },
  { cmd: "/question-bank [topic]", why: "Basic → Team Lead questions and follow-up traps" },
  { cmd: "/weaknesses", why: "Recurring mistakes and the next exercise" },
  { cmd: "/cheatsheet [topic]", why: "Short revision sheet" },
  { cmd: "/stories", why: "Build five truthful STAR stories" },
  { cmd: "/final-exam", why: "Full interview, coaching only at the end" },
  { cmd: "/skip", why: "Skip follow-up and go to the next question" },
  { cmd: "/reveal", why: "Show the improved answer after you have attempted the follow-up" },
];
