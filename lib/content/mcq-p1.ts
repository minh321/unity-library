import type { Choice, ChoiceTier, Mcq, Question, ScoreBreakdown } from "@/lib/trainer/types";

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

export const mcqBankPart1: Record<string, McqPack> = {
  "diag-01-intro": {
    mcq: block(
      [
        C(
          "A",
          "trap",
          "I have been a Unity Team Leader for a year. I managed eight developers, designed our multiplayer simulation, and I am an expert in every Unity rendering path.",
          "This invents a title, headcount, and product you have not shipped. Overclaiming ends the interview.",
          []
        ),
        C(
          "B",
          "weak",
          "I am a Unity and Cocos developer with three to four years. I know C#, Addressables, VContainer, and the Profiler. I want to grow into leadership and learn from the team.",
          "Stack names without owned results or a title-gap sentence sound like a mid-level implementer asking for a promotion.",
          ["years-stack", "unity-depth"]
        ),
        C(
          "C",
          "partial",
          "I shipped more than 15 production games and helped keep a revenue title stable. We also did many Unity upgrades and Haxe migrations. I think that shows I can lead.",
          "The numbers are real, but 'we' hides your ownership and you never name the missing title or why this simulation product.",
          ["years-stack", "shipped-evidence", "migrations", "stability"]
        ),
        C(
          "D",
          "best",
          "I have about 3–4 years across Unity, Cocos, and C#. I shipped 15+ games, modernized 10+ Unity projects, migrated 40+ Haxe titles, and adapted ~30 clients for server moves. I have not held the formal Team Leader title for a year, but I have owned lead-level work: breaking down migrations, coordinating with design/art/QA, and protecting a revenue live title. I want this role because it is architecture, device performance, and online collaboration—not slot feature work.",
          "Honest gap, concrete numbers, I/we split, and a product reason. This is the Team Lead intro.",
          [
            "years-stack",
            "shipped-evidence",
            "migrations",
            "stability",
            "honest-title",
            "lead-behaviors",
            "why-this-role",
            "i-owned",
          ]
        ),
      ],
      "Choose the intro you would actually speak. Do not pick the title you wish you had."
    ),
    followUpMcq: block(
      [
        C(
          "A",
          "trap",
          "My strongest evidence is that I am already a Team Leader in everything but name, so the one-year requirement should not apply.",
          "Arguing with the job spec sounds defensive. Prove adjacent evidence; do not litigate the title.",
          []
        ),
        C(
          "B",
          "weak",
          "My strongest evidence is that I have used Unity for several years. The gap is that I still need to study networking tutorials.",
          "Years of Unity is not lead evidence. The gap is judgment and collaboration architecture, not 'more tutorials'.",
          []
        ),
        C(
          "C",
          "partial",
          "Strongest evidence: the 15 shipped games. Gap: I have not been a manager, so I would need help with people issues.",
          "Shipped count is useful but weaker than live stability plus owned migrations. People work is part of the job—name coordination you already did.",
          ["shipped-evidence"]
        ),
        C(
          "D",
          "best",
          "Strongest evidence: owning client adaptations and protecting a revenue live title with very little downtime. Gap: I have not held the formal TL title for a year, and I have not shipped a 30-user 3D collaboration room—I would design that from authority and failure modes, not pretend I have.",
          "Picks the highest-signal proof, names two honest gaps, and still shows how you would approach the missing product shape.",
          ["stability", "honest-title", "lead-behaviors"]
        ),
      ],
      "Follow-up: what is your single strongest piece of evidence, and what gap do you still need to close?"
    ),
  },
  "diag-02-lifecycle": {
    mcq: block([
      C(
        "A",
        "weak",
        "Unity runs Awake, then Start, then Update forever. I would set Script Execution Order so managers always initialize first.",
        "Execution order is a patch, not architecture. You also skipped OnEnable/OnDisable pairing and team prevention.",
        ["awake-start", "update-loop"]
      ),
      C(
        "B",
        "best",
        "Awake is local setup, OnEnable/OnDisable must pair for subscriptions, Start talks to other objects, Update/FixedUpdate/LateUpdate split frame vs physics vs post-pose. A common bug is a lambda on a static event that cannot be unsubscribed after destroy. I would make subscribe/unsubscribe pairing a review rule and ban lambdas on long-lived events.",
        "Correct lifecycle, a real bug, and a team standard—not a personal habit.",
        ["awake-start", "update-loop", "destroy", "subscription-bug", "team-prevention"]
      ),
      C(
        "C",
        "trap",
        "I put all initialization in Awake because it always runs first, and I subscribe with lambdas in Start because it is simpler.",
        "Awake is the wrong place for cross-object wiring, and lambdas on events are a leak factory.",
        []
      ),
      C(
        "D",
        "partial",
        "OnEnable and OnDisable should unsubscribe events. Destroyed Unity objects are not real C# null. I have hit missing-reference bugs after additive scene loads.",
        "Good fragments, but you never explained Awake vs Start or how the team prevents it in review.",
        ["destroy", "destroyed-object", "subscription-bug"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "trap",
          "Nothing happens. Destroyed objects cannot receive callbacks.",
          "Static events hold the delegate. The callback still runs and can allocate or NRE on fake-null Unity objects.",
          []
        ),
        C(
          "B",
          "partial",
          "It leaks. I would tell the junior to unsubscribe in OnDestroy.",
          "OnDestroy is too late if the object is only disabled. OnEnable/OnDisable pairing is the rule, and a lambda still cannot be removed.",
          ["destroy"]
        ),
        C(
          "C",
          "best",
          "The destroyed object stays subscribed. After disable/destroy the static event still invokes the lambda, which can touch fake-null Unity objects and allocate. In review I reject lambdas on long-lived events and require a named method with OnDisable unsubscribe. I would add this to the team checklist rather than nitpicking every PR from memory.",
          "Names the mechanism, the review reject, and how it becomes a standard.",
          ["subscription-bug", "team-prevention", "destroyed-object"]
        ),
        C(
          "D",
          "weak",
          "I would enable Domain Reload so the leak cannot survive Play Mode.",
          "Domain reload hides static bugs in the editor. It does not fix player builds or additive-scene duplicates.",
          []
        ),
      ],
      "A junior subscribes to a static event in OnEnable with a lambda and never unsubscribes. What happens, and how do you catch it in review?"
    ),
  },
  "diag-03-csharp": {
    mcq: block([
      C(
        "A",
        "trap",
        "LINQ is always illegal in Unity. I would rewrite every query to for-loops immediately, because structs never hit the GC.",
        "LINQ is not always the bottleneck, and structs can still live on the heap or box. Measure first.",
        ["value-ref"]
      ),
      C(
        "B",
        "weak",
        "LINQ is slower than for-loops, so I would avoid it in Update to make the game faster.",
        "You named no tool, no allocation, and no proof. 'Slower' is not a diagnosis.",
        []
      ),
      C(
        "C",
        "best",
        "LINQ in Update often allocates iterators, delegates, and boxed value types—but that may not be the frame problem. I would take a development-player baseline, check GC Alloc / GC spikes on the main thread, and only then replace the hot path with a cached list and a for-loop. I would remeasure on a mid-range device. Structs are not 'never GC'.",
        "Measurement first, accurate type model, device validation.",
        ["linq-alloc", "measure-first", "value-ref", "not-always-linq", "alternative", "player-build"]
      ),
      C(
        "D",
        "partial",
        "LINQ uses interfaces so List enumerators can box. I would look at GC Alloc in the Profiler and switch to for-loops.",
        "Right mechanism, but you skipped proving it is the bottleneck and validating on a player build.",
        ["linq-alloc", "measure-first", "value-ref"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "weak",
          "If fps goes up after I delete LINQ, that is proof.",
          "Changing several things or using editor fps is not evidence. You need allocation markers and a controlled change.",
          []
        ),
        C(
          "B",
          "best",
          "GC Alloc per frame on the LINQ callstack in a development player, plus GC.Collect spikes aligning with hitch times. If GPU/UI rebuilds dominate, I would not rewrite the query. After a single replacement I compare Profile Analyzer captures on device.",
          "Names markers, isolation, and the possibility LINQ is innocent.",
          ["measure-first", "not-always-linq", "player-build"]
        ),
        C(
          "C",
          "trap",
          "Deep Profiling timings showing LINQ is 2ms. That number is truth.",
          "Deep Profiling distorts timings. Use it to find 'what', not 'how expensive'.",
          []
        ),
        C(
          "D",
          "partial",
          "I would look at GC Alloc in the editor Profiler window.",
          "Directionally right, but editor is not the device and you did not isolate LINQ from UI/rendering.",
          ["measure-first"]
        ),
      ],
      "What exact evidence would make you confident LINQ is the problem?"
    ),
  },
  "diag-04-solid": {
    mcq: block([
      C(
        "A",
        "trap",
        "InteractableBase → Door, Machine, Tool, Seat, NetworkedSeat, SharedTool. New types subclass the base. Abstract Factory creates them.",
        "This is the hierarchy the question forbade, plus a factory nobody needed.",
        []
      ),
      C(
        "B",
        "best",
        "Small components and segregated interfaces (IInteractable, IOccupiable, IHoldable). An interaction service resolves a target and issues a command. Occupancy and authority live outside the view so tests do not need a scene. I would reject a 12-method interface, a god mediator, and wrapping three prefabs in Abstract Factory.",
        "Composition, ISP, shared-state ownership, and a named anti-pattern.",
        ["composition", "isp", "srp", "shared-object", "poor-use"]
      ),
      C(
        "C",
        "weak",
        "I would use an event bus. Every object listens for Interact and decides if the message is for them.",
        "A global bus for hover/use becomes untraceable and does not solve occupancy.",
        []
      ),
      C(
        "D",
        "partial",
        "Prefer interfaces and composition. Doors and seats are different components. Use VContainer so gameplay does not new() concrete classes.",
        "Solid OOP, but you never said who owns a shared tool when two users grab it, or when a pattern is the wrong tool.",
        ["composition", "dip"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "trap",
          "Whoever's client simulated the grab first. Physics will settle it.",
          "Client-authoritative grabs desync and fight. This is a trap.",
          []
        ),
        C(
          "B",
          "best",
          "The server (or host authority) grants a single occupancy lock. The loser gets a denied result and a fail pose. The rule lives in a domain service, not in the tool's MonoBehaviour, so reconnect and pause can release the lock.",
          "Authority + occupancy + lifetime. That is the lead answer.",
          ["shared-object"]
        ),
        C(
          "C",
          "weak",
          "Parent the tool to the first avatar that touches it.",
          "Parenting is a view trick, not a permission model.",
          []
        ),
        C(
          "D",
          "partial",
          "Use a boolean isBusy on the tool component and an RPC to set it.",
          "Closer, but a boolean on the view races, and you did not define timeout, reconnect, or who arbitrates.",
          ["shared-object"]
        ),
      ],
      "Two users grab the same tool. Who may move it, and where does that rule live?"
    ),
  },
  "diag-05-architecture": {
    mcq: block([
      C(
        "A",
        "weak",
        "One Bootstrap scene with DontDestroyOnLoad managers as singletons, and gameplay scenes for rooms. Most logic stays on MonoBehaviours so artists can see it.",
        "Singletons plus fat MonoBehaviours do not scale to downloaded rooms or tests.",
        ["bootstrap"]
      ),
      C(
        "B",
        "trap",
        "Put all rooms in one additive scene stack loaded from Resources so we always have everything in memory.",
        "Resources plus always-resident rooms will die on mobile. This is not a product architecture.",
        []
      ),
      C(
        "C",
        "best",
        "MonoBehaviours are adapters (lifecycle, animation, physics). Domain rules, occupancy, save, and network commands are plain C# behind a composition root (VContainer/bootstrap). Features get asmdefs. Rooms are Addressable content packs with versioned catalogs—not baked into a god scene. Artists iterate on prefabs and SO configs.",
        "Boundaries, content as data, and a path for UGC/downloadable rooms.",
        ["mb-thin", "asmdef", "bootstrap", "data-driven", "artist-workflow", "testable"]
      ),
      C(
        "D",
        "partial",
        "Split presentation and domain. Use ScriptableObjects for config and Addressables for rooms. Avoid Script Execution Order.",
        "Good instincts, but you did not say what stays out of MonoBehaviour or how assemblies protect a multi-dev team.",
        ["data-driven", "mb-thin"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "The main app ships a lobby and a compatibility window. Rooms become remote content packs with their own catalogs. Simulation code depends on room interfaces, not on specific scene assets. Failed downloads leave the lobby usable.",
          "Downloaded rooms are content + versioning, not a new scene architecture.",
          ["artist-workflow"]
        ),
        C(
          "B",
          "trap",
          "Load whatever bundle the user points at and Execute the scripts inside it.",
          "UGC must not be treated as executable trust. Sandbox data, do not run unknown code.",
          []
        ),
        C(
          "C",
          "weak",
          "Keep using scenes in the player and download nothing; just raise quality settings on PC.",
          "Ignores the size and UGC constraint entirely.",
          []
        ),
        C(
          "D",
          "partial",
          "Use Addressables remote catalogs per room.",
          "Necessary but incomplete: compatibility, failure UX, and domain/content split are missing.",
          ["data-driven"]
        ),
      ],
      "How does the structure change if user-generated rooms download after launch?"
    ),
  },
  "diag-06-profiling": {
    mcq: block([
      C(
        "A",
        "trap",
        "I would optimize it: reduce polygons, turn on occlusion culling, object-pool everything, and switch to ECS. That usually fixes 18 fps.",
        "Keyword dump with no measurement. This is the rejected answer.",
        []
      ),
      C(
        "B",
        "weak",
        "I would open the Profiler in the editor, look for spikes, and fix the most expensive script.",
        "Editor is not the device, and you assumed a CPU script without classifying GPU/memory/UI.",
        ["tools"]
      ),
      C(
        "C",
        "partial",
        "Capture on a development build, see if it is CPU or GPU bound, then optimize rendering or scripts.",
        "Right direction, but no one-change loop, no frame-time vs fps, no art/QA trade-off.",
        ["reproduce", "cpu-gpu", "tools"]
      ),
      C(
        "D",
        "best",
        "Reproduce on a development player of that mid-range device and baseline frame time, not average fps. Classify main thread vs render thread vs GPU. Form one hypothesis (UI rebuilds, transparents, lights, GC, animation). Change one thing, measure again, confirm on device, and check with art/QA that the room still teaches. If it is a content budget, that is a quality-tier decision, not a silent shader rewrite.",
        "Full measurement process plus lead ownership of who changes what.",
        ["reproduce", "cpu-gpu", "tools", "hypothesis", "consistency", "quality-tradeoff"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "Measure: p50/p95 frame time, CPU vs GPU, alloc, setpass, overdraw. Tools: Profiler, Frame Debugger, Memory Profiler, device GPU tooling. Evidence: the limiter's time dominates and matches the room action. Trade-offs: LOD/shadows vs training readability. Validate: same device, before/after captures, visual sign-off.",
          "This is the five-part pressure answer the interviewer asked for.",
          ["tools", "hypothesis", "quality-tradeoff"]
        ),
        C(
          "B",
          "weak",
          "I would measure fps and use the Profiler. If it is faster, we are done.",
          "Average fps hides spikes and skips validation and trade-offs.",
          []
        ),
        C(
          "C",
          "trap",
          "I do not need devices if the editor shows 60 fps after my change.",
          "Editor success is not a ship gate for a mid-range Android room.",
          []
        ),
        C(
          "D",
          "partial",
          "Profiler to see CPU vs GPU, then Frame Debugger if GPU, then test on Android.",
          "Missing the one-change discipline, frame-time consistency, and who owns the visual trade-off.",
          ["cpu-gpu", "tools"]
        ),
      ],
      "What would you measure, which tools, what evidence, which trade-offs, and how do you validate?"
    ),
  },
  "diag-07-rendering": {
    mcq: block([
      C(
        "A",
        "partial",
        "Static batching combines static meshes. GPU instancing is for many copies. Dynamic batching is for small moving meshes. Overdraw is drawing pixels twice.",
        "Definitions without SRP Batcher, failure cases, or why interiors hurt fill rate.",
        ["static-batch", "instancing", "dynamic-batch", "overdraw"]
      ),
      C(
        "B",
        "best",
        "Static batching: static same-material meshes, memory cost, breaks if they move. Dynamic batching: limited CPU path, rarely my 3D-room strategy. Instancing: many copies of one mesh/material. SRP Batcher: fewer SetPass calls when shaders are compatible. Batching fails on unique materials and much transparency. Interiors often die on fill rate from glass, VFX, and UI—even with modest draw calls.",
        "Each technique, failure mode, and the draw-call vs GPU-cost distinction.",
        ["static-batch", "dynamic-batch", "instancing", "srp", "fail-conditions", "overdraw"]
      ),
      C(
        "C",
        "trap",
        "If draw calls are under 100 the GPU cannot be the problem. I would enable all batching modes and GPU instancing globally.",
        "Draw calls are not GPU cost. Enabling everything can increase memory and break materials.",
        []
      ),
      C(
        "D",
        "weak",
        "Use URP Forward+ and the SRP Batcher and the room will scale.",
        "A pipeline slogan is not a diagnosis of overdraw or batching failure.",
        ["srp"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "High SetPass with low triangles often means shader/material incompatibility breaking the SRP Batcher. Confirm in Frame Debugger / Rendering Debugger, then check material property blocks, shader variants, and whether GPU instancing was assumed instead. Glass and particles can still burn fill rate after SetPass looks healthy.",
          "Connects SetPass to SRP Batcher and still remembers transparency.",
          ["srp", "overdraw", "fail-conditions"]
        ),
        C(
          "B",
          "weak",
          "Too many cameras. Disable extra cameras.",
          "Possible but not the first explanation for SetPass vs triangles.",
          []
        ),
        C(
          "C",
          "trap",
          "Increase triangle count so the GPU has real work and SetPass looks amortized.",
          "That makes a fill-rate room worse. Never add work to hide CPU submit cost.",
          []
        ),
        C(
          "D",
          "partial",
          "Materials are not shared. Atlas textures and reduce unique materials.",
          "Useful, but you did not name SRP Batcher confirmation or overdraw.",
          ["fail-conditions"]
        ),
      ],
      "SetPass is high, triangles are low. What is going on in a glassy interior?"
    ),
  },
  "diag-08-memory-assets": {
    mcq: block([
      C(
        "A",
        "trap",
        "Call Resources.UnloadUnusedAssets after every room and Addressables.Release. If memory is still high it is a Unity bug.",
        "UnloadUnusedAssets is not a design, and remaining references are usually your bug.",
        []
      ),
      C(
        "B",
        "best",
        "Compare Memory Profiler snapshots: lobby, room A, room B, back to lobby. Growth that drops is cache; growth that never drops is a leak or leftover reference. Addressables unload when ref count hits zero and nothing else holds a handle, scene, static cache, or instanced material. Release is not the same as GPU memory gone.",
        "Snapshot science plus accurate unload conditions.",
        ["growth-vs-leak", "memory-profiler", "refcount", "unity-refs", "when-unload"]
      ),
      C(
        "C",
        "partial",
        "Use the Memory Profiler and make sure you Release Addressable handles. Watch for static event leaks.",
        "Right tools, missing the growth-vs-leak distinction and hidden native clones.",
        ["memory-profiler", "refcount"]
      ),
      C(
        "D",
        "weak",
        "Memory rises because textures are big. Compress everything and it will unload.",
        "Compression changes usage, not leak behavior, and does not prove unload.",
        []
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "First three: (1) another handle or scene still loaded, (2) a cloned Material/Texture or static cache, (3) the asset duplicated into a second bundle so 'the' bundle unload does not drop the native object. Then I recapture snapshots.",
          "The three production causes, in the order a lead would check.",
          ["refcount", "unity-refs", "when-unload"]
        ),
        C(
          "B",
          "weak",
          "Wait a few frames. The GC will collect it.",
          "Native textures are not managed GC. Waiting is not a diagnosis.",
          []
        ),
        C(
          "C",
          "trap",
          "Restart the app each room change. That is our unload strategy.",
          "Unacceptable for a collaboration product.",
          []
        ),
        C(
          "D",
          "partial",
          "Something still references it. I would search for the texture name in Memory Profiler.",
          "Correct first instinct; missing instance clones and duplicate bundles.",
          ["memory-profiler"]
        ),
      ],
      "You called Addressables.Release but room textures remain. First three causes?"
    ),
  }
};
