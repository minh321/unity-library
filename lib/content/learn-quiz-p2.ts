import { diagnosticQuestions } from "@/lib/content/diagnostic";
import type { LearnTopic } from "@/lib/content/modules";
import type { Choice, Mcq, Question, SkillArea } from "@/lib/trainer/types";

const anti = diagnosticQuestions[0].antiPatterns;

type Letter = Choice["id"];

function choice(id: Letter, tier: Choice["tier"], text: string, why: string): Choice {
  return { id, text, tier, why, conceptIds: tier === "best" ? ["mech", "prod"] : [] };
}

function place(
  bestLetter: Letter,
  parts: { best: string; close: string; wrong: string; trap: string; whyBest: string; whyClose: string; whyWrong: string; whyTrap: string }
): Mcq {
  const letters: Letter[] = ["A", "B", "C", "D"];
  const unused = letters.filter((l) => l !== bestLetter);
  const map: Record<Letter, Choice> = {
    A: choice("A", "weak", "", ""),
    B: choice("B", "weak", "", ""),
    C: choice("C", "weak", "", ""),
    D: choice("D", "weak", "", ""),
  };
  map[bestLetter] = choice(bestLetter, "best", parts.best, parts.whyBest);
  map[unused[0]] = choice(unused[0], "partial", parts.close, parts.whyClose);
  map[unused[1]] = choice(unused[1], "weak", parts.wrong, parts.whyWrong);
  map[unused[2]] = choice(unused[2], "trap", parts.trap, parts.whyTrap);
  return { choices: letters.map((l) => map[l]) };
}

function q(
  id: string,
  area: SkillArea,
  prompt: string,
  bestLetter: Letter,
  parts: {
    best: string;
    close: string;
    wrong: string;
    trap: string;
    whyBest: string;
    whyClose: string;
    whyWrong: string;
    whyTrap: string;
  }
): Question {
  const mcq = place(bestLetter, parts);
  return {
    id,
    mode: "learn",
    area,
    title: prompt,
    prompt,
    difficulty: "senior",
    concepts: [
      { id: "mech", label: "Correct mechanism", synonyms: [], weight: 1, required: true },
      { id: "prod", label: "Production judgment", synonyms: [], weight: 1, required: true },
    ],
    antiPatterns: anti,
    followUps: [],
    spokenAnswer: parts.best,
    deepAnswer: parts.whyBest,
    keyPhrases: [parts.best],
    englishTips: [],
    mcq,
    followUpMcq: mcq,
  };
}

const areaByTopic: Record<string, SkillArea> = {
  "value-ref": "csharp-fundamentals",
  "async-unity": "advanced-csharp",
  solid: "oop-solid",
  boundaries: "unity-architecture",
  lifecycle: "unity-lifecycle",
  process: "profiling",
  batching: "rendering",
  addressables: "assets",
  "shared-interact": "animation",
  canvas: "ui",
  authority: "networking",
  tiers: "cross-platform",
  incident: "debugging",
  req: "requirements",
  "title-gap": "leadership",
  ai: "documentation",
  particles: "rendering",
  "vfx-graph": "rendering",
  "shader-graph": "rendering",
  "render-pipeline": "rendering",
  "vfx-perf": "rendering",
};

