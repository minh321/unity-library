import type { Question } from "@/lib/trainer/types";
import { diagnosticQuestions } from "@/lib/content/diagnostic";
import { hydrateQuestion } from "@/lib/content/mcq";

const baseAnti = diagnosticQuestions[0].antiPatterns;

function q(
  partial: Omit<Question, "antiPatterns" | "englishTips" | "followUps"> & {
    followUps?: Question["followUps"];
    englishTips?: string[];
  }
): Question {
  return {
    antiPatterns: baseAnti,
    englishTips: partial.englishTips ?? [
      "Answer in 60–90 seconds. Mechanism, then trade-off, then validation.",
    ],
    followUps: partial.followUps ?? [
      {
        always: true,
        question: "What fails in production if this is wrong?",
      },
    ],
    ...partial,
  };
}

export const bank: Record<string, Question[]> = {
  csharp: [
    q({
      id: "cs-boxing",
      mode: "drill",
      area: "csharp-fundamentals",
      title: "Boxing",
      difficulty: "intermediate",
      prompt: "What is boxing in C#, and when does it appear in Unity hot paths?",
      concepts: [
        { id: "box", label: "Boxing definition", synonyms: ["heap", "value type", "object", "interface"], weight: 1, required: true },
        { id: "hot", label: "Hot path examples", synonyms: ["update", "dictionary", "enum", "linq"], weight: 1, required: true },
      ],
      spokenAnswer:
        "Boxing allocates a heap wrapper for a value type, often when it is stored as object or passed through a non-generic interface. In Unity that shows up in non-generic collections, enum keys, and some LINQ paths. I would confirm with GC Alloc before rewriting.",
      deepAnswer:
        "Prove with Allocation Callstacks. Prefer generic collections, avoid object-typed events in Update, cache delegates.",
      keyPhrases: ["Boxing is an allocation", "Prove it in the Profiler"],
    }),
    q({
      id: "cs-idisposable",
      mode: "drill",
      area: "advanced-csharp",
      title: "IDisposable",
      difficulty: "senior",
      prompt: "What should implement IDisposable in a Unity project, and what should not?",
      concepts: [
        { id: "native", label: "Unmanaged / subscriptions", synonyms: ["unmanaged", "event", "cts", "rendertexture", "unsubscribe"], weight: 1, required: true },
      ],
      spokenAnswer:
        "IDisposable is for deterministic cleanup: CancellationTokenSource, file handles, RenderTextures you own, and unsubscribe patterns that are not tied to a MonoBehaviour lifetime. MonoBehaviours already have OnDestroy; wrapping every component in IDisposable usually adds noise.",
      deepAnswer: "Do not Dispose UnityEngine.Object you do not own. Watch double-dispose on scene unload.",
      keyPhrases: ["Dispose what you own", "OnDestroy is the Unity lifetime hook"],
    }),
  ],
  rendering: [
    q({
      id: "rd-occlusion",
      mode: "drill",
      area: "rendering",
      title: "Occlusion culling",
      difficulty: "senior",
      prompt: "How does occlusion culling work, and can it help when objects load dynamically?",
      concepts: [
        { id: "bake", label: "Baked occluders", synonyms: ["bake", "occluder", "umbra", "static"], weight: 1, required: true },
        { id: "dynamic", label: "Dynamic load limits", synonyms: ["dynamic", "loaded", "not baked", "runtime"], weight: 1, required: true },
      ],
      spokenAnswer:
        "Unity's baked occlusion uses occluder geometry to skip hidden renderers from a set of camera cells. Dynamically loaded furniture is not in that bake unless you reserve occluder proxies or use a different runtime culling strategy. It will not save fill rate on visible transparents.",
      deepAnswer: "Portal-heavy offices may need baked occluders in the shell and cheaper LODs for streamed props.",
      keyPhrases: ["Bake is for the shell", "Streamed props need another strategy"],
    }),
    q({
      id: "rd-overdraw",
      mode: "drill",
      area: "rendering",
      title: "Overdraw",
      difficulty: "basic",
      prompt: "What is overdraw, and why are transparent objects expensive in an interior room?",
      concepts: [
        { id: "od", label: "Overdraw definition", synonyms: ["pixel", "fill", "transparent", "blend"], weight: 1, required: true },
      ],
      spokenAnswer:
        "Overdraw is writing the same pixel more than once in a frame. Transparent glass, particles, and UI do not occlude, so the GPU shades stacked layers. Draw-call count can look fine while fill rate is the limiter.",
      deepAnswer: "Use the overdraw view, reduce overlapping transparents, cut particle screenspace, split UI canvases.",
      keyPhrases: ["Overdraw is extra pixel shading", "Transparency skips occlusion"],
    }),
  ],
  profiling: [
    q({
      id: "pf-cpu-gpu",
      mode: "drill",
      area: "profiling",
      title: "CPU vs GPU bound",
      difficulty: "intermediate",
      prompt: "How do you know whether a Unity application is CPU-bound or GPU-bound?",
      concepts: [
        { id: "tools", label: "Profiler timings", synonyms: ["profiler", "cpu", "gpu", "main thread", "render thread"], weight: 1, required: true },
        { id: "device", label: "Player build", synonyms: ["development build", "device", "player"], weight: 1, required: true },
      ],
      spokenAnswer:
        "On a development player build I compare main-thread CPU, render-thread, and GPU time. If CPU waits on GPU, it is GPU-bound. If Update/animation/physics/UI eat the frame and GPU is idle, it is CPU-bound. Editor numbers are not the device.",
      deepAnswer: "Also watch thermal throttling after several minutes. Frame Debugger does not replace GPU timings.",
      keyPhrases: ["Compare CPU and GPU time on device", "Waiting on GPU means GPU-bound"],
    }),
  ],
  assets: [
    q({
      id: "as-resources",
      mode: "drill",
      area: "assets",
      title: "Resources vs Addressables",
      difficulty: "intermediate",
      prompt: "Resources versus AssetBundles versus Addressables — when do you use each?",
      concepts: [
        { id: "res", label: "Resources limits", synonyms: ["resources", "build size", "unload"], weight: 1, required: true },
        { id: "addr", label: "Addressables role", synonyms: ["addressable", "catalog", "remote", "ref count"], weight: 1, required: true },
      ],
      spokenAnswer:
        "Resources is a tiny local set and bakes into the player. AssetBundles are the raw packing format. Addressables add catalogs, remote hosting, and ref-counting. Large selectable rooms belong on Addressables, not in Resources.",
      deepAnswer: "Bundles still matter when you debug duplication. Addressables are the production API.",
      keyPhrases: ["Resources is not a CDN", "Addressables wrap bundles"],
    }),
  ],
  networking: [
    q({
      id: "nt-interp",
      mode: "drill",
      area: "networking",
      title: "Interpolation vs prediction",
      difficulty: "senior",
      prompt: "How do interpolation and prediction differ, and which would you use for a shared tablet?",
      concepts: [
        { id: "interp", label: "Interpolation", synonyms: ["interpolat", "buffer", "remote", "past"], weight: 1, required: true },
        { id: "pred", label: "Prediction", synonyms: ["predict", "local", "reconcil"], weight: 1, required: true },
      ],
      spokenAnswer:
        "Interpolation plays remote snapshots slightly in the past so motion looks smooth. Prediction guesses local movement immediately and corrects with reconciliation. A shared tablet should not be predicted by two clients; the server grants occupancy and others interpolate the result.",
      deepAnswer: "I have not shipped this exact 3D room. I would still refuse client-authoritative grabs.",
      keyPhrases: ["Interpolation is delayed truth", "Prediction is a local guess"],
    }),
  ],
  leadership: [
    q({
      id: "ld-deadline",
      mode: "mock-leadership",
      area: "leadership",
      title: "Impossible deadline",
      difficulty: "team-lead",
      prompt:
        "Product requests an unrealistic deadline while performance is already poor. What do you do?",
      concepts: [
        { id: "options", label: "Options not a flat no", synonyms: ["option", "cut", "mvp", "risk", "measure"], weight: 1, required: true },
        { id: "evidence", label: "Frame time evidence", synonyms: ["profiler", "fps", "device", "frame"], weight: 1, required: true },
      ],
      spokenAnswer:
        "I would put the current frame time and crash risk on the table, then offer cuts: ship the room template without UGC, drop shadow quality on mobile, or slip the date. I would not silently accept a date that burns the team and the product.",
      deepAnswer: "Escalate with options. Protect a performance budget as a requirement, not a nice-to-have.",
      keyPhrases: ["Requirements include frame time", "Cuts, not heroics"],
    }),
    q({
      id: "ld-disagreement",
      mode: "mock-leadership",
      area: "conflict",
      title: "Architecture disagreement",
      difficulty: "team-lead",
      prompt: "A senior developer disagrees with your architecture for occupancy. How do you handle it?",
      concepts: [
        { id: "listen", label: "Steelman their design", synonyms: ["listen", "their", "risk", "spike", "prototype"], weight: 1, required: true },
        { id: "decide", label: "Time-boxed decision", synonyms: ["decide", "owner", "document", "time-box"], weight: 1, required: true },
      ],
      spokenAnswer:
        "I would ask them to walk through failure modes of both designs—reconnect, two-user grab, mobile pause—then time-box a spike if the risk is high. I would document the decision and the review date. Disagreement is useful; an undocumented split in the codebase is not.",
      deepAnswer: "Do not win by title. Win by failure modes and a recorded decision.",
      keyPhrases: ["Failure modes", "One decision, written down"],
    }),
  ],
  system: [
    q({
      id: "sd-rooms",
      mode: "mock-system-design",
      area: "networking",
      relatedAreas: ["assets", "unity-architecture"],
      title: "Virtual room platform",
      difficulty: "team-lead",
      prompt:
        "Design the client and server architecture for user-created virtual rooms with avatars, shared objects, and Mobile+PC clients. Start with assumptions.",
      concepts: [
        { id: "assumptions", label: "Assumptions", synonyms: ["assume", "30", "region", "mobile", "persist"], weight: 1, required: true },
        { id: "auth", label: "Authority", synonyms: ["server", "authority", "occupancy"], weight: 1, required: true },
        { id: "content", label: "Content delivery", synonyms: ["addressable", "catalog", "cdn", "version"], weight: 1, required: true },
        { id: "fail", label: "Failure / reconnect", synonyms: ["reconnect", "retry", "timeout", "snapshot"], weight: 1, required: true },
      ],
      spokenAnswer:
        "Assumptions: 30 users, dedicated server, rooms persist layout, content is remote, mobile can suspend. Clients download a compatible room pack, join a server-authoritative session, interpolate remotes, and lock shared objects on the server. Reconnect loads a snapshot. Voice is separate. Version mismatch refuses join.",
      deepAnswer:
        "Cover data flow, tick, interest, UGC trust, analytics, and a test plan with latency simulation.",
      keyPhrases: ["Assumptions first", "Content version ≠ app version", "Locks are server state"],
    }),
  ],
};

