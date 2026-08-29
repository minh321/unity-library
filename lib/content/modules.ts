export interface LearnTopic {
  id: string;
  module: string;
  title: string;
  simple: string;
  production: string;
  unityExample: string;
  mistakes: string[];
  tradeoffs: string[];
  interviewQuestion: string;
  followUps: string[];
  summary: string[];
}

export const modules: {
  id: string;
  letter: string;
  title: string;
  goal: string;
  topics: LearnTopic[];
}[] = [
  {
    id: "a",
    letter: "A",
    title: "C# and software engineering",
    goal: "Explain C# the way a Unity lead does: allocation, lifetime, and API choices.",
    topics: [
      {
        id: "value-ref",
        module: "A",
        title: "Value types, reference types, stack and heap",
        simple:
          "A value type is copied. A reference type is a handle to one object. The stack is for short-lived frames; the heap is for objects the GC manages.",
        production:
          "Structs often live on the stack, but they also live on the heap as fields of classes, in arrays, and when boxed. 'Structs never GC' is false. Boxing wraps a value type in a heap object. Closures capture variables onto a compiler-generated heap class.",
        unityExample:
          "A Vector3 in Update is cheap. Putting that Vector3 into a Dictionary keyed by a struct without GetHashCode, or passing it to an interface LINQ iterator, can box and allocate every frame.",
        mistakes: [
          "Saying structs are always on the stack",
          "Banning all classes 'for performance'",
          "Ignoring boxing from interfaces and enums in dictionaries",
        ],
        tradeoffs: [
          "Large structs are expensive to copy",
          "Mutable structs in arrays are easy to get wrong",
          "readonly struct / in parameters reduce copies but add API noise",
        ],
        interviewQuestion:
          "A teammate says structs never hit the GC. How do you correct them, and how would you prove a boxing problem in Unity?",
        followUps: [
          "Where does an array of structs live?",
          "Why can foreach over a List allocate when used via IEnumerable?",
        ],
        summary: [
          "Copy vs handle",
          "Heap is not 'classes only'",
          "Prove boxing with GC Alloc, do not argue from slogans",
        ],
      },
      {
        id: "async-unity",
        module: "A",
        title: "Async/await, Tasks, coroutines, cancellation",
        simple:
          "Coroutines are Unity's iterator-based timing. async/await is the C# task model. Both can overlap scene lifetime.",
        production:
          "After await, the MonoBehaviour may be destroyed. UniTask/Awaitable and CancellationToken tied to destroy are the professional pattern. Fire-and-forget async void is an incident waiting to happen except for event handlers you fully fence.",
        unityExample:
          "Addressables.LoadAssetAsync awaited in a room that the user leaves: you must cancel, ignore the result, and not touch destroyed objects.",
        mistakes: [
          "async void except events",
          "No cancellation on scene change",
          "Mixing coroutine StartCoroutine loops with untracked tasks",
        ],
        tradeoffs: [
          "Coroutines are easy to see in the Profiler but awkward to compose",
          "Tasks compose well but need a Unity-aware sync context",
        ],
        interviewQuestion:
          "When do you choose a coroutine versus async/await in a production Unity app?",
        followUps: [
          "What happens if you await, then set transform on a destroyed object?",
          "How do you cancel in-flight room downloads?",
        ],
        summary: [
          "Lifetime is the real problem",
          "CancellationToken is part of the API",
          "Never swallow ObjectDisposed / destroyed view updates",
        ],
      },
    ],
  },
  {
    id: "b",
    letter: "B",
    title: "OOP, SOLID, and patterns",
    goal: "Use patterns as responses to variation—not as decoration.",
    topics: [
      {
        id: "solid",
        module: "B",
        title: "SOLID in Unity",
        simple:
          "SOLID is five design pressures: small reasons to change, extension without edit, substitutable types, small interfaces, depend on abstractions.",
        production:
          "In Unity, SRP is violated by god MonoBehaviours. OCP is violated by 40-case switches on interactable type. LSP is violated when Seat.Use() throws because it inherited Door.Use(). ISP is violated by IInteractable with 12 methods. DIP is violated when gameplay new()s concrete networking.",
        unityExample:
          "An interaction service depends on IInteractable. Doors, tools, and seats add components. Occupancy is a separate service so tests do not need a scene.",
        mistakes: [
          "Interface for every class",
          "Abstract InteractableBase 8 levels deep",
          "Calling Service Locator from Update",
        ],
        tradeoffs: [
          "Too many tiny interfaces confuse artists and juniors",
          "Too few and every feature edits the core",
        ],
        interviewQuestion:
          "Which SOLID principle is most often broken in Unity codebases you have seen, and how would you fix it without a rewrite?",
        followUps: [
          "When is inheritance the right tool?",
          "How does this affect testing?",
        ],
        summary: [
          "SOLID is about change, not class count",
          "Composition first",
          "Name a poor use of each pattern",
        ],
      },
    ],
  },
  {
    id: "c",
    letter: "C",
    title: "Unity architecture",
    goal: "Treat the app as a product with boundaries, bootstrap, and content packs.",
    topics: [
      {
        id: "boundaries",
        module: "C",
        title: "MonoBehaviour vs domain vs services",
        simple:
          "MonoBehaviour talks to Unity. Domain logic should not need a Transform to be testable.",
        production:
          "Composition root (VContainer/bootstrap scene) owns lifetimes. Features get asmdefs. ScriptableObjects are config and shared data, not a hidden global heap. Scenes compose objects; they are not the architecture.",
        unityExample:
          "Room occupancy, save schema, and invite permissions are plain C#. The machine prefab only raises an Interact request.",
        mistakes: [
          "Singletons in every manager",
          "DontDestroyOnLoad as architecture",
          "Business rules in animation events only",
        ],
        tradeoffs: [
          "More assemblies increase setup cost",
          "Too much abstraction slows a 3-person team",
        ],
        interviewQuestion:
          "What logic should not live in MonoBehaviour in a simulation product?",
        followUps: [
          "How do you initialize services without Script Execution Order?",
          "Where do feature flags live?",
        ],
        summary: [
          "MB = adapter",
          "Bootstrap owns singletons",
          "Content is data",
        ],
      },
    ],
  },
  {
    id: "d",
    letter: "D",
    title: "Lifecycle and execution",
    goal: "Prevent init-order and subscription bugs as a team standard.",
    topics: [
      {
        id: "lifecycle",
        module: "D",
        title: "Callbacks, pause, domain reload",
        simple:
          "Awake → OnEnable → Start → Update loop → OnDisable → OnDestroy. Physics uses FixedUpdate.",
        production:
          "OnEnable/OnDisable must pair. Mobile pause is OnApplicationPause. Domain reload and Enter Play Mode Options hide static bugs. Additive scenes create duplicate services if bootstrap is weak.",
        unityExample:
          "A static lobby event subscribed with a lambda in OnEnable will keep calling into a destroyed HUD.",
        mistakes: [
          "Relying on script execution order",
          "Start() network calls without cancellation",
          "Ignoring pause while holding a network lock",
        ],
        tradeoffs: [
          "Execution order is a fast patch and a long-term lie",
        ],
        interviewQuestion:
          "Walk through a duplicated-callback bug after additive scene load.",
        followUps: [
          "How does Enter Play Mode Options change what you test?",
        ],
        summary: [
          "Pair enable/disable",
          "Pause is a network event",
          "No lambdas on long-lived events",
        ],
      },
    ],
  },
  {
    id: "e",
    letter: "E",
    title: "Profiling and optimization",
    goal: "Never optimize without a baseline and a classified bottleneck.",
    topics: [
      {
        id: "process",
        module: "E",
        title: "The measurement-first process",
        simple: "Find the limiter, change one thing, measure again on the target device.",
        production:
          "Reproduce → baseline → capture → classify CPU/GPU/memory/IO/network/load → locate system → hypothesis → one change → remeasure → device → regression check. Distinguish fps from frame-time consistency, editor from player, draw calls from GPU time, usage from leaks.",
        unityExample:
          "18 fps in a furnished room: Profiler shows GPU bound, Frame Debugger shows stacked transparents. Art reduces overlapping glass; you do not rewrite C#.",
        mistakes: [
          "Optimizing in the editor only",
          "Deep Profiling as truth for timings",
          "Changing five systems at once",
        ],
        tradeoffs: [
          "Development builds are slower than release",
          "Capture itself perturbs the frame",
        ],
        interviewQuestion:
          "How do you know whether a Unity app is CPU-bound or GPU-bound?",
        followUps: [
          "What evidence confirms a Canvas rebuild bottleneck?",
          "How would thermal throttling fool you?",
        ],
        summary: [
          "Classify first",
          "One change",
          "Device is the judge",
        ],
      },
    ],
  },
  {
    id: "f",
    letter: "F",
    title: "Rendering and graphics",
    goal: "Talk quality, memory, build size, and production time as one decision.",
    topics: [
      {
        id: "batching",
        module: "F",
        title: "Batching, SRP Batcher, overdraw",
        simple:
          "Batching reduces CPU submission cost. The GPU may still be fill-rate bound.",
        production:
          "Static batching: memory cost, static objects. GPU instancing: many copies. SRP Batcher: shader-compatible SetPass reduction. Overdraw: transparents, particles, UI. Shader variants: build size and hitching.",
        unityExample:
          "A meeting room with glass and dust can have modest batches and a hot GPU.",
        mistakes: [
          "Equating draw calls with GPU cost",
          "Enabling every light 'because URP'",
        ],
        tradeoffs: [
          "Lightmaps take bake time and memory",
          "Realtime shadows cost cascades × lights",
        ],
        interviewQuestion:
          "How would you create a scalable URP quality strategy for Mobile and PC?",
        followUps: [
          "Can occlusion culling help if rooms load dynamically?",
        ],
        summary: [
          "CPU submit vs GPU fill",
          "Variants are a budget",
          "Interiors are overdraw-heavy",
        ],
      },
    ],
  },
  {
    id: "g",
    letter: "G",
    title: "Assets and content delivery",
    goal: "Treat rooms as versioned remote packs.",
    topics: [
      {
        id: "addressables",
        module: "G",
        title: "Addressables, catalogs, unload",
        simple:
          "Addressables wrap AssetBundles with ref-counting, catalogs, and remote providers.",
        production:
          "Unload requires ref count zero and no leftover Unity references. Duplicate assets bloat bundles. Content schema must be compatible with the client. Failed downloads must leave the lobby usable.",
        unityExample:
          "Room packs on a CDN, platform texture variants, resume on mobile, pin catalog to app version.",
        mistakes: [
          "Resources for hundreds of MB",
          "Release without snapshot proof",
          "No offline story",
        ],
        tradeoffs: [
          "Many tiny bundles vs few huge ones",
          "Preload on PC vs cellular cost",
        ],
        interviewQuestion:
          "When can an Addressable asset actually be unloaded?",
        followUps: [
          "How do duplicate assets enter two groups?",
        ],
        summary: [
          "Ref count + hidden refs",
          "Compatibility window",
          "Failure UX",
        ],
      },
    ],
  },
  {
    id: "h",
    letter: "H",
    title: "Animation, physics, interaction",
    goal: "Keep 30 avatars cheap and shared objects authoritative.",
    topics: [
      {
        id: "shared-interact",
        module: "H",
        title: "Animators and shared objects",
        simple:
          "Animator cost scales with active controllers. Shared objects need locks, not dual Rigidbodies.",
        production:
          "LOD animation, culling, replicate parameters not bones. Occupancy on the server. Kinematic presentation, not competing physics authority.",
        unityExample:
          "A training console: request-lock, play in-use state, release on timeout or disconnect.",
        mistakes: [
          "Always Animate on 30 characters",
          "Networked Rigidbody grabs",
        ],
        tradeoffs: [
          "IK quality vs CPU",
          "Root motion vs replicated movement",
        ],
        interviewQuestion:
          "How do interpolation and prediction differ for an avatar versus a shared tablet?",
        followUps: [
          "What happens if two clients send Use in the same tick?",
        ],
        summary: [
          "LOD the animator",
          "Lock shared objects",
          "Do not replicate physics chaos",
        ],
      },
    ],
  },
  {
    id: "i",
    letter: "I",
    title: "UI and UX engineering",
    goal: "Treat Canvas rebuilds as a performance system.",
    topics: [
      {
        id: "canvas",
        module: "I",
        title: "uGUI rebuilds and cross-device input",
        simple:
          "A Canvas rebuilds when geometry or layout changes. Big canvases with per-frame dirty values are expensive.",
        production:
          "Split static and dynamic canvases. Disable unused raycast targets. Pool lists. Safe areas and cursor vs touch are architecture. Localization must not blow layout every frame.",
        unityExample:
          "A collaboration HUD with a ticking latency label should not sit on the same canvas as the room inventory grid.",
        mistakes: [
          "One canvas for the whole app",
          "Best-fit on every Text",
        ],
        tradeoffs: [
          "UI Toolkit vs uGUI team skill",
          "Immediate feedback vs rebuild cost",
        ],
        interviewQuestion:
          "How do you optimize a Unity UI that stutters when a chat message arrives?",
        followUps: [
          "Where should view-model live if you already use R3?",
        ],
        summary: [
          "Split canvases",
          "Pool scrolling",
          "Input is a platform layer",
        ],
      },
    ],
  },
  {
    id: "j",
    letter: "J",
    title: "Multiplayer and collaboration",
    goal: "Design rooms with authority, snapshots, and honest gaps.",
    topics: [
      {
        id: "authority",
        module: "J",
        title: "Client-server rooms",
        simple:
          "The server decides shared truth. Clients send input and show interpolated results.",
        production:
          "Dedicated server over P2P for 30 users. Snapshots + deltas. Interest management. Reconnect via full state. Voice is a separate plane. Version mismatch refuses join.",
        unityExample:
          "Equipment occupancy is server-side. Avatar locomotion can be predicted locally and reconciled.",
        mistakes: [
          "Peer-to-peer host migration as the main design",
          "Client-authoritative grabs",
          "Claiming shipped 3D-MMO experience you do not have",
        ],
        tradeoffs: [
          "Tick rate vs mobile battery and bandwidth",
          "Prediction complexity vs slightly laggier tools",
        ],
        interviewQuestion:
          "What should be server-authoritative in a 30-user training room?",
        followUps: [
          "How do you test 250 ms RTT and 5% loss?",
          "How do you prevent two users controlling one object?",
        ],
        summary: [
          "Server owns fights",
          "Snapshot reconnect",
          "Say the production gap out loud",
        ],
      },
    ],
  },
  {
    id: "k",
    letter: "K",
    title: "Cross-platform deployment",
    goal: "Quality tiers, lifecycle, and a real device matrix.",
    topics: [
      {
        id: "tiers",
        module: "K",
        title: "Device tiers and suspend",
        simple:
          "The same room must run under different budgets. Mobile can pause at any time.",
        production:
          "Detect capabilities, set budgets, survive OnApplicationPause without leaking occupancy. Symbols, crash reporting, store requirements, IL2CPP stripping.",
        unityExample:
          "Phone call mid-session: release or timeout locks, reconnect, restore view.",
        mistakes: [
          "One quality level",
          "Testing only flagship phones",
        ],
        tradeoffs: [
          "Vulkan vs compatibility",
          "Staged rollout vs hotfix speed",
        ],
        interviewQuestion:
          "How do you choose quality settings without destroying the room's training value?",
        followUps: [
          "What is in your device testing matrix?",
        ],
        summary: [
          "Budgets have owners",
          "Pause is networking",
          "Symbols are part of the release",
        ],
      },
    ],
  },
  {
    id: "l",
    letter: "L",
    title: "Testing and production stability",
    goal: "Incidents have owners, rollbacks, and follow-up tests.",
    topics: [
      {
        id: "incident",
        module: "L",
        title: "Crashes, CI, rollback",
        simple:
          "If QA cannot reproduce, you still have rates, devices, and stacks.",
        production:
          "Halt staged rollout, symbolicate, divide work, communicate time-boxes, then postmortem the matrix gap. Unit-test domain. PlayMode for lifecycle. Perf tests for rooms.",
        unityExample:
          "Native graphics plugin crash after 10 minutes in one room: isolate content, GPU family, memory pressure.",
        mistakes: [
          "Debugging without an owner",
          "Shipping because 'works on my device'",
        ],
        tradeoffs: [
          "Rollback vs hotfix vs feature flag",
        ],
        interviewQuestion:
          "A release crashes on mid-range Android and QA cannot reproduce it. What do you do?",
        followUps: [
          "How do you divide work across engineering, art, and QA?",
        ],
        summary: [
          "Stop the bleed",
          "Evidence first",
          "Change the matrix",
        ],
      },
    ],
  },
  {
    id: "m",
    letter: "M",
    title: "Requirements and technical design",
    goal: "Turn slogans into MVP cuts, contracts, and risks.",
    topics: [
      {
        id: "req",
        module: "M",
        title: "Requirement analysis",
        simple:
          "A feature request is not a spec. You extract users, flows, acceptance, and out-of-scope.",
        production:
          "Ask who, problem, flow, acceptance, platforms, devices, scale, persistence, online, state owner, failure, analytics, out of scope. Produce assumptions, architecture, tasks, ranges, tests, rollout, monitoring.",
        unityExample:
          "'Create virtual rooms' becomes template rooms, invite links, persist layout, max occupants—not a full UGC modeler in v1.",
        mistakes: [
          "Estimating slogans",
          "Hiding uncertainty",
        ],
        tradeoffs: [
          "MVP now vs rework later",
        ],
        interviewQuestion:
          "Product wants virtual rooms in two weeks. What is your cut line?",
        followUps: [
          "Which part do you spike?",
        ],
        summary: [
          "Questions first",
          "MVP + cuts",
          "Ranges not fake precision",
        ],
      },
    ],
  },
  {
    id: "n",
    letter: "N",
    title: "Team leadership",
    goal: "Lead with evidence. Do not fake the title.",
    topics: [
      {
        id: "title-gap",
        module: "N",
        title: "Leading without the title",
        simple:
          "You can show lead behaviors without claiming a year as Team Leader.",
        production:
          "Evidence: owning migrations, live stability, coordination, review, documentation, knowledge sharing. Wording: 'I have not yet held the formal title for a full year, but I have already performed several lead-level responsibilities…' then proof.",
        unityExample:
          "Protecting a revenue game from a risky client change by splitting a hotfix path and talking to QA and backend.",
        mistakes: [
          "Inventing headcount you managed",
          "Only saying 'we'",
          "Being defensive about the gap",
        ],
        tradeoffs: [
          "Coding vs coordinating",
          "Standards vs velocity",
        ],
        interviewQuestion:
          "Why should we choose you over a developer with formal leadership experience?",
        followUps: [
          "What will you need help with in the first 90 days?",
        ],
        summary: [
          "Name the gap once",
          "Prove adjacent evidence",
          "STAR with I/we split",
        ],
      },
    ],
  },
  {
    id: "o",
    letter: "O",
    title: "AI in the workflow",
    goal: "Use AI as a research assistant, not as an unreviewed author.",
    topics: [
      {
        id: "ai",
        module: "O",
        title: "Responsible AI usage",
        simple:
          "AI can draft tests, docs, and search. Humans own correctness, licenses, and secrets.",
        production:
          "Risks: hallucinated APIs, leaking proprietary code, license contamination, overdependence, unmaintainable dumps. Policy: no secrets in prompts, review every diff, prefer it for boilerplate and log clustering, never for silent architecture.",
        unityExample:
          "Use AI to draft an Addressables failure-state checklist, then verify against Unity docs and your catalog setup.",
        mistakes: [
          "Pasting stack traces with user data",
          "Shipping generated shaders unread",
        ],
        tradeoffs: [
          "Speed vs review load",
          "Junior learning vs autocomplete crutches",
        ],
        interviewQuestion:
          "How do you let the team use AI without lowering code quality?",
        followUps: [
          "What must never go into a prompt?",
        ],
        summary: [
          "Human ownership",
          "Review required",
          "No secrets, no unverified APIs",
        ],
      },
    ],
  },
  {
    id: "p",
    letter: "P",
    title: "VFX and Technical Art",
    goal: "Talk Particle System, VFX Graph, Shader Graph, and Unity 6 URP the way a Technical Artist panel expects.",
    topics: [
      {
        id: "particles",
        module: "P",
        title: "Built-in Particle System",
        simple:
          "CPU-simulated particles with Inspector modules and full C# access. Thousands, not millions.",
        production:
          "Pick this when gameplay must Emit/GetParticles, collide with the world, or run without compute. Max particles is a cap. World collision is a CPU query. Fill rate from additive billboards is the usual GPU surprise.",
        unityExample:
          "Muzzle sparks that must sit on a desk: Particle System collision planes or world collision, burst via Emit, Unlit particle shader. Not a 50k VFX Graph with fake contacts.",
        mistakes: [
          "Calling particles free because they are quads",
          "Using GetParticles every shot instead of Emit",
          "Leaving world collision on a dense rain",
        ],
        tradeoffs: [
          "Script access vs GPU count",
          "World collision vs visual-only rain",
        ],
        interviewQuestion:
          "When do you pick the Built-in Particle System over VFX Graph for a collaboration-room effect?",
        followUps: ["What does max particles actually do?", "Which module is usually GPU vs CPU?"],
        summary: ["C# access", "Thousands", "Collision is CPU"],
      },
      {
        id: "vfx-graph",
        module: "P",
        title: "Visual Effect Graph",
        simple:
          "GPU graph: Spawn, Initialize, Update, Output. Capacity is reserved memory.",
        production:
          "URP/HDRP plus compute. Unity 6 adds URP camera depth/color buffers and Shader Graph keyword support. Shader Graph hooks through dedicated outputs, not a legacy checkbox. Do not GetParticles.",
        unityExample:
          "A looping room torch: bounded capacity, Unlit output, GPU event embers, mobile quality float that drops the event system.",
        mistakes: [
          "Quoting the 2021 Visual Effect Target",
          "Oversized capacity on a looping accent",
          "Claiming a shipped VFX Graph library you do not have",
        ],
        tradeoffs: [
          "Millions of particles vs no per-particle C#",
          "Scene-color distortion vs fill rate",
        ],
        interviewQuestion:
          "Walk Spawn → Initialize → Update → Output, and name one Unity 6 URP change.",
        followUps: ["What is capacity?", "How do you attach Shader Graph in Unity 6?"],
        summary: ["GPU contexts", "Capacity", "Unity 6 buffers"],
      },
      {
        id: "shader-graph",
        module: "P",
        title: "Shader Graph",
        simple:
          "Visual HLSL for URP/HDRP. Master Stack is vertex vs fragment. Keywords compile variants.",
        production:
          "Boolean keywords can double variants and hitch remote rooms. Support VFX Graph is a Graph Settings flag plus a dedicated VFX output. Half precision bands; world-position math often needs Single. SRP Batcher is not automatic.",
        unityExample:
          "Desk hologram: Unlit, emission, Scene Depth intersection, dither fade, no extra keywords for wetness and damage on the same graph.",
        mistakes: [
          "Uber shader with four Boolean features",
          "Wind in fragment",
          "Building new graphs for Built-in RP in Unity 6",
        ],
        tradeoffs: [
          "Keyword vs slider",
          "Lit particles vs Unlit emission",
        ],
        interviewQuestion:
          "Art wants dissolve, hologram, wetness, and damage on one graph. What do you do?",
        followUps: ["Vertex vs fragment dissolve?", "What does Support VFX Graph require?"],
        summary: ["Master Stack", "Keywords", "VFX support"],
      },
      {
        id: "render-pipeline",
        module: "P",
        title: "Unity 6 render pipelines",
        simple:
          "A pipeline is cull → lights → draw → post. New work is URP. Built-in RP is deprecated.",
        production:
          "URP 17: Render Graph, GPU Resident Drawer (Forward+, compute, Mesh Renderer), Forward+ for dense lamps. Custom passes use RecordRenderGraph. Compatibility Mode is not a new-feature path. HDRP is a high-end SKU, not mid-range Android rooms.",
        unityExample:
          "Furnished training room: URP Forward+, named quality without Resident Drawer on OpenGL ES, bloom and glass transparents budgeted separately from draw calls.",
        mistakes: [
          "Calling GPU Resident Drawer the SRP Batcher",
          "Staying on Built-in RP because particles work",
          "Writing new Renderer Features on Compatibility Mode",
        ],
        tradeoffs: [
          "Forward vs Forward+ vs Deferred",
          "HDRP look vs mobile rooms",
        ],
        interviewQuestion:
          "Walk a URP camera frame in Unity 6 and say what GPU Resident Drawer requires.",
        followUps: ["Why enable depth texture?", "What is Render Graph saving?"],
        summary: ["URP 17", "Forward+", "Resident Drawer ≠ SRP Batcher"],
      },
      {
        id: "vfx-perf",
        module: "P",
        title: "VFX cost and overdraw",
        simple:
          "Transparent particles fail on fill rate. Count is not GPU time.",
        production:
          "Additive billboards, scene-color grabs, lit particles, and bloom stack. Quality tiers drop GPU events and distortion before they drop readable emissive signs. Prove with overdraw view and Frame Debugger, not editor fps.",
        unityExample:
          "Glassy meeting room at 18 fps, low draw calls: stacked glass + torch particles + bloom. Cut blend coverage and post before pooling.",
        mistakes: [
          "I would just lower the particle count",
          "Editor 60 fps as proof",
          "Volumetric fog in every user room on mobile as default",
        ],
        tradeoffs: [
          "Soft particles vs depth texture tax",
          "Hero explosion vs quality LOD",
        ],
        interviewQuestion:
          "GPU time is high and draw calls look fine. What do you check for particles?",
        followUps: ["How do you tier a VFX Graph torch?", "Lit vs Unlit particles?"],
        summary: ["Fill rate", "Tiers", "Measure first"],
      },
    ],
  },
];