export const quizzesPart2: Record<string, (area: SkillArea) => Question[]> = {
  "async-unity": (area) => [
    q(`${area}-lr-1`, area, "What is the real risk of async/await in Unity?", "C", {
      best: "After await, the MonoBehaviour may be destroyed. You must cancel and not touch the view.",
      close: "async is always slower than a coroutine, so avoid it.",
      wrong: "Unity cannot use async because it is single-threaded.",
      trap: "async void in Start is the cleanest way to load Addressables.",
      whyBest: "Lifetime, not syntax, is the production bug.",
      whyClose: "Speed is not the main reason to choose one or the other.",
      whyWrong: "Unity has a sync context; async is used widely. The issue is object lifetime.",
      whyTrap: "async void is fire-and-forget except for fenced event handlers.",
    }),
    q(`${area}-lr-2`, area, "A user leaves a room while a download await is in flight. What should happen?", "B", {
      best: "Cancel with a token tied to destroy/disable, ignore the result, and do not set transforms on a destroyed object.",
      close: "Let the download finish so the cache is warm, then parent it to the next room.",
      wrong: "Kill the app process if the await throws.",
      trap: "Keep the destroyed HUD so the callback has something to update.",
      whyBest: "Cancellation is part of the API. Destroyed views must not be touched.",
      whyClose: "Warm cache is optional; updating a dead view is not.",
      whyWrong: "A thrown await is not an OS-level crash on purpose.",
      whyTrap: "Hiding destroyed objects to service callbacks is a leak.",
    }),
    q(`${area}-lr-3`, area, "When is a coroutine still a good choice?", "A", {
      best: "Simple timed Unity sequences you want to see in the Profiler, with a clear StopCoroutine on disable.",
      close: "Any network download, because WaitUntil is easier than Task.",
      wrong: "Never. async/await replaced coroutines in Unity 6.",
      trap: "Run one infinite coroutine per manager as the game loop.",
      whyBest: "Coroutines are still fine for local timing if lifetime is paired.",
      whyClose: "Downloads need cancellation and error types that Tasks/UniTask handle better.",
      whyWrong: "Coroutines are not removed.",
      whyTrap: "A manager coroutine as Update is architecture smell.",
    }),
    q(`${area}-lr-4`, area, "Which cancellation pattern belongs in a production room client?", "D", {
      best: "A CancellationToken cancelled in OnDisable/OnDestroy, passed into every awaitable load.",
      close: "A boolean isQuitting checked after every await.",
      wrong: "No cancellation; catch Exception and return.",
      trap: "CancellationToken.None so loads always complete for analytics.",
      whyBest: "The token is the contract. Pair it with disable/destroy.",
      whyClose: "A boolean is easy to forget on new awaits and races with destroy.",
      whyWrong: "Swallowing all exceptions hides real faults.",
      whyTrap: "Completing work for a gone user can still mutate dead state.",
    }),
  ],
  solid: (area) => [
    q(`${area}-lr-1`, area, "What does SRP actually protect you from in Unity?", "B", {
      best: "A god MonoBehaviour that changes for input, animation, saves, and networking at once.",
      close: "Having more than one public method on a class.",
      wrong: "Using more than one MonoBehaviour on a prefab.",
      trap: "One interface per field so every line has a single reason to change.",
      whyBest: "SRP is about reasons to change, not method count.",
      whyClose: "Many methods can still share one reason to change.",
      whyWrong: "Composition uses many components on purpose.",
      whyTrap: "Interface explosion is how SOLID gets mocked.",
    }),
    q(`${area}-lr-2`, area, "How do you add Seat, Door, and Tool without a huge inheritance tree?", "C", {
      best: "Small components and segregated interfaces; occupancy lives in a service, not InteractableBase.",
      close: "InteractableBase with virtual Use(), then Door, Seat, NetworkedSeat.",
      wrong: "One enum InteractType and a 40-case switch in a manager.",
      trap: "Abstract Factory plus Decorator plus Command for each prefab.",
      whyBest: "Composition + ISP. Shared rules stay out of the view.",
      whyClose: "That is the hierarchy the interview forbids.",
      whyWrong: "The switch is OCP failure. Every new type edits the core.",
      whyTrap: "Patterns stacked on three prefabs are decoration.",
    }),
    q(`${area}-lr-3`, area, "When is a pattern the wrong tool?", "A", {
      best: "When there is no real variation—three prefabs do not need Abstract Factory.",
      close: "When the junior has not heard of the pattern yet.",
      wrong: "Never. More patterns always mean better architecture.",
      trap: "Service Locator in Update is fine if it is cached.",
      whyBest: "Patterns answer variation. No variation, no pattern.",
      whyClose: "Teaching is good; that is not the design test.",
      whyWrong: "Overuse is a review reject.",
      whyTrap: "A locator in Update is hidden coupling even if cached.",
    }),
    q(`${area}-lr-4`, area, "Two users grab one tool. Where does the rule live?", "D", {
      best: "A domain occupancy service with server (or host) authority, not the tool MonoBehaviour.",
      close: "A bool busy on the tool, set by whoever touches it first.",
      wrong: "Parent the tool to the first avatar. Hierarchy is ownership.",
      trap: "Both clients simulate physics; the later packet wins.",
      whyBest: "Authority and occupancy are not view-component problems.",
      whyClose: "A local bool races and does not survive reconnect.",
      whyWrong: "Parenting is presentation, not permission.",
      whyTrap: "Dual physics authority is the failure mode.",
    }),
  ],
  boundaries: (area) => [
    q(`${area}-lr-1`, area, "What should not live in MonoBehaviour in a simulation product?", "B", {
      best: "Occupancy rules, save schema, invite permissions, and other domain logic you must unit-test.",
      close: "Animation event names, because artists own those.",
      wrong: "Any Awake/Start code. Use plain C# for transforms too.",
      trap: "Nothing. If it is not on a MonoBehaviour, artists cannot find it.",
      whyBest: "MB is an adapter. Rules should not need a Transform to exist.",
      whyClose: "Animation events can stay as adapters; they should not own business rules.",
      whyWrong: "Transforms and physics callbacks belong on MB.",
      whyTrap: "Hiding rules from testability is not an artist workflow.",
    }),
    q(`${area}-lr-2`, area, "What is a composition root in Unity?", "C", {
      best: "A bootstrap scene or DI container that owns service lifetimes, instead of scattered DontDestroyOnLoad singletons.",
      close: "The first scene in Build Settings, whatever it contains.",
      wrong: "Script Execution Order set so managers always win.",
      trap: "A static GameManager everyone references from Update.",
      whyBest: "One place owns lifetimes. Execution order is not a root.",
      whyClose: "The first scene is only a root if you design it that way.",
      whyWrong: "Execution order is a patch and a long-term lie.",
      whyTrap: "That is the singleton smell the lesson warned about.",
    }),
    q(`${area}-lr-3`, area, "User-generated rooms download after launch. How does architecture change?", "A", {
      best: "Rooms are versioned content packs. Simulation depends on room interfaces, not baked scene assets.",
      close: "Add more scenes to the player build so every room is local.",
      wrong: "Execute scripts from the downloaded bundle as plugins.",
      trap: "Put rooms in Resources so Addressables is not required.",
      whyBest: "Downloaded rooms are content + compatibility, not a new scene graph.",
      whyClose: "That explodes player size and still does not solve UGC.",
      whyWrong: "Untrusted content is not executable trust.",
      whyTrap: "Resources is the anti-pattern for hundred-MB rooms.",
    }),
    q(`${area}-lr-4`, area, "Why bother with assembly definitions?", "D", {
      best: "They enforce feature boundaries, shrink compile surface, and stop UI from referencing room internals.",
      close: "They make IL2CPP faster at runtime.",
      wrong: "They are only for asset-store publishers.",
      trap: "One asmdef for the whole Assets folder is enough.",
      whyBest: "Boundaries are for people and compile times.",
      whyClose: "Asmdefs do not magically speed the player loop.",
      whyWrong: "Product teams need them too.",
      whyTrap: "One giant asmdef is the same as none.",
    }),
  ],
  lifecycle: (area) => [
    q(`${area}-lr-1`, area, "How should event subscriptions be paired?", "B", {
      best: "Subscribe in OnEnable, unsubscribe in OnDisable, with a named method—not a lambda on a static event.",
      close: "Subscribe in Awake, unsubscribe in OnDestroy.",
      wrong: "Subscribe in Start once; Unity cleans it up.",
      trap: "Lambdas are fine on static lobby events because they look clean.",
      whyBest: "Enable/disable can happen without destroy. Lambdas cannot be removed.",
      whyClose: "OnDestroy misses disable, and Awake is the wrong place for others' objects.",
      whyWrong: "Unity does not auto-unsubscribe your static events.",
      whyTrap: "This is the leak the lesson used as the example.",
    }),
    q(`${area}-lr-2`, area, "What is wrong with Script Execution Order as architecture?", "C", {
      best: "It hides dependency order. A bootstrap/composition root should initialize services instead.",
      close: "It does not work in IL2CPP.",
      wrong: "It is deprecated in URP.",
      trap: "Put every manager at -100 so bugs cannot happen.",
      whyBest: "Order numbers are a patch. They will not scale across additive rooms.",
      whyClose: "It works; it is just a bad design.",
      whyWrong: "Unrelated to URP.",
      whyTrap: "Magic numbers do not replace a root.",
    }),
    q(`${area}-lr-3`, area, "A phone call pauses a collaborative client. What must you treat pause as?", "A", {
      best: "A networking event: timeout or release occupancy, keep a session token, snapshot on resume.",
      close: "A graphics event: lower quality until focus returns.",
      wrong: "Nothing. Unity keeps simulating in the background on iOS.",
      trap: "Hold the shared tablet lock so the user does not lose their place.",
      whyBest: "Mobile suspend is session + occupancy, not just mute.",
      whyClose: "Quality is optional; locks are mandatory.",
      whyWrong: "iOS will suspend you.",
      whyTrap: "Holding a lock blocks colleagues.",
    }),
    q(`${area}-lr-4`, area, "Additive scene load duplicated a callback. Likely cause?", "D", {
      best: "A second bootstrap/service instance subscribed again because DontDestroyOnLoad was used as architecture.",
      close: "FixedUpdate running twice as fast.",
      wrong: "URP rendering the scene twice.",
      trap: "C# events are multicast so this is unavoidable.",
      whyBest: "Weak bootstrap + additive load = duplicate services.",
      whyClose: "Timestep is not the duplicate-subscribe bug.",
      whyWrong: "A camera stack is a different problem.",
      whyTrap: "Multicast is fine if you pair enable/disable and have one owner.",
    }),
  ],
  process: (area) => [
    q(`${area}-lr-1`, area, "What is the first step when a mid-range phone is at 18 fps?", "C", {
      best: "Reproduce on a development player of that device and baseline frame time, not average fps.",
      close: "Open the editor Profiler and fix the biggest script.",
      wrong: "Switch the project to ECS.",
      trap: "Optimize it: pooling, occlusion, fewer polygons, all at once.",
      whyBest: "Reproduce, baseline, classify. Editor is not the device.",
      whyClose: "You assumed a CPU script without classifying GPU.",
      whyWrong: "A rewrite is not a diagnosis.",
      whyTrap: "Keyword dump with five changes. Rejected in the diagnostic.",
    }),
    q(`${area}-lr-2`, area, "How do you know CPU-bound vs GPU-bound?", "B", {
      best: "Compare main-thread CPU, render thread, and GPU time on a player build. Waiting on GPU means GPU-bound.",
      close: "If fps is under 30 it is GPU. If scripts look busy it is CPU.",
      wrong: "Count draw calls. Over 100 means GPU-bound.",
      trap: "Deep Profiling milliseconds are the truth.",
      whyBest: "Compare the three times on device.",
      whyClose: "fps is not a classifier.",
      whyWrong: "Draw calls are submit cost, not fill rate.",
      whyTrap: "Deep Profiling distorts timings.",
    }),
    q(`${area}-lr-3`, area, "You formed a hypothesis. What next?", "A", {
      best: "Change one thing, remeasure, then confirm on the device and with art/QA for visual regressions.",
      close: "Change batching, lights, and UI together so the win is bigger.",
      wrong: "Ship if the editor capture looks better.",
      trap: "Ask the artist to redo the whole room before measuring.",
      whyBest: "One controlled change is the scientific loop.",
      whyClose: "Five changes teach you nothing.",
      whyWrong: "Editor is not the gate.",
      whyTrap: "Content may be the fix, but only after you classify the limiter.",
    }),
    q(`${area}-lr-4`, area, "Glass and dust, modest draw calls, GPU hot. What is the limiter class?", "D", {
      best: "Fill rate / overdraw from transparents and particles, not batch count.",
      close: "Too many SetPass calls. Enable GPU instancing globally.",
      wrong: "Main-thread C# in Update.",
      trap: "Add realtime lights so the GPU has 'real work'.",
      whyBest: "Interiors die on stacked transparents. Draw calls can look fine.",
      whyClose: "Instancing does not fix fill rate.",
      whyWrong: "GPU hot with idle scripts is not a C# story.",
      whyTrap: "Extra lights make fill rate worse.",
    }),
  ],
  batching: (area) => [
    q(`${area}-lr-1`, area, "What problem does the SRP Batcher actually solve?", "B", {
      best: "It reduces SetPass cost when shader variants are compatible, even if materials differ slightly.",
      close: "It combines meshes like static batching.",
      wrong: "It removes overdraw on transparent glass.",
      trap: "If SRP Batcher is on, draw-call count equals GPU cost.",
      whyBest: "Shader compatibility, not identical materials, is the point.",
      whyClose: "That is static batching / combining, a different tool.",
      whyWrong: "Overdraw is a GPU fill problem.",
      whyTrap: "The lesson's core distinction: submit cost vs GPU cost.",
    }),
    q(`${area}-lr-2`, area, "When does static batching fail for a 3D room?", "A", {
      best: "Objects move, use unique materials, or the memory cost of combining is too high.",
      close: "Whenever URP is enabled.",
      wrong: "When LODs exist.",
      trap: "Never. Mark everything static.",
      whyBest: "Static means static. Unique materials break the combine.",
      whyClose: "URP still static-batches.",
      whyWrong: "LODs work with static shells.",
      whyTrap: "Marking moving furniture static is a bug.",
    }),
    q(`${area}-lr-3`, area, "GPU instancing is the right tool when…", "C", {
      best: "You have many copies of the same mesh and material (chairs, plants), with instancing enabled on the shader.",
      close: "Every unique hero prop in the room.",
      wrong: "UI canvases.",
      trap: "Transparent glass stacks, because they share a shader.",
      whyBest: "Same mesh + material, many copies.",
      whyClose: "Unique meshes do not instance.",
      whyWrong: "UI is a different batching story.",
      whyTrap: "Transparency still overdraws even if instanced.",
    }),
    q(`${area}-lr-4`, area, "A scalable URP quality strategy is primarily…", "D", {
      best: "Named budgets (resolution, shadows, LOD, lights, post) with owners, measured on low and high devices.",
      close: "Forward+ on every platform because it is newer.",
      wrong: "One Ultra preset so training looks correct.",
      trap: "Let artists pick whatever looks good on their PC.",
      whyBest: "Tiers are budgets, not a dropdown nobody measures.",
      whyClose: "A path is not a budget.",
      whyWrong: "The job requires mid-range devices.",
      whyTrap: "Artist PC is not the matrix.",
    }),
  ],
  addressables: (area) => [
    q(`${area}-lr-1`, area, "When can an Addressable asset actually be unloaded?", "C", {
      best: "Ref count is zero and nothing else holds a handle, scene, static cache, or instanced material.",
      close: "Right after Addressables.Release returns.",
      wrong: "When GC.Collect runs.",
      trap: "Never on mobile; keep every room resident.",
      whyBest: "Release is necessary, not sufficient. Snapshot to prove it.",
      whyClose: "Native memory can remain if something cloned the asset.",
      whyWrong: "Textures are native, not managed GC.",
      whyTrap: "Resident rooms will OOM.",
    }),
    q(`${area}-lr-2`, area, "Why not Resources for hundred-megabyte rooms?", "B", {
      best: "Resources bakes into the player. Rooms belong in remote Addressable packs with a catalog and compatibility window.",
      close: "Resources cannot load textures.",
      wrong: "Addressables cannot work offline at all.",
      trap: "Put rooms in Resources and call UnloadUnusedAssets after each visit.",
      whyBest: "Delivery + versioning, not a folder convention.",
      whyClose: "Resources loads textures. Size is the issue.",
      whyWrong: "A lobby can stay offline-capable; rooms resume.",
      whyTrap: "UnloadUnusedAssets is not a design.",
    }),
    q(`${area}-lr-3`, area, "Download dies at 80%. User reopens the app. Best behavior?", "A", {
      best: "Resume the same content version, verify integrity, finish or stay in lobby. Never load a half-written pack.",
      close: "Start from zero every launch so the file is clean.",
      wrong: "Load the 80% bundle so the user is not blocked.",
      trap: "Crash on purpose to force a store reinstall.",
      whyBest: "Resume + checksum + compatibility. Lobby stays usable.",
      whyClose: "Punishes mobile users.",
      whyWrong: "Corrupt content crashes worse than a retry.",
      whyTrap: "Not a product behavior.",
    }),
    q(`${area}-lr-4`, area, "How do duplicate meshes sneak into two bundles?", "D", {
      best: "The same mesh is pulled into two groups because it was not in a shared bundle. Memory Profiler shows doubles.",
      close: "Addressables always duplicates; live with it.",
      wrong: "Static batching copies meshes at runtime into bundles.",
      trap: "Put the mesh in Resources to share it across groups.",
      whyBest: "Grouping is the fix. Prove with snapshots.",
      whyClose: "False. Layout can be corrected.",
      whyWrong: "Batching is not how duplicates enter catalogs.",
      whyTrap: "Resources makes the player bigger.",
    }),
  ]
};
