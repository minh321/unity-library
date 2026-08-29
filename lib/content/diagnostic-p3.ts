import type { Question } from "@/lib/trainer/types";

const overclaim: Question["antiPatterns"] = [
  {
    id: "fake-title",
    label: "Inventing a Team Leader title",
    patterns: [
      "i have been a team leader",
      "i was the team leader",
      "as a team leader i",
      "i led a team of",
      "i managed a team of",
      "my year as team lead",
    ],
    penalty: 1.5,
    note: "Do not claim a formal Team Leader title you did not hold. Frame informal leadership instead.",
    kind: "overclaim",
  },
  {
    id: "we-only",
    label: "Hiding personal contribution behind we",
    patterns: [],
    penalty: 0.4,
    note: "Clarify what you owned versus what the team owned.",
    kind: "leadership",
  },
  {
    id: "vague-optimize",
    label: "Vague optimization claim",
    patterns: [
      "i would optimize it",
      "just optimize",
      "we should optimize",
      "make it faster",
      "improve performance",
    ],
    penalty: 0.8,
    note: "Name measurements, tools, evidence, trade-offs, and validation.",
    kind: "technical",
  },
  {
    id: "keyword-dump",
    label: "Keyword dumping without explanation",
    patterns: [],
    penalty: 0.3,
    note: "Naming a system is not the same as explaining it.",
    kind: "communication",
  },
  {
    id: "memorized",
    label: "Sounds memorized",
    patterns: [
      "in today's fast-paced",
      "leverage synergies",
      "passionate about excellence",
      "i am a results-driven",
    ],
    penalty: 0.6,
    note: "Keep your natural speaking style. Interviewers hear scripted language immediately.",
    kind: "communication",
  },
];

