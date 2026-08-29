import type { Article, Block } from "@/lib/encyclopedia/types";

function h2(id: string, text: string): Block {
  return { type: "h2", id, text };
}
function h3(id: string, text: string): Block {
  return { type: "h3", id, text };
}
function p(text: string): Block {
  return { type: "p", text };
}
function ul(items: string[]): Block {
  return { type: "ul", items };
}
function ol(items: string[]): Block {
  return { type: "ol", items };
}
function callout(tone: "tip" | "warn" | "honest" | "lead", title: string, text: string): Block {
  return { type: "callout", tone, title, text };
}
function table(headers: string[], rows: string[][]): Block {
  return { type: "table", headers, rows };
}
function qa(q: string, a: string): Block {
  return { type: "qa", q, a };
}

export const ebookArticlesA: Article[] = [
  {
    id: "ebook",
    title: "Unity 6.0 ebook — cover",
    group: "ebook",
    summary:
      "A reading-order companion to the Unity 6.0 (6000.0) User Manual and Scripting API, plus Unity’s official programming e-books. Not a replacement for the docs — a map a Team Lead can actually finish.",
    readMinutes: 8,
    tags: ["ebook", "Unity 6", "Manual", "Scripting API"],
    related: ["ebook-manual", "ebook-scripting", "ebook-api-core", "ebook-unity-books", "study-path"],
    suggestedQuestions: [
      "How should I read this ebook versus the interview articles?",
      "What is the difference between the Manual and the Scripting API?",
      "Which Unity official e-book should I download first?",
    ],
    blocks: [
      p("This wing is an ebook: ordered chapters that follow the Unity 6.0 User Manual and the Unity 6.0 Scripting API. Interview articles elsewhere in the library compress judgment. These chapters walk the official table of contents so you know what exists, what a lead must name, and which page to open when the trainer refuses to invent an API."),
      callout(
        "tip",
        "Primary sources",
        "User Manual: https://docs.unity3d.com/6000.0/Documentation/Manual/index.html — concepts, workflows, feature comparison. Scripting API: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/index.html — classes, methods, examples. If this encyclopedia and a 6000.0 page disagree, the page wins."
      ),
      h2("how-to-read", "How to read it"),
      ol([
        "This cover, then Manual atlas, then Programming in Unity, then Core types — that is Volume I",
        "Player loop and Awaitable, then Graphics, World, UI, Content, Ship — Volume II",
        "Official Unity e-books last: they are PDFs Unity wrote for teams, not Manual pages",
        "When a heading is fuzzy, Ask the trainer. When an API is unnamed here, open the Scripting API link on the article — do not guess",
      ]),
      h2("three-layers", "Three layers of Unity documentation"),
      table(
        ["Layer", "What it is", "Lead use"],
        [
          ["User Manual (6000.0)", "Workflows, feature comparison, upgrade notes", "Choose a pipeline, explain a system, plan a migration"],
          ["Scripting API (6000.0)", "UnityEngine / UnityEditor types, signatures, examples", "Verify a method exists in this version before you say it in interview"],
          ["Official e-books", "C# style, SOLID/patterns, ScriptableObjects, DOTS", "Team standards and architecture language Unity itself publishes"],
        ]
      ),
      h2("toc", "Table of contents"),
      ol([
        "Cover (this page)",
        "New in Unity 6.0 — what this LTS actually added",
        "Manual atlas — every featured Manual section with a 6000.0 URL",
        "Programming in Unity — the Manual’s scripting book",
        "Scripting API: core types — Object, GameObject, Component, MonoBehaviour, Transform",
        "Player loop, time, Awaitable — execution order and async",
        "Graphics and lighting — choose a pipeline, then light a room",
        "World simulation — animation, physics, audio, 2D, VFX",
        "UI and input — uGUI, UI Toolkit, Input System",
        "Content and packages — assets, Addressables, Package Manager",
        "Ship and analyze — platforms, XR, multiplayer, Profiler",
        "Official Unity e-books — download list Unity links from the Manual",
      ]),
      h2("not-this", "What this ebook is not"),
      ul([
        "Not a paste of every Manual paragraph — Unity already wrote that",
        "Not a claim that you have read every page",
        "Not a substitute for the VFX / Technical Artist wing when the panel is lookdev",
        "Not a license to quote APIs that are not on a 6000.0 Scripting API page",
      ]),
      qa(
        "Do I memorize the Scripting API?",
        "No. Memorize the types a lead names without looking (GameObject, MonoBehaviour, Transform, Time, SceneManager, Awaitable, Object.Destroy) and the rule: unknown APIs are false until 6000.0 confirms them."
      ),
    ],
  },
  {
    id: "ebook-unity6",
    title: "Ch. 1 — New in Unity 6.0",
    group: "ebook",
    summary:
      "Unity 6.0 is LTS: 2023.1 + 2023.2 + 6.0 Preview, plus 6.0 itself. GPU Resident Drawer, URP in the Engine Manual, Multiplayer Center, Awaitable-era programmer tools, VFX Graph 17 headlines.",
    readMinutes: 12,
    tags: ["Unity 6", "LTS", "upgrade", "what's new"],
    related: ["ebook", "ebook-graphics", "ebook-ship", "render-pipelines"],
    suggestedQuestions: [
      "What must I mention if they ask what Unity 6 changed for rendering?",
      "What is Multiplayer Center for?",
      "If I upgrade from 2022 LTS, where do I start?",
    ],
    blocks: [
      p("The Unity 6.0 User Manual opens: Unity 6.0 is a long-term supported release. It contains features from Unity 2023.1 Tech, 2023.2 Tech, and Unity 6.0 Preview. If a panel says “Unity 6,” they mean this generation — not a marketing synonym for URP."),
      callout(
        "lead",
        "Upgrade first",
        "If the company project is 2022 LTS, the interview-correct first page is the Upgrade Guide to Unity 6.0, not a feature reel. Read known issues in the 6.0 release notes. Do not promise a painless Addressables + URP + NGO bump in a sprint."
      ),
      h2("highlights", "Highlights the Manual itself advertises"),
      ul([
        "Rendering: scalable visuals, lighting, VFX — GPU Resident Drawer, Render Graph in URP 17, Shader Graph and VFX Graph updates",
        "Multiplayer: Multiplayer Center, Widgets, Multiplayer Services package, NGO 2.x / Netcode for Entities",
        "Platforms: mobile and mobile-browser runtime, visionOS, existing Mobile + PC matrix",
        "Runtime AI: Sentis for on-device models — a product risk, not a default architecture",
        "Productivity: Profiler/Memory Profiler, ProBuilder, Cinemachine, UI Toolkit",
      ]),
      h2("graphics-6", "Graphics you should be able to name"),
      p("URP documentation moved into the Unity Engine Manual in 6.0 (lighting for URP lives under Lighting, not a separate URP-only site). GPU Resident Drawer automatically uses BatchRendererGroup to instance Mesh Renderers — Forward+, compute, SRP Batcher, not particles. GPU occlusion culling of compatible instances. Volume framework CPU optimizations. Render Graph compilation cache. Progressive GPU Lightmapper is fully supported (from 2023.2). Dynamic shader variant loading / streaming of shader chunks. Split Graphics Jobs threading mode."),
      h2("vfx-sg", "Shader Graph and VFX Graph in this LTS"),
      p("Shader Graph: production-ready samples, Canvas/sprite tint disable, property UI cleanup. VFX Graph 17 / 6.0 Preview: URP camera buffer access, ShaderKeyword from Shader Graph, strip indirect draw, per-particle strip sorting, blackboard attributes, instancing with exposed textures, collision events, profiling panels. Deep dive lives in the VFX wing; this chapter only marks that they are first-class 6.0 Manual topics."),
      h2("multiplayer-6", "Multiplayer Center"),
      p("Unity 6.0 added an in-Editor Multiplayer Center: parameters in, suggested packages and templates out. Widgets wrap Lobby, Relay, Vivox, Multiplay. Multiplayer Services package groups session setup (P2P, dedicated, distributed authority) and talks to Netcode for GameObjects, Netcode for Entities, and Unity Transport. You still design authority. A wizard is not occupancy."),
      h2("programmer", "Programmer-facing 6.0"),
      ul([
        "C# line numbers in player call stacks (from 2023.1)",
        "Awaitable as the Unity-aware async type (Manual: Asynchronous programming with the Awaitable class)",
        "Entities / DOTS remain an option, not the default for a 30-user room product",
        "Test Framework and Version Control sections in What’s New — treat them as delivery, not trivia",
      ]),
      h2("whats-new-index", "What’s New areas (official list)"),
      p("The New in Unity 6.0 page indexes: 2D, Accessibility, Adaptive Performance, Asset bundles, Audio, Editor and Workflow, Enterprise, Entities, Graphics, Multiplayer, Package Manager, Platforms, Physics, Productivity tools, Programmer tools, Ray tracing API, Sentis, Shader Graph, SpeedTree, Splines, Terrain, Test Framework, Version Control, Visual Scripting, VFX Graph, XR. You do not memorize every bullet. You know the index exists and can open the area they asked about."),
      qa(
        "They ask: Unity 6 or stay on 2022 LTS?",
        "For a new Mobile + PC collaboration product: 6.0 LTS + URP is the adult default. For a live 2022 title: upgrade guide, package compatibility (Addressables, NGO, URP), a spike on GPU Resident Drawer and Render Graph custom passes, then a versioned cut. Never “Unity 6 is free performance.”"
      ),
    ],
  },
  {
    id: "ebook-manual",
    title: "Ch. 2 — Manual atlas",
    group: "ebook",
    summary:
      "The Unity 6.0 User Manual featured contents, as Unity lists them on the landing page, with 6000.0 URLs. This is the map of the book, not the book.",
    readMinutes: 10,
    tags: ["Manual", "atlas", "table of contents"],
    related: ["ebook", "ebook-scripting", "ebook-graphics", "ebook-simulation", "resources"],
    suggestedQuestions: [
      "Where does lighting live in the Unity 6 Manual?",
      "Is VFX Graph in the Engine Manual or a package manual?",
      "Which Manual section covers UI Toolkit?",
    ],
    blocks: [
      p("Unity’s 6.0 Manual homepage is not a flat wiki dump. Featured content is the spine of this ebook. Package manuals (VFX Graph 17, Shader Graph 17, Addressables 2.x, NGO 2.x) sit beside it. A lead says which book they opened."),
      h2("featured", "Featured Manual sections (Unity’s list)"),
      table(
        ["Section", "What Unity says it covers", "Open"],
        [
          ["Animation", "Avatar, clips, state machines", "AnimationOverview.html"],
          ["Audio", "Clips, sources, listeners, import", "AudioOverview.html"],
          ["2D", "Gameplay, sprites, 2D physics", "Unity2D.html"],
          ["Lighting", "Realistic or stylized lighting", "lighting-configuration-workflow.html"],
          ["Multiplayer", "Packages and services", "multiplayer.html"],
          ["Package management", "Explore, install, update packages", "upm-ui.html"],
          ["Physics", "3D motion, mass, gravity, collisions", "PhysicsOverview.html"],
          ["Platform development", "Build targets", "PlatformSpecific.html"],
          ["Rendering", "Choose a pipeline; custom rendering and post", "choose-a-render-pipeline.html"],
          ["Scripting", "Programming in the Editor", "scripting.html"],
          ["UI", "UI toolkits in the Editor", "UIToolkits.html"],
          ["Unity services", "Cloud, ads, build, multiplayer services", "UnityServices.html"],
          ["Visual effects", "Particles, lens flare, full-screen", "ChoosingYourParticleSystem.html"],
          ["XR", "AR / MR / VR", "XR.html"],
        ]
      ),
      p("Prefix every file with https://docs.unity3d.com/6000.0/Documentation/Manual/ — the links on this article’s Unity 6 documentation list are the live pages."),
      h2("also-read", "Chapters the homepage undersells"),
      ul([
        "New in Unity 6.0 and Upgrade to Unity 6.0 — start of any migration conversation",
        "Working in Unity: GameObjects, components, Prefabs, scenes, tags/layers",
        "Asset workflow: import, serialization, Addressables (package)",
        "Analysis: Profiler, Memory Profiler, Frame Debugger, Rendering Debugger",
        "Best practice guides — Unity Support engineers; UI Toolkit intro lives here too",
      ]),
      h2("packages-vs-engine", "Engine Manual vs package docs"),
      p("Unity 6 moved a lot of URP into the Engine Manual. VFX Graph and Shader Graph remain package manuals (17.x for this LTS). Addressables, Netcode, Input System, Test Framework, Memory Profiler are packages. Interview failure: quoting a 2021 package page for a 6.0 project. Always check the version picker: Unity 6.0 (6000.0)."),
      h2("extra", "Additional resources Unity lists on the Manual home"),
      ul([
        "Best practice guides",
        "Unity Discussions",
        "Unity Knowledge Base",
        "Tutorials / Unity Learn",
        "Asset Store help",
      ]),
      callout("warn", "Do not fake coverage", "This atlas is so you can find the chapter. Saying “I know the whole Manual” is an overclaim. Say which section you opened last week."),
    ],
  },
  {
    id: "ebook-scripting",
    title: "Ch. 3 — Programming in Unity (Manual)",
    group: "ebook",
    summary:
      "The Manual’s scripting book: get started, tools, object-oriented development, compilation, optimization, debugging — plus Unity programming best practices (null, GC, Update, threads, domain reload).",
    readMinutes: 14,
    tags: ["scripting", "C#", "best practices", "compilation"],
    related: ["ebook-api-core", "ebook-api-loop", "csharp", "unity-architecture", "ebook-unity-books"],
    suggestedQuestions: [
      "What does the Manual put under object-oriented development?",
      "Why is myGameObject == null a special operator?",
      "When do I use asmdef versus #if UNITY_EDITOR?",
    ],
    blocks: [
      p("Programming in Unity (Manual) is not “learn C#.” It is how Unity turns scripts into player behavior. Unity’s own TOC: Get started; Environment and tools; Object-oriented development; Compilation and code reload; Code optimization; Debugging and diagnostics. The same page links Unity’s official e-books (style guide, SOLID, ScriptableObjects, DOTS)."),
      h2("oop-toc", "Object-oriented development (Manual TOC)"),
      ul([
        "Fundamental Unity types — Object, GameObject, Component significance in Editor and runtime",
        "Managing update and execution order — lifecycle callbacks and the Player loop",
        "Managing time and frame rate — Time, unscaled, fixed timestep",
        "Coroutines — split work across frames",
        "UnityWebRequest — HTTP",
        "Unity Properties — generic property access",
        "Programming with mathematics — vectors, random, trig APIs",
      ]),
      p("The Manual states the trade: MonoBehaviours encapsulate logic and data together — convenient, costly at huge scale. Data-oriented / ECS is the other philosophy. They are not mutually exclusive. For this product (rooms, not 10k units), object-oriented + jobs where it hurts is the default. Do not pitch a full ECS rewrite in a Team Leader intro."),
      h2("best-practices", "Unity programming best practices (read this page)"),
      h3("null", "UnityEngine.Object null"),
      p("Types inheriting UnityEngine.Object use a custom ==. myGameObject == null can be true after Destroy while a C# wrapper still exists. Use == null to treat destroyed objects as gone. Use ReferenceEquals for actual C# null. Do not cache components across scene unloads without a guard. Do not pin large assets in statics. Runtime: Object.Destroy, not DestroyImmediate."),
      h3("gc", "GC and allocations"),
      p("No per-frame List news, no LINQ on Update/FixedUpdate, cache GetComponent in Awake, cache WaitForSeconds, avoid string concat in hot paths, avoid reflection. Non-alloc APIs where they exist. Prove with GC Alloc on a development player."),
      h3("update", "Update is a tax"),
      p("Each active Update/FixedUpdate/LateUpdate has native/managed overhead. Many idle Updates is a junior architecture. Mitigations the Manual names: fewer active Updates, a custom update manager, customize PlayerLoop, Jobs/Burst/NativeArray on the hot path, or ECS at true scale."),
      h3("threads", "Main thread"),
      p("Most UnityEngine and UnityEditor APIs are main-thread only. Do not touch Transforms from a job without the transform API meant for jobs. Never Task.Wait / Result on the main thread. Long async: Awaitable. Short parallel: job system + Burst."),
      h3("compile", "Compilation"),
      p("Assembly Definitions isolate Editor vs runtime and shrink rebuilds. #if UNITY_EDITOR (and platform symbols) strip regions. Domain reload on Play Mode is slow; disabling it requires you to reset static state. Managed stripping removes unused IL — AlwaysLinkAssemblyAttribute if RuntimeInitializeOnLoad lives in a package nobody references."),
      h2("compile-toc", "Compilation and code reload (Manual)"),
      ul([
        "Scripting backends — Mono vs IL2CPP",
        "Burst — HPC# subset, jobs",
        "Conditional compilation — scripting symbols",
        "Assembly definitions",
        "Managed code stripping",
      ]),
      qa(
        "Finalizers in runtime Unity?",
        "The best-practices page says do not. They run off the main thread, non-deterministically, and can halt the player. IDisposable + Destroy is the Unity pattern."
      ),
    ],
  },
  {
    id: "ebook-api-core",
    title: "Ch. 4 — Scripting API: core types",
    group: "ebook",
    summary:
      "UnityEngine.CoreModule: Object, GameObject, Component, Behaviour, MonoBehaviour, Transform, ScriptableObject. Signatures and failure modes from the 6000.0 Scripting API.",
    readMinutes: 14,
    tags: ["Scripting API", "GameObject", "MonoBehaviour", "Transform"],
    related: ["ebook-scripting", "ebook-api-loop", "lifecycle", "csharp"],
    suggestedQuestions: [
      "What is still true after Destroy on a MonoBehaviour?",
      "How do I construct a GameObject with components without AddComponent later?",
      "Why can’t I remove Transform?",
    ],
    blocks: [
      p("The Scripting API is organised by class. For most runtime work the left rail starts at UnityEngine, especially UnityEngine.CoreModule — “basic classes required for Unity to function. This module cannot be disabled.” Open the class page before you quote a method in interview."),
      h2("object", "Object"),
      p("UnityEngine.Object is the native-backed base. Destroy schedules destruction; the C# wrapper becomes a fake-null. Instantiate copies. FindObjectsByType is the modern finder (FindObjectOfType is the old name — check 6000.0). DontDestroyOnLoad is a lifetime hammer, not an architecture. hideFlags, name live here."),
      h2("gameobject", "GameObject"),
      p("A scene object. Always has a Transform you cannot remove. Constructors: new GameObject(), new GameObject(name), new GameObject(name, params Type[] components) — the third adds those components plus Transform. Created in the active scene (SceneManager.GetActiveScene). Constructing with no scene (static init, some Edit Mode) can land in a preview/internal scene — MoveGameObjectToScene if you must. SetActive, layer, tag, scene, AddComponent<T>, GetComponent, GetComponentsInChildren. CompareTag beats tag string churn if you are in a hot path."),
      h2("component-behaviour", "Component and Behaviour"),
      p("Component is “everything attached to a GameObject.” GetComponent lives here. Behaviour adds enabled. Renderer, MonoBehaviour, and many systems inherit this split. isActiveAndEnabled (on Behaviour/MonoBehaviour) is not the same as enabled: the GameObject must be active in the hierarchy and OnEnable must have run."),
      h2("monobehaviour", "MonoBehaviour"),
      p("The Scripting API: lifecycle functions; always a Component; AddComponent to create; Destroy / destroying the GameObject deletes it. After destroy, the C# object remains until GC but == null is true. It does not support ?. or ?? the way a normal C# object does — fake-null bites there. Serialization follows Unity’s serialization rules plus a MonoScript reference. enabled false in the Inspector stops event functions. Messages: Awake, OnEnable, Start, Update, LateUpdate, FixedUpdate, OnDisable, OnDestroy, OnApplicationPause, coroutines."),
      h2("transform", "Transform"),
      p("Position, rotation, scale. GameObject.transform is read-only as a property — you cannot assign a different Transform. parent, SetParent(worldPositionStays), local vs world, Translate/Rotate, GetChild, hierarchy walk. Changing parent is not occupancy. Do not Animate by writing transform.position in Update on a networked object you do not own."),
      h2("scriptableobject", "ScriptableObject"),
      p("Project-level UnityEngine.Object without a scene Transform. CreateInstance at runtime, assets via CreateAssetMenu. Data and sometimes strategy — see Unity’s ScriptableObjects e-book. They are not ECS components. They survive scene load if referenced; they leak if static-held."),
      h2("also-core", "Other CoreModule names a lead should recognize"),
      ul([
        "Application — quit, focus, version, isPlaying",
        "Time — deltaTime, timeScale, fixedDeltaTime",
        "Camera — through which the player views the world",
        "Debug — Log, Assert, DrawLine",
        "Coroutine, CustomYieldInstruction, WaitForSeconds",
        "Awaitable / AwaitableCompletionSource — Unity 6 async",
        "RuntimeInitializeOnLoadMethodAttribute — boot without a scene object",
        "DefaultExecutionOrder, DisallowMultipleComponent, AddComponentMenu, ContextMenu",
        "AsyncOperation, Resources, Caching",
        "CommandBuffer, ComputeBuffer, ComputeShader, BatchRendererGroup",
        "CollectionPool / DictionaryPool — reuse collections",
      ]),
      qa(
        "new GameObject in a static constructor?",
        "The GameObject ctor page warns you may not be in a valid scene. Prefer RuntimeInitializeOnLoad AfterSceneLoad, a bootstrap scene, or a composition root. DontDestroyOnLoad after you have a real scene object."
      ),
    ],
  },
  {
    id: "ebook-api-loop",
    title: "Ch. 5 — Player loop, time, Awaitable",
    group: "ebook",
    summary:
      "Event function execution order, Time/fixed timestep, coroutines vs Awaitable vs Task, RuntimeInitializeOnLoad sequence. Unity 6 Manual + Scripting API together.",
    readMinutes: 13,
    tags: ["execution order", "Awaitable", "Time", "PlayerLoop"],
    related: ["ebook-api-core", "ebook-scripting", "lifecycle", "csharp"],
    suggestedQuestions: [
      "Where do .NET Tasks resume versus Awaitable.NextFrameAsync?",
      "Walk RuntimeInitializeLoadType order.",
      "When is a coroutine still the right tool?",
    ],
    blocks: [
      p("The Manual page “Event function execution order” is the diagram. The full loop is PlayerLoop — you can read and customize it. Interviewers want Awake → OnEnable → Start, physics FixedUpdate, Update/LateUpdate, animation, rendering, coroutines/awaitables resuming at documented points, OnDisable/OnDestroy. Script Execution Order and DefaultExecutionOrder are patches, not architecture."),
      h2("order", "Lifecycle (lead version)"),
      ol([
        "Awake: allocation, GetComponent cache, no “other objects are ready” assumption across the scene",
        "OnEnable: subscribe; pair with OnDisable, not only OnDestroy — disable happens on pooling",
        "Start: cross-object setup after all Awakes on active objects",
        "FixedUpdate: physics timestep; not your render loop",
        "Update: game logic that is not physics",
        "LateUpdate: camera follow after moves",
        "Rendering",
        "yield WaitForEndOfFrame / Awaitable.EndOfFrameAsync — after render, documented for some GPU readbacks",
        "OnApplicationPause: mobile collaboration — occupancy timeout, not only mute audio",
        "OnDisable / OnDestroy: unsubscribe, cancel Awaitable/CTS, Release Addressables",
      ]),
      h2("resume", "Where async resumes (Manual)"),
      p("Iterator coroutines resume based on the yield (WaitForFixedUpdate vs WaitForEndOfFrame). Regular .NET Tasks resume in the Update phase. Awaitable can resume at NextFrameAsync, FixedUpdateAsync, EndOfFrameAsync, MainThreadAsync, BackgroundThreadAsync. Exact order between coroutines and awaitables is not guaranteed; Awaitables run in await order as a group."),
      h2("awaitable", "Awaitable (Unity 6)"),
      ul([
        "Pooled: do not await the same instance twice; do not cache it like a Task",
        "Better than Task when you want Player-loop-aware scheduling and fewer allocations",
        "Task when you need WhenAll/WhenAny or multiple awaiters — wrap Awaitable at that cost",
        "Continuations: called from main thread → usually resume main thread; else thread pool. Switching to main from background waits the next Update",
        "Never await the same pooled Awaitable from two consumers",
        "NUnit does not take Awaitable as a test return; the Manual shows an IEnumerator trick",
      ]),
      p("Use Awaitable for I/O, Addressables, web, “wait until next frame.” Use the job system for short tight parallel math. Do not put Transform writes on a background thread."),
      h2("rilo", "RuntimeInitializeOnLoadMethod"),
      p("Player/Editor Play Mode order from the Scripting API: low-level systems → SubsystemRegistration and AfterAssembliesLoaded → more setup → BeforeSplashScreen → first scene load → BeforeSceneLoad (objects loaded, inactive, Awake not run) → Awake/OnEnable → AfterSceneLoad (FindObjectsByType works). Default is AfterSceneLoad. Order inside a load type is not guaranteed. Package assemblies that only contain these methods need AlwaysLinkAssemblyAttribute or stripping deletes them."),
      h2("time", "Time"),
      p("deltaTime vs unscaledDeltaTime vs fixedDeltaTime. timeScale 0 freezes scaled time — UI sparkles that must tick use unscaled. Physics stability is fixedDeltaTime and the spiral-of-death; the physics optimization Manual is the follow-on chapter."),
      qa(
        "Can I Task.Wait on the main thread for Addressables?",
        "No. The best-practices page: deadlocks. Await Awaitable, or a continuation, and cancel when the MonoBehaviour dies."
      ),
    ],
  }
];
