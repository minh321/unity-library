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

export const diagnosticQuestionsPart2: Question[] = [
  {
    id: "diag-06-profiling",
    mode: "diagnostic",
    area: "profiling",
    relatedAreas: ["rendering", "memory"],
    title: "Measurement-first optimization",
    difficulty: "team-lead",
    prompt:
      "A mid-range Android device drops to 18–22 fps in a furnished virtual room. How do you optimize it? I will reject 'I would optimize it' without a measurement process.",
    concepts: [
      {
        id: "reproduce",
        label: "Reproduce and baseline",
        synonyms: ["reproduce", "baseline", "target device", "development build"],
        weight: 1.2,
        required: true,
      },
      {
        id: "cpu-gpu",
        label: "CPU-bound vs GPU-bound",
        synonyms: [
          "cpu-bound",
          "gpu-bound",
          "cpu bound",
          "gpu bound",
          "main thread",
          "render thread",
          "gpu time",
        ],
        weight: 1.4,
        required: true,
      },
      {
        id: "tools",
        label: "Named Unity / platform tools",
        synonyms: [
          "profiler",
          "frame debugger",
          "memory profiler",
          "renderdoc",
          "android gpu inspector",
          "xcode",
          "profile analyzer",
          "rendering debugger",
        ],
        weight: 1.2,
        required: true,
      },
      {
        id: "hypothesis",
        label: "Hypothesis and one change",
        synonyms: ["hypothesis", "one change", "controlled", "measure again", "validate"],
        weight: 1.1,
        required: true,
        seniority: "senior",
      },
      {
        id: "consistency",
        label: "Frame time consistency vs average fps",
        synonyms: ["frame time", "spike", "consistency", "not average", "hitch"],
        weight: 0.8,
        required: false,
        seniority: "senior",
      },
      {
        id: "quality-tradeoff",
        label: "Quality levels / content trade-off",
        synonyms: [
          "quality",
          "lod",
          "shadow",
          "overdraw",
          "transparent",
          "artist",
          "qa",
        ],
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
          "What would you measure, which Unity tools would you use, what evidence would confirm the bottleneck, what trade-offs would you consider, and how would you validate the fix on device?",
      },
    ],
    spokenAnswer:
      "I would reproduce on a development build of the same mid-range device and capture a baseline frame time, not only average fps. In the Profiler I would check whether the main thread, render thread, or GPU is the limiter. If CPU, I would look at scripts, physics, UI rebuilds, animation, and GC. If GPU, Frame Debugger and overdraw, setpass, lights, and transparent particles. I would form one hypothesis, change one thing, measure again, then confirm on the device and with art/QA that the room still looks acceptable.",
    deepAnswer:
      "Process: reproduce, baseline, capture, classify (CPU/GPU/memory/IO/network/load), locate system, hypothesis, one change, remeasure, device validate, check regressions. Distinctions: draw-call count is not GPU cost; batching is not instancing; memory usage is not a leak; editor is not the player. Thermal throttling can appear after minutes. Team Lead also decides whether this is a code bug, a content budget, or a quality-tier problem, and who owns the change—engineering or art.",
    keyPhrases: [
      "First I confirm CPU-bound versus GPU-bound on a development player build.",
      "Average fps hides spikes.",
      "One controlled change, then measure again.",
    ],
    englishTips: [
      "Use the 10-step process as a spoken checklist, not a lecture.",
    ],
  },
  {
    id: "diag-07-rendering",
    mode: "diagnostic",
    area: "rendering",
    relatedAreas: ["profiling"],
    title: "Batching, instancing, overdraw",
    difficulty: "senior",
    prompt:
      "Static batching versus dynamic batching versus GPU instancing versus the SRP Batcher: what problem does each solve, when does it fail, and how do overdraw and fill rate show up in a dense interior room?",
    concepts: [
      {
        id: "static-batch",
        label: "Static batching",
        synonyms: ["static batch", "combine", "static flag", "lightmap"],
        weight: 1,
        required: true,
      },
      {
        id: "dynamic-batch",
        label: "Dynamic batching limits",
        synonyms: ["dynamic batch", "vertex limit", "not reliable"],
        weight: 0.8,
        required: false,
      },
      {
        id: "instancing",
        label: "GPU instancing",
        synonyms: ["instancing", "instance", "same mesh", "same material"],
        weight: 1.1,
        required: true,
      },
      {
        id: "srp",
        label: "SRP Batcher",
        synonyms: ["srp batcher", "shader", "constant buffer", "material property"],
        weight: 1.2,
        required: true,
        seniority: "senior",
      },
      {
        id: "fail-conditions",
        label: "When batching fails",
        synonyms: [
          "different material",
          "motion",
          "scale",
          "transparent",
          "too many variants",
          "gpu instancing off",
        ],
        weight: 1.2,
        required: true,
      },
      {
        id: "overdraw",
        label: "Overdraw / fill rate / transparency",
        synonyms: ["overdraw", "fill rate", "transparent", "alpha", "particles", "ui"],
        weight: 1.3,
        required: true,
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        ifMissing: ["srp"],
        question:
          "If SetPass calls are high but triangles are low, is the SRP Batcher failing, and how would you confirm it?",
      },
      {
        ifMissing: ["overdraw"],
        question:
          "The room uses many glass panels and particle dust. Why can the GPU be busy even with a modest draw-call count?",
      },
    ],
    spokenAnswer:
      "Static batching combines static meshes that share materials; it costs memory and breaks if objects move. Dynamic batching is a limited CPU path and is rarely the strategy I would pick for a 3D room. GPU instancing is for many copies of the same mesh and material. The SRP Batcher reduces SetPass cost when shaders are compatible, even if materials differ slightly. Batching fails on unique materials, some scales, and transparency. Overdraw in interiors is often the real GPU cost: stacked transparents, VFX, and UI fill rate, which draw-call counts will not show.",
    deepAnswer:
      "SRP Batcher: same shader variant can share a bind; material property blocks can still break it. GPU instancing needs enable instancing and compatible shaders. Occlusion culling helps hidden interiors but not if portals are transparent or content streams in dynamically without occluder baking. LODs reduce vertex and often draw cost. Shader variants explode build size and hitch on first use. Team implication: art must share materials and atlases; engineering must set quality tiers for lights and shadows.",
    keyPhrases: [
      "Draw calls are not the same as GPU cost.",
      "SRP Batcher cares about shader compatibility, not identical materials.",
      "Transparent interiors are a fill-rate problem.",
    ],
    englishTips: [
      "Define each technique in one sentence, then say when it fails.",
    ],
  },
  {
    id: "diag-08-memory-assets",
    mode: "diagnostic",
    area: "memory",
    relatedAreas: ["assets"],
    title: "Memory growth and Addressables unloading",
    difficulty: "senior",
    prompt:
      "Users visit several virtual rooms and memory keeps rising. How do you investigate memory growth versus a leak, and when can an Addressable asset actually be unloaded?",
    concepts: [
      {
        id: "growth-vs-leak",
        label: "Growth vs leak distinction",
        synonyms: ["leak", "growth", "still referenced", "not released", "cache"],
        weight: 1.3,
        required: true,
      },
      {
        id: "memory-profiler",
        label: "Memory Profiler / managed vs native",
        synonyms: [
          "memory profiler",
          "managed",
          "native",
          "texture",
          "mesh",
          "heap",
        ],
        weight: 1.2,
        required: true,
      },
      {
        id: "refcount",
        label: "Addressables ref counting",
        synonyms: [
          "reference count",
          "release",
          "handle",
          "loadassetasync",
          "unload",
        ],
        weight: 1.3,
        required: true,
      },
      {
        id: "unity-refs",
        label: "Hidden Unity references",
        synonyms: [
          "static",
          "event",
          "dont destroy",
          "material instance",
          "sprite",
          "scene",
        ],
        weight: 1,
        required: false,
        seniority: "senior",
      },
      {
        id: "when-unload",
        label: "Unload conditions",
        synonyms: [
          "count reaches zero",
          "bundle unload",
          "resources.unloadunused",
          "not immediately",
        ],
        weight: 1.1,
        required: true,
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        always: true,
        question:
          "You called Addressables.Release, but the Memory Profiler still shows the room textures. What are the first three causes you would check?",
      },
    ],
    spokenAnswer:
      "I would capture Memory Profiler snapshots after room A, after room B, and after returning to the lobby. Growth that drops after a full unload is caching; growth that never drops is a leak or a remaining reference. Addressables unload when the ref count hits zero and the bundle can be released—if anything still holds a handle, a scene object, a static cache, or an instanced material, the native texture stays. I would also check duplicate assets in bundles and Web/mobile texture memory.",
    deepAnswer:
      "Managed leaks: static events, closures, lists that only grow. Native leaks: textures, meshes, RenderTextures, audio. Addressables: LoadAssetAsync/InstantiateAsync must be paired; Addressables.ReleaseInstance vs Release; scenes loaded additively; catalog hot update. UnloadUnusedAssets is slow and not a design. Duplicate assets happen when one mesh is pulled into two groups. Team process: a content budget per room and a soak test that visits rooms for 30 minutes.",
    keyPhrases: [
      "Release is not the same as 'the GPU memory is gone'.",
      "I compare snapshots, I do not guess.",
      "Ref count zero is necessary, not always sufficient if something else cloned the asset.",
    ],
    englishTips: [
      "Say 'snapshot A versus snapshot B'—it sounds senior and is accurate.",
    ],
  },
  {
    id: "diag-09-delivery",
    mode: "diagnostic",
    area: "assets",
    relatedAreas: ["cross-platform", "networking"],
    title: "Remote room content delivery",
    difficulty: "team-lead",
    prompt:
      "The application contains many user-selectable virtual environments. Some rooms are hundreds of megabytes. Design the loading and delivery strategy for Mobile and PC.",
    concepts: [
      {
        id: "not-resources",
        label: "Why not Resources for this",
        synonyms: ["resources folder", "not resources", "addressable", "assetbundle"],
        weight: 1,
        required: true,
      },
      {
        id: "remote",
        label: "Remote catalog / on-demand",
        synonyms: ["remote", "catalog", "on-demand", "download", "cdn"],
        weight: 1.2,
        required: true,
      },
      {
        id: "split-budget",
        label: "Mobile vs PC size strategy",
        synonyms: ["mobile", "pc", "quality", "variant", "lod", "texture size"],
        weight: 1.2,
        required: true,
        seniority: "lead",
      },
      {
        id: "failure",
        label: "Failed download / retry / offline",
        synonyms: ["retry", "offline", "fail", "resume", "checksum", "disk"],
        weight: 1.2,
        required: true,
        seniority: "senior",
      },
      {
        id: "versioning",
        label: "Content vs app version",
        synonyms: ["version", "compatible", "catalog", "mismatch"],
        weight: 1.1,
        required: true,
      },
      {
        id: "ux",
        label: "Loading UX / streaming",
        synonyms: ["loading", "progress", "shell", "lobby", "stream", "placeholder"],
        weight: 0.9,
        required: false,
        seniority: "lead",
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        ifMissing: ["failure"],
        question:
          "The user is on a train, the download dies at 80%, and they reopen the app. What should happen?",
      },
      {
        ifMissing: ["versioning"],
        question:
          "A new client requires a content schema the old bundles do not have. How do you prevent a crash?",
      },
    ],
    spokenAnswer:
      "I would not put hundred-megabyte rooms in Resources. Addressables with a remote catalog, per-room groups, and platform variants: smaller textures and LODs for mobile, richer packs for PC. The app ships a lobby plus a minimum set; rooms download on demand with resume, disk checks, and a clear retry UX. Content versions are pinned to a client compatibility range so an old app cannot load a new schema. If a download fails, the user stays in the lobby with the last good room if one exists.",
    deepAnswer:
      "Group by room and by shared core (avatars, UI). Deduplicate via common bundles. Validate on CI: max size, missing refs, shader variants. Cache eviction policy on mobile. Encryption/signing if rooms are user-generated. For UGC, treat untrusted content as data with a sandbox, not as executable code. Preload next likely room on PC, not on cellular. Analytics on download success, time-to-enter, and failure codes.",
    keyPhrases: [
      "Rooms are remote content packs with a compatibility window.",
      "Mobile gets a variant, not a downscaled accident.",
      "Failed downloads must leave the app usable.",
    ],
    englishTips: [
      "Cover delivery, device variants, failure, and versioning. That is the Lead answer.",
    ],
  },
  {
    id: "diag-10-animation",
    mode: "diagnostic",
    area: "animation",
    relatedAreas: ["physics", "networking"],
    title: "Animation cost and shared interaction",
    difficulty: "senior",
    prompt:
      "How would you keep avatar animation affordable for 30 users in one room, and how would you create stable shared-object interactions (a training machine two people might use) without fighting the Animator and physics?",
    concepts: [
      {
        id: "animator-cost",
        label: "Animator cost / culling / lod",
        synonyms: [
          "animator",
          "culling",
          "lod",
          "update mode",
          "always animate",
          "animators",
        ],
        weight: 1.2,
        required: true,
      },
      {
        id: "network-anim",
        label: "Do not replicate full animator state blindly",
        synonyms: ["parameter", "state hash", "not every bone", "compressed", "tick"],
        weight: 1.1,
        required: true,
        seniority: "senior",
      },
      {
        id: "authority",
        label: "Object authority / occupancy",
        synonyms: ["authority", "owner", "occupancy", "lock", "server"],
        weight: 1.3,
        required: true,
      },
      {
        id: "physics-net",
        label: "Networked physics caution",
        synonyms: [
          "kinematic",
          "not full rigidbody",
          "interpolate",
          "server physic",
          "prediction",
        ],
        weight: 1,
        required: false,
        seniority: "senior",
      },
      {
        id: "honest-gap",
        label: "Honest about production multiplayer gap",
        synonyms: [
          "have not used that in production",
          "not in production",
          "i have not shipped",
          "would approach",
          "smartfox",
          "websocket",
        ],
        weight: 1,
        required: false,
        seniority: "lead",
      },
    ],
    antiPatterns: overclaim,
    followUps: [
      {
        always: true,
        question:
          "Have you shipped this kind of networked interaction in production? If not, how would you approach it, and what would you refuse to guess?",
      },
    ],
    spokenAnswer:
      "For 30 avatars I would not give every distant user a full Always Animate Animator with IK. I would LOD animation, cull when off-camera, and replicate a small state—locomotion params, gesture ids—not every bone. For a shared machine I would use server-side occupancy: one owner, others see the animated result. I have not shipped a 30-user 3D collaboration room in production. I have shipped client work against SmartFox, REST, and WebSockets, and I would design this with explicit authority rather than hoping Rigidbodies replicate cleanly.",
    deepAnswer:
      "Animator is CPU-heavy with many layers and IK. Playables can be cheaper for simple states. Root motion on networked avatars is usually a mistake. Shared objects: request lock, grant, animate locally, server confirms; on rejection, play a fail pose. Do not parent-network-physics a tool to two avatars. Interpolation is for remote poses; prediction is for local controls; reconciliation fixes misprediction. Honest phrase is mandatory here.",
    keyPhrases: [
      "I have not used that in production, but this is how I would approach it.",
      "Occupancy is a lock, not a parenting trick.",
      "Replicate intent and state, not the full animation graph.",
    ],
    englishTips: [
      "The honest-gap sentence should come early, not as an apology at the end.",
    ],
  }
];