export const diagnosticQuestionsPart3: Question[] = [
  {
    id: "diag-11-network",
    mode: "diagnostic",
    area: "networking",
    relatedAreas: ["unity-architecture"],
    title: "30-user virtual training room",
    difficulty: "team-lead",
    prompt:
      "Design a virtual training room for 30 users where they can move avatars and interact with shared equipment. Cover authority, synchronization, reconnection, and what you would not make client-authoritative.",
    concepts: [
      {
        id: "server-auth",
        label: "Server authority for shared state",
        synonyms: ["server author", "dedicated", "not peer to peer", "not p2p"],
        weight: 1.3,
        required: true,
      },
      {
        id: "what-sync",
        label: "What to sync and how often",
        synonyms: [
          "tick",
          "snapshot",
          "delta",
          "interest",
          "not every transform",
          "bandwidth",
        ],
        weight: 1.2,
        required: true,
      },
      {
        id: "interp",
        label: "Interpolation vs prediction",
        synonyms: ["interpolat", "predict", "reconcil", "latency", "jitter"],
        weight: 1.1,
        required: true,
      },
      {
        id: "reconnect",
        label: "Reconnection / session recovery",
        synonyms: ["reconnect", "session", "snapshot", "rejoin", "state"],
        weight: 1.2,
        required: true,
      },
      {
        id: "interest",
        label: "Interest management / lod net",
        synonyms: ["interest", "area of interest", "relevance", "quantize"],
        weight: 0.8,
        required: false,
        seniority: "senior",
      },
      {
        id: "assumptions",
        label: "Assumptions / NFRs",
        synonyms: ["assume", "latency", "region", "cheat", "voice", "30"],
        weight: 0.9,
        required: false,
        seniority: "lead",
      },
    ],
    antiPatterns: [
      ...overclaim,
      {
        id: "fake-mp",
        label: "Implying production 3D MMO experience",
        patterns: [
          "when i built our mmo",
          "in my shipped multiplayer 3d",
          "our 30 user unity room in production",
        ],
        penalty: 1.5,
        note: "You may use SmartFox/WebSocket experience. Do not invent a 3D collaboration title.",
        kind: "overclaim",
      },
    ],
    followUps: [
      {
        always: true,
        question:
          "A user with 250 ms RTT and 5% packet loss grabs a shared tablet. Walk through what each client sees for the next two seconds.",
      },
    ],
    spokenAnswer:
      "I would use a dedicated server as authority for positions of shared equipment, occupancy, scores, and room persistence. Clients own only their input. Avatars send input or compressed poses at a fixed tick; others interpolate. I would not make grab/use client-authoritative. On join or reconnect the server sends a room snapshot, then deltas. I have not shipped this exact product; I would start from client-server lessons in SmartFox and treat Unity Netcode or a custom relay as an implementation choice after the authority model is clear.",
    deepAnswer:
      "Functional: move, emote, use equipment, voice/text, persist room. Non-functional: 30 users, mobile+PC, mid-range devices, recoverable disconnects. Architecture: lockstep is a poor fit; snapshot + interpolation is the default. Shared objects: server lock with timeout. Voice is a separate service. Cheating: if this is training/productivity, still validate occupancy and inventory. Version mismatch: refuse join. Observability: tick time, snapshot size, reconnect rate. Testing: latency sim, packet loss, two-client grab race.",
    keyPhrases: [
      "Server authority for anything two users can fight over.",
      "Interpolation hides delay; prediction is only for local movement.",
      "Reconnection is a snapshot, not a lucky TCP resume.",
    ],
    englishTips: [
      "State assumptions first: 30 users, dedicated server, mobile+PC. Interviewers like that.",
    ],
  },
  {
    id: "diag-12-platforms",
    mode: "diagnostic",
    area: "cross-platform",
    relatedAreas: ["rendering", "ui"],
    title: "Mobile and PC quality strategy",
    difficulty: "senior",
    prompt:
      "How would you choose device quality settings for the same virtual room on a low-end Android phone and a high-end PC, and what platform differences actually change engineering—not just graphics sliders?",
    concepts: [
      {
        id: "detect",
        label: "Capability detection",
        synonyms: ["memory", "gpu", "tier", "benchmark", "device", "quality level"],
        weight: 1.1,
        required: true,
      },
      {
        id: "budgets",
        label: "Budgets per platform",
        synonyms: ["texture", "shadow", "lod", "draw call", "resolution", "target fps"],
        weight: 1.2,
        required: true,
      },
      {
        id: "lifecycle",
        label: "App pause / thermal / battery",
        synonyms: ["pause", "suspend", "thermal", "battery", "onapplicationpause", "focus"],
        weight: 1.1,
        required: true,
        seniority: "senior",
      },
      {
        id: "input-ui",
        label: "Input and UI differences",
        synonyms: ["touch", "keyboard", "safe area", "dpi", "cursor", "ui scale"],
        weight: 1,
        required: true,
      },
      {
        id: "graphics-api",
        label: "Graphics API / build differences",
        synonyms: ["vulkan", "metal", "dx11", "il2cpp", "strip", "player setting"],
        weight: 0.7,
        required: false,
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        ifMissing: ["lifecycle"],
        question:
          "A user receives a phone call in a collaborative room. What must the client do so they can rejoin without corrupting shared object state?",
      },
    ],
    spokenAnswer:
      "I would define quality tiers with budgets: resolution scale, shadow cascades, LOD bias, real-time lights, and post-process. Detection should use RAM, GPU family, and a short runtime benchmark, not only a marketing device name. Engineering differences go beyond sliders: touch versus cursor UI, safe areas, application pause on mobile, thermal throttling, permission dialogs, and IL2CPP/stripping. The shared room state must survive a mobile suspend without the user keeping object locks forever.",
    deepAnswer:
      "Ship a default tier, allow override, and telemetry the actual frame time so you can retune. Platform abstraction for file paths, input, and notifications. Conditional compilation only at the edges. Crash symbols per store build. Testing matrix: two Android tiers, one iOS if required, one Windows. Team Lead owns the matrix with QA, not a spreadsheet nobody runs.",
    keyPhrases: [
      "Quality tiers are budgets with owners, not a dropdown nobody measures.",
      "Mobile suspend is a networking event.",
      "Input and safe areas are architecture, not polish.",
    ],
    englishTips: [
      "Separate 'graphics quality' from 'platform lifecycle'. Both are required.",
    ],
  },
  {
    id: "diag-13-leadership",
    mode: "diagnostic",
    area: "mentoring",
    relatedAreas: ["conflict", "leadership"],
    title: "Junior deadlines and unmaintainable code",
    difficulty: "team-lead",
    prompt:
      "A junior repeatedly misses deadlines. Separately, a developer ships working but unmaintainable code two days before release. As Team Leader, what do you do in each case? Use real behavior from your past if you have it, and do not invent a management title.",
    concepts: [
      {
        id: "diagnose-first",
        label: "Diagnose cause before blame",
        synonyms: ["ask", "scope", "blocked", "unclear", "skill", "estimate", "personal"],
        weight: 1.2,
        required: true,
      },
      {
        id: "protect-release",
        label: "Protect the release",
        synonyms: ["release", "risk", "revert", "feature flag", "qa", "hotfix"],
        weight: 1.2,
        required: true,
        seniority: "lead",
      },
      {
        id: "mentor-plan",
        label: "Concrete mentoring plan",
        synonyms: ["pair", "review", "smaller task", "checklist", "example", "follow-up"],
        weight: 1.2,
        required: true,
      },
      {
        id: "respect",
        label: "Respectful communication",
        synonyms: ["private", "respect", "not blame", "public shaming", "1:1", "one on one"],
        weight: 0.9,
        required: false,
      },
      {
        id: "honest-scope",
        label: "Honest about informal lead role",
        synonyms: [
          "not the manager",
          "no formal",
          "i would",
          "when i coordinated",
          "i have not been",
        ],
        weight: 0.8,
        required: false,
        seniority: "lead",
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        always: true,
        question:
          "The unmaintainable code is in a shared module used by the revenue-critical path. Do you ship, revert, or isolate—and how do you tell Product?",
      },
    ],
    spokenAnswer:
      "I would not start with blame. For missed deadlines I would check whether the work was oversized, blocked, or a skill gap, then cut scope and pair on the next slice. For unmaintainable code before release I would protect the product first: can it be feature-flagged, reverted, or wrapped? I would talk to the developer privately with specific examples, not adjectives. I have not been a formal Team Leader, but I have had to protect live casino clients when a change was too risky, and I would escalate early rather than hope QA catches it.",
    deepAnswer:
      "STAR with Reasoning and Learning. Gather information, protect quality, communicate respectfully, take ownership of the plan, use evidence, escalate when the release is at risk, avoid blaming in group chat, and invest in the person's growth. Unmaintainable-but-working code is a Team Lead problem because the next incident will cost more than the feature. Product conversation: options with risk, not a flat no.",
    keyPhrases: [
      "Protect the release first, then coach the person.",
      "Missed deadlines are a signal: scope, skill, or system.",
      "I would tell Product the options and the risk, not just 'no'.",
    ],
    englishTips: [
      "Use Situation, Task, Action, Result—but name what you personally did.",
    ],
  },
  {
    id: "diag-14-requirements",
    mode: "diagnostic",
    area: "requirements",
    relatedAreas: ["estimation", "documentation"],
    title: "From vague request to a plan",
    difficulty: "team-lead",
    prompt:
      "Product says: 'Users should be able to create virtual rooms and invite colleagues.' How do you turn that into implementable work? What do you ask, what do you assume, and how do you estimate?",
    concepts: [
      {
        id: "questions",
        label: "Clarifying questions",
        synonyms: [
          "who",
          "acceptance",
          "platform",
          "persist",
          "offline",
          "scale",
          "out of scope",
        ],
        weight: 1.3,
        required: true,
      },
      {
        id: "nfr",
        label: "Non-functional / device / online",
        synonyms: ["mobile", "latency", "30", "security", "ugc", "moderation"],
        weight: 1,
        required: true,
      },
      {
        id: "breakdown",
        label: "Task breakdown",
        synonyms: ["break", "task", "mvp", "slice", "client", "server", "ui"],
        weight: 1.2,
        required: true,
      },
      {
        id: "estimate",
        label: "Estimation with uncertainty",
        synonyms: ["uncertain", "risk", "range", "spike", "buffer", "depend"],
        weight: 1.1,
        required: true,
        seniority: "lead",
      },
      {
        id: "docs",
        label: "Design / docs / test / rollout",
        synonyms: ["document", "test", "rollout", "feature flag", "analytics", "edge"],
        weight: 1,
        required: true,
        seniority: "lead",
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        always: true,
        question:
          "Product wants it in two weeks. You believe a safe MVP is six. What do you propose as a cut line?",
      },
    ],
    spokenAnswer:
      "I would ask who the user is, whether rooms persist, whether guests are in-app or links, which platforms, max occupants, and what happens offline. I would write assumptions, an MVP—create a room from a template, invite, join, persist layout—and a non-MVP: custom modeling, moderation tools. I would break work into client UI, room data, permissions, networking, content, QA, and analytics. Estimates would be ranges with risks: networking and UGC are the uncertain parts, so I would spike those first. If Product wants two weeks, I would offer a cut MVP rather than a silent death march.",
    deepAnswer:
      "Required questions: user, problem, flow, acceptance, platforms, devices, scale, persistence, online, state owner, failure, analytics, out of scope. Outputs: assumptions, architecture, responsibilities, data flow, API contracts, risks, edge cases, tasks, estimates, test strategy, rollout, monitoring. Estimation: split known UI from unknown sync; do not average a 2-day and a 3-week risk into a fake 1-week number.",
    keyPhrases: [
      "I will not estimate a slogan. I will estimate an MVP with explicit cuts.",
      "Uncertainty goes into a spike, not into a hidden buffer nobody sees.",
      "Out of scope is part of the design.",
    ],
    englishTips: [
      "Ask questions out loud. It shows Lead behavior even before the plan.",
    ],
  },
  {
    id: "diag-15-incident",
    mode: "diagnostic",
    area: "debugging",
    relatedAreas: ["leadership", "testing", "cross-platform"],
    title: "Unreproducible Android crash",
    difficulty: "team-lead",
    prompt:
      "A new release crashes on several mid-range Android devices, but QA cannot reproduce it locally. As Team Leader, what do you do?",
    concepts: [
      {
        id: "severity",
        label: "Triage severity and blast radius",
        synonyms: ["crash rate", "who", "device", "rollback", "store", "percentage"],
        weight: 1.2,
        required: true,
      },
      {
        id: "signals",
        label: "Crash reporting / symbols / logs",
        synonyms: [
          "crashlytics",
          "stacktrace",
          "symbol",
          "logcat",
          "analytics",
          "breadcrumb",
        ],
        weight: 1.3,
        required: true,
      },
      {
        id: "rollback",
        label: "Rollback / hotfix / staged rollout",
        synonyms: ["rollback", "hotfix", "staged", "halt rollout", "previous build"],
        weight: 1.2,
        required: true,
        seniority: "lead",
      },
      {
        id: "repro-strategy",
        label: "How to get a repro",
        synonyms: [
          "same so",
          "low memory",
          "language",
          "mali",
          "adreno",
          "il2cpp",
          "stripped",
        ],
        weight: 1.1,
        required: true,
      },
      {
        id: "comms",
        label: "Stakeholder communication",
        synonyms: ["product", "qa", "status", "customer", "time", "owner"],
        weight: 1,
        required: true,
        seniority: "lead",
      },
      {
        id: "postmortem",
        label: "Incident review",
        synonyms: ["postmortem", "review", "prevent", "test gap", "device matrix"],
        weight: 0.9,
        required: false,
        seniority: "lead",
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        always: true,
        question:
          "Crash reports point at a native graphics plugin, but only after 10 minutes in a specific room. How do you divide work between you, a junior, art, and QA?",
      },
    ],
    spokenAnswer:
      "I would halt a staged rollout if it is still rolling out, pull crash rate, devices, OS versions, and symbolicated stacks, and decide rollback versus hotfix using blast radius. QA cannot reproduce yet, so I would match GPU family, memory pressure, language, and the specific room content. I would assign an owner, give Product a time-boxed status, and only then dig. After the fix I would add a device-matrix gap and a soak test so this class of crash is not a hero story next time.",
    deepAnswer:
      "Order: stop the bleeding, gather evidence, communicate, reproduce, fix, verify, release, review. Do not debug in Slack without an owner. Native plugins need symbols. Room-specific crashes often mean content + driver, not the C# line in the stack. Team Lead delegates: one person on crash dashboard, one on content isolation, QA on a loaner device, you on the go/no-go. Honest: if you have not used Crashlytics, say so and name the equivalent process.",
    keyPhrases: [
      "Stop the rollout before we debate the stacktrace.",
      "No repro yet is not 'no data'—we have devices, rates, and stacks.",
      "The incident is not over until the test matrix changes.",
    ],
    englishTips: [
      "Lead with the decision (halt/rollback), then investigation. Managers listen for the first sentence.",
    ],
  }
];