export function allLearnTopics() {
  return modules.flatMap((m) => m.topics);
}

const topicAliases: Record<string, string> = {
  networking: "authority",
  multiplayer: "authority",
  collaboration: "authority",
  profiling: "process",
  optimization: "process",
  rendering: "batching",
  graphics: "batching",
  assets: "addressables",
  addressables: "addressables",
  memory: "addressables",
  animation: "shared-interact",
  physics: "shared-interact",
  ui: "canvas",
  leadership: "title-gap",
  mentoring: "title-gap",
  requirements: "req",
  async: "async-unity",
  await: "async-unity",
  coroutine: "async-unity",
  solid: "solid",
  architecture: "boundaries",
  lifecycle: "lifecycle",
  testing: "incident",
  debugging: "incident",
  platform: "tiers",
  mobile: "tiers",
  ai: "ai",
  particles: "particles",
  particle: "particles",
  vfx: "vfx-graph",
  "vfx graph": "vfx-graph",
  shader: "shader-graph",
  urp: "render-pipeline",
  hdrp: "render-pipeline",
  pipeline: "render-pipeline",
  overdraw: "vfx-perf",
};

export function findTopic(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return allLearnTopics()[0];
  const topics = allLearnTopics();
  const aliased = topicAliases[q];
  return (
    (aliased ? topics.find((t) => t.id === aliased) : undefined) ||
    topics.find((t) => t.id === q || t.title.toLowerCase().includes(q)) ||
    modules.find(
      (m) =>
        m.letter.toLowerCase() === q ||
        m.id === q ||
        m.title.toLowerCase().includes(q)
    )?.topics[0] ||
    topics.find((t) => t.simple.toLowerCase().includes(q) || t.title.toLowerCase().includes(q)) ||
    topics[0]
  );
}