export const mockTechnicalIds = [
  "diag-03-csharp",
  "diag-05-architecture",
  "diag-06-profiling",
  "diag-07-rendering",
  "diag-09-delivery",
  "diag-02-lifecycle",
  "sd-rooms",
];

export const mockLeadershipIds = [
  "diag-01-intro",
  "diag-13-leadership",
  "ld-deadline",
  "ld-disagreement",
  "diag-15-incident",
  "diag-14-requirements",
];

export const mockEnglishIds = [
  "diag-01-intro",
  "diag-06-profiling",
  "diag-11-network",
  "diag-13-leadership",
];

export const finalExamIds = [
  "diag-01-intro",
  "diag-06-profiling",
  "diag-05-architecture",
  "diag-11-network",
  "diag-09-delivery",
  "ld-deadline",
  "diag-15-incident",
];

export const allQuestions: Question[] = [
  ...diagnosticQuestions,
  ...Object.values(bank).flat(),
];

const extraQuestions = new Map<string, Question>();

export function registerQuestion(question: Question) {
  extraQuestions.set(question.id, question);
}

export function questionById(id: string) {
  const raw = allQuestions.find((q) => q.id === id) ?? extraQuestions.get(id);
  return raw ? hydrateQuestion(raw) : undefined;
}

export function drillDeck(topic: string) {
  const t = topic.toLowerCase();
  const fromBank = Object.entries(bank).find(([k]) => t.includes(k) || k.includes(t));
  if (fromBank) return fromBank[1];
  return diagnosticQuestions.filter(
    (q) =>
      q.area.includes(t) ||
      q.title.toLowerCase().includes(t) ||
      q.prompt.toLowerCase().includes(t)
  );
}
