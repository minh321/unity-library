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

export const diagnosticQuestionsPart1: Question[] = [
  {
    id: "diag-01-intro",
    mode: "diagnostic",
    area: "leadership",
    relatedAreas: ["technical-english", "requirements"],
    title: "Introduction and readiness",
    difficulty: "team-lead",
    prompt:
      "Please introduce yourself as if this were the real interview, and explain why your experience makes you ready to take on a Unity Team Leader position.",
    interviewerNote:
      "This is a filter question. They want ownership, honesty about the title gap, production evidence, and a reason this product—not casino slots—is the next step.",
    concepts: [
      {
        id: "years-stack",
        label: "Years and stack stated clearly",
        synonyms: ["three", "3 years", "four", "4 years", "unity", "c#", "cocos"],
        weight: 1,
        required: true,
      },
      {
        id: "shipped-evidence",
        label: "Concrete shipped work",
        synonyms: ["15", "shipped", "production", "casino", "slot", "live game", "released"],
        weight: 1.2,
        required: true,
      },
      {
        id: "migrations",
        label: "Migration / modernization evidence",
        synonyms: ["migrat", "moderniz", "upgrade", "haxe", "unity version", "server-migration", "server migration"],
        weight: 1.1,
        required: true,
      },
      {
        id: "stability",
        label: "Production stability / revenue impact",
        synonyms: ["downtime", "revenue", "stability", "maintain", "production issue", "hotfix", "live ops", "liveops"],
        weight: 1.2,
        required: true,
      },
      {
        id: "honest-title",
        label: "Honest about no formal TL title",
        synonyms: ["have not held", "not yet held", "no formal", "without the title", "not been a team leader", "informal", "did not have the title", "haven't been", "have not been a team"],
        weight: 1.4,
        required: true,
        seniority: "lead",
      },
      {
        id: "lead-behaviors",
        label: "Lead-level behaviors with evidence",
        synonyms: ["coordinat", "mentor", "review", "broke the work", "task breakdown", "owned", "ownership", "guided", "onboard", "documented", "escalat"],
        weight: 1.3,
        required: true,
        seniority: "lead",
      },
      {
        id: "why-this-role",
        label: "Why this simulation / collaboration product",
        synonyms: ["simulation", "virtual room", "collaboration", "cross-platform", "architecture", "not just gameplay", "interactive 3d", "online"],
        weight: 1.2,
        required: true,
        seniority: "lead",
      },
      {
        id: "unity-depth",
        label: "Unity systems named with intent",
        synonyms: ["addressable", "profiler", "vcontainer", "scriptableobject", "mecanim", "assetbundle", "navmesh", "input system"],
        weight: 0.8,
        required: false,
        seniority: "senior",
      },
      {
        id: "i-owned",
        label: "Personal ownership language",
        synonyms: ["i owned", "i was responsible", "my responsibility", "i led the", "i proposed"],
        weight: 1,
        required: false,
        seniority: "lead",
      },
    ],
    antiPatterns: [
      ...overclaim,
      {
        id: "apologetic",
        label: "Over-apologizing for the title gap",
        patterns: ["i am not qualified", "i probably shouldn't", "i don't think i'm ready", "i have no leadership"],
        penalty: 0.5,
        note: "State the gap once, then prove adjacent evidence. Do not argue against yourself.",
        kind: "leadership",
      },
    ],
    followUps: [
      {
        ifMissing: ["honest-title"],
        question: "Have you held the formal Team Leader title for a year? If not, what lead-level work have you actually done, and what did you personally own?",
      },
      {
        ifMissing: ["why-this-role"],
        question: "This company is not hiring a slot-gameplay developer. Why should they trust you to lead an interactive 3D simulation and online collaboration product?",
      },
      {
        ifMissing: ["lead-behaviors"],
        question: "Give one concrete example where you influenced other people's work—task breakdown, review, mentoring, or cross-discipline coordination—not just your own tickets.",
      },
      {
        always: true,
        question: "In that introduction, what was your single strongest piece of evidence, and what is the one gap you still need to close before this interview?",
      },
    ],
    spokenAnswer:
      "I'm a game developer with about three to four years across Unity, Cocos Creator, and TypeScript. I have shipped more than 15 production games, maintained a revenue-critical live title with very little downtime, and led technical work on large migrations: more than 10 Unity version upgrades, more than 40 Haxe-to-Cocos moves, and about 30 client adaptations for server migrations. I have not held the formal Team Leader title for a full year. I have already owned lead-level work: breaking down migrations, coordinating with design, art, and QA, protecting stability, and working in a shared production codebase. I want this role because it is architecture, cross-platform performance, and online collaboration—not only feature implementation—and that is the level I am ready to operate at.",
    deepAnswer:
      "A Team Lead intro has three jobs: prove production judgment, prove you can lead without pretending you already had the title, and prove you understand this product. Lead with years and stack, then two or three hard numbers (15 shipped games, 10 Unity upgrades, 40 Haxe migrations, 30 server-client adaptations, a revenue title with low downtime). Separate 'I owned' from 'the team owned'. Name the gap in one sentence, then convert informal leadership into evidence: coordination, review, incident ownership, documentation, mentoring. Close on the product: virtual rooms, device tiers, collaboration, and maintainable Unity architecture. Do not recite a Unity feature list. Do not say you are a Team Leader if you were not.",
    keyPhrases: [
      "I have not yet held the formal Team Leader title for a full year, but I have already performed several lead-level responsibilities.",
      "I owned the client adaptations / migration work; the team owned the shared schedule and release.",
      "This role is architecture, performance across devices, and collaboration—not only gameplay features.",
    ],
    englishTips: [
      "Keep it to 60–90 seconds. One breath per idea.",
      "Use 'I owned X' then 'the team did Y'. Avoid a full answer of only 'we'.",
      "Say 'very little downtime' only if true; do not invent a percentage.",
    ],
  },
  {
    id: "diag-02-lifecycle",
    mode: "diagnostic",
    area: "unity-lifecycle",
    relatedAreas: ["debugging", "advanced-csharp"],
    title: "Unity execution lifecycle",
    difficulty: "senior",
    prompt:
      "Explain Unity's execution lifecycle from object creation to destruction. Then describe one real bug that comes from initialization order, subscriptions, duplicated callbacks, or destroyed objects—and how you would prevent it on a team.",
    concepts: [
      { id: "awake-start", label: "Awake vs Start vs OnEnable", synonyms: ["awake", "start", "onenable", "ondisable"], weight: 1.2, required: true },
      { id: "update-loop", label: "Update / FixedUpdate / LateUpdate", synonyms: ["update", "fixedupdate", "lateupdate", "fixed timestep"], weight: 1, required: true },
      { id: "destroy", label: "OnDestroy / disable pairing", synonyms: ["ondestroy", "unsubscribe", "on disable", "ondisable"], weight: 1, required: true },
      { id: "script-order", label: "Script execution order / scene load", synonyms: ["script execution order", "scene load", "dont destroy", "bootstrap", "domain reload", "execution order"], weight: 1, required: false, seniority: "senior" },
      { id: "subscription-bug", label: "Event leak or double-subscribe", synonyms: ["unsubscribe", "memory leak", "double", "duplicate callback", "missing ondestroy", "anonymous lambda", "closure"], weight: 1.3, required: true, seniority: "senior" },
      { id: "destroyed-object", label: "Destroyed object / missing reference", synonyms: ["destroyed", "missing reference", "null", "unityengine.object", "fake null"], weight: 0.8, required: false },
      { id: "team-prevention", label: "Team-level prevention", synonyms: ["code review", "convention", "lint", "standard", "checklist", "document", "mentor"], weight: 1, required: true, seniority: "lead" },
    ],
    antiPatterns: overclaim,
    followUps: [
      { ifMissing: ["subscription-bug"], question: "A junior subscribes to a static event in OnEnable using a lambda and never unsubscribes. What happens after the object is destroyed, and how would you catch that in review?" },
      { ifMissing: ["team-prevention"], question: "How would you turn this from a personal habit into a team standard without becoming a bottleneck on every pull request?" },
    ],
    spokenAnswer:
      "Awake runs when the object is initialized, OnEnable when it becomes active, Start before the first update. I keep cross-object wiring out of Awake when the other object may not exist yet, and I put subscriptions in OnEnable with matching unsubscribes in OnDisable. Update is per-frame logic, FixedUpdate is physics timestep, LateUpdate is camera and post-pose work. The common production bug is a static or manager event subscribed with a lambda that cannot be removed, so destroyed objects keep running and allocating. On a team I would make subscribe/unsubscribe pairing a review rule and keep callbacks as named methods.",
    deepAnswer:
      "Lifecycle bugs are usually order bugs, lifetime bugs, or domain-reload bugs. Awake is local setup. OnEnable/OnDisable must be symmetric because disable/enable can happen without destroy. Start is for talking to other objects after their Awake. Do not rely on Script Execution Order as architecture. Scene load, additive scenes, and DontDestroyOnLoad create second copies if bootstrap is sloppy. Enter Play Mode Options can hide static-state bugs. Unity's fake-null means a destroyed Object is not a C# null. Team prevention: pairing rule, no lambdas on long-lived events, clear service initialization in a bootstrap scene, and a Play Mode test for subscribe/unsubscribe.",
    keyPhrases: ["OnEnable and OnDisable must be paired.", "I do not use Script Execution Order as architecture.", "Lambdas on static events are a review reject."],
    englishTips: ["Name the callbacks, then give one bug, then the team rule. Three beats."],
  },
  {
    id: "diag-03-csharp",
    mode: "diagnostic",
    area: "csharp-fundamentals",
    relatedAreas: ["memory", "advanced-csharp"],
    title: "C# in Unity: types, GC, LINQ",
    difficulty: "senior",
    prompt:
      "Why can repeatedly using LINQ in Update cause problems in Unity, and how would you prove it is a real bottleneck before rewriting it? Include value versus reference types, boxing, and what you would look at in the Profiler.",
    concepts: [
      { id: "linq-alloc", label: "LINQ allocates enumerators / closures / boxed values", synonyms: ["allocat", "garbage", "gc", "enumerator", "boxing", "closure", "heap"], weight: 1.3, required: true },
      { id: "measure-first", label: "Measure before rewrite", synonyms: ["profiler", "gc.alloc", "gc alloc", "baseline", "deep profile", "allocation", "measure"], weight: 1.4, required: true, seniority: "senior" },
      { id: "value-ref", label: "Value vs reference / stack vs heap (accurate)", synonyms: ["struct", "class", "value type", "reference type", "stack", "heap", "boxing"], weight: 1.1, required: true },
      { id: "not-always-linq", label: "LINQ is not always the bottleneck", synonyms: ["prove", "not always", "might not", "confirm", "hypothesis", "one change"], weight: 1, required: true, seniority: "senior" },
      { id: "alternative", label: "Non-allocating alternative", synonyms: ["for loop", "cached list", "object pool", "span", "no alloc", "reuse"], weight: 0.9, required: false },
      { id: "player-build", label: "Player/development build vs editor", synonyms: ["development build", "player", "device", "editor profiler", "not only editor"], weight: 0.8, required: false, seniority: "lead" },
    ],
    antiPatterns: overclaim,
    followUps: [
      { ifMissing: ["measure-first"], question: "What exact Profiler markers and evidence would make you confident LINQ is the problem, rather than UI rebuilds or rendering?" },
      { ifMissing: ["value-ref"], question: "A teammate says 'structs always live on the stack so they never GC'. What is wrong with that statement?" },
    ],
    spokenAnswer:
      "LINQ in Update often allocates: iterators, delegates, boxed value types, and sometimes ToList copies. That does not automatically mean it is the frame budget problem. I would reproduce on a development player build, take a baseline, and check GC Alloc and GC.Collect spikes on the main thread. If LINQ shows up in the hierarchy with per-frame allocation, I would replace that hot path with a cached list and a for-loop, then measure again on a mid-range device. I would also remember structs can still box or live on the heap inside arrays and closures.",
    deepAnswer:
      "Accurate mental model: value types are copied by value; they often live on the stack, but they also live on the heap as fields of classes, in arrays, and when boxed. Boxing is wrapping a value type in a heap object, which allocates. LINQ uses interfaces, so enumerating a List via IEnumerable can box the struct enumerator. Closures allocate a display class. Prove it with GC Alloc column, Allocation Callstacks if needed, and a before/after capture. Deep Profiling distorts timing—use it to find 'what', not 'how expensive'. Do not ban LINQ in editor tools or cold paths.",
    keyPhrases: ["I would prove the allocation before rewriting the query.", "Structs are not 'never GC'.", "Editor timings are not device timings."],
    englishTips: ["Say 'I would measure GC Alloc on a development build' rather than 'LINQ is bad'."],
  },
  {
    id: "diag-04-solid",
    mode: "diagnostic",
    area: "oop-solid",
    relatedAreas: ["design-patterns", "unity-architecture"],
    title: "Interaction system without a huge inheritance tree",
    difficulty: "senior",
    prompt:
      "Design an interaction system that supports doors, machines, tools, seats, and shared interactive objects without creating a large inheritance hierarchy. Which SOLID principles are you applying, and where would a pattern be the wrong tool?",
    concepts: [
      { id: "composition", label: "Composition over inheritance", synonyms: ["composition", "interface", "component", "not inherit", "no deep inherit"], weight: 1.3, required: true },
      { id: "isp", label: "Interface segregation", synonyms: ["interface segregation", "small interface", "iinteract", "iholdable", "usable"], weight: 1.1, required: true },
      { id: "srp", label: "Single responsibility", synonyms: ["single responsibility", "srp", "one reason", "interactable component"], weight: 0.9, required: false },
      { id: "dip", label: "Depend on abstractions / DI", synonyms: ["dependency inversion", "vcontainer", "inject", "interface not monobehaviour"], weight: 0.9, required: false, seniority: "senior" },
      { id: "shared-object", label: "Shared / networked interaction considered", synonyms: ["authority", "server", "ownership", "lock", "occupancy", "shared", "network"], weight: 1.2, required: true, seniority: "lead" },
      { id: "poor-use", label: "When a pattern is overkill", synonyms: ["overuse", "too many interfaces", "service locator", "god mediator", "wrong", "disadvantage"], weight: 1, required: true, seniority: "senior" },
    ],
    antiPatterns: overclaim,
    followUps: [
      { ifMissing: ["shared-object"], question: "Two users grab the same tool in a collaborative room. Who is allowed to move it, and where does that rule live?" },
      { ifMissing: ["poor-use"], question: "If a junior wraps every door in Command + Decorator + Abstract Factory, what do you say in code review?" },
    ],
    spokenAnswer:
      "I would not make InteractableBase with Door, Machine, Seat subclasses. I would put a small IInteractable on a component, then extra interfaces only when needed: IOccupiable, IHoldable, IPowered. The interaction service finds a target, checks permissions, and runs a command. For shared objects, occupancy and authority live outside the view component so the same rules work offline in tests. A giant mediator or a 12-level inheritance tree is the wrong tool because it becomes untestable and every new object type requires a core change.",
    deepAnswer:
      "SRP: detecting input, resolving targets, validating permissions, playing animation, and replicating state are different reasons to change. OCP: new object types should add components, not edit a switch in a god class. LSP: a Seat that cannot be 'used' the same way as a Door should not fake the same method. ISP: do not force seats to implement IHoldable. DIP: gameplay rules depend on interfaces, not on specific MonoBehaviours. Patterns that fit: Strategy for use behaviors, Command for request/undo/network, Object Pool for spawned tools. Poor fit: Abstract Factory for three prefabs; Service Locator as a hidden singleton; Event Bus for every hover. Shared interaction needs an occupancy lock, owner client vs server authority, and a clear failure when the lock is denied.",
    keyPhrases: ["New interactable types add components, they do not extend a deep class tree.", "Authority and occupancy are not view-component problems.", "Patterns are for a real variation problem, not for decoration."],
    englishTips: ["List 2–3 interfaces, then authority, then one anti-pattern. Stop."],
  },
  {
    id: "diag-05-architecture",
    mode: "diagnostic",
    area: "unity-architecture",
    relatedAreas: ["testing", "documentation"],
    title: "Structuring a large Unity application",
    difficulty: "team-lead",
    prompt:
      "How would you structure a large Unity project for an interactive 3D simulation with multiple developers, artists, and frequent content updates? What logic should not live in MonoBehaviour?",
    concepts: [
      { id: "mb-thin", label: "Thin MonoBehaviours", synonyms: ["plain c#", "domain logic", "not in monobehaviour", "thin", "view", "adapter"], weight: 1.2, required: true },
      { id: "asmdef", label: "Assembly definitions / boundaries", synonyms: ["asmdef", "assembly definition", "package", "module", "boundary"], weight: 1, required: true, seniority: "senior" },
      { id: "bootstrap", label: "Bootstrap / persistent services", synonyms: ["bootstrap", "dontdestroyonload", "composition root", "vcontainer", "lifetime"], weight: 1, required: true },
      { id: "data-driven", label: "ScriptableObjects / data-driven config", synonyms: ["scriptableobject", "data-driven", "config", "addressable"], weight: 0.9, required: false },
      { id: "artist-workflow", label: "Artist and content workflow", synonyms: ["artist", "prefab", "scene", "content", "addressable", "folder"], weight: 1, required: true, seniority: "lead" },
      { id: "testable", label: "Testability", synonyms: ["unit test", "testable", "pure function", "play mode"], weight: 0.9, required: false, seniority: "senior" },
    ],
    antiPatterns: overclaim,
    followUps: [
      { ifMissing: ["mb-thin"], question: "Give examples of logic that must stay in MonoBehaviour versus logic that should be plain C# so you can unit-test it." },
      { always: true, question: "How would this structure change if user-generated rooms are downloaded after launch?" },
    ],
    spokenAnswer:
      "I would keep MonoBehaviours as adapters: lifecycle, serialization, animation, physics callbacks. Rules, occupancy, save data, and networking commands would be plain C# services with a composition root—VContainer or a bootstrap scene. Features would sit in assembly definitions so UI does not reference room simulation internals. Content would be Addressable prefabs and ScriptableObject configs so artists can iterate without code. User-generated rooms would be content packs with versioned catalogs, not baked into the main scene.",
    deepAnswer:
      "A simulation app is closer to a product than a single-scene game. Split: Presentation (Unity views), Application (use-cases), Domain (rules), Infrastructure (save, network, analytics). Bootstrap owns singletons; do not scatter DontDestroyOnLoad. Scenes are composition, not architecture. Editor tools and runtime code stay in separate assemblies. Feature flags and config SOs let QA toggle rooms. Logging and analytics are infrastructure, not sprinkled Debug.Log. The Team Lead job is enforcing those boundaries in review and documenting where a new feature should live.",
    keyPhrases: ["MonoBehaviour is an adapter, not the application.", "Assembly definitions are for people and compile times, not decoration.", "Downloaded rooms are content, not scene architecture."],
    englishTips: ["Use 'adapter', 'composition root', and 'boundary'—then give a folder or assembly example."],
  }
];
