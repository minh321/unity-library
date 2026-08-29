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

export const ebookArticlesB: Article[] = [
  {
    id: "ebook-graphics",
    title: "Ch. 6 — Graphics and lighting (Manual)",
    group: "ebook",
    summary:
      "Choose a render pipeline first. URP vs HDRP vs deprecated Built-in. Lighting workflow, Light Modes, probes. Unity 6: GPU Resident Drawer, Render Graph — details in the VFX/rendering articles.",
    readMinutes: 12,
    tags: ["URP", "HDRP", "lighting", "render pipeline"],
    related: ["render-pipelines", "rendering", "ebook-unity6", "shader-graph"],
    suggestedQuestions: [
      "Can I use URP and HDRP in one project?",
      "Walk the lighting configuration workflow.",
      "Baked vs Realtime vs Mixed — one sentence each.",
    ],
    blocks: [
      p("The Manual’s rendering featured section starts with Choose a render pipeline. Unity: switching late is expensive — shaders and features differ. You cannot run URP and HDRP at once. Built-in RP is still documented for upgrades and is deprecated in Unity 6."),
      h2("chooser", "Chooser table (from the 6000.0 page)"),
      ul([
        "URP — scalability, TBDR/mobile/untethered VR, 2D and 3D, public C# source, Shader Graph, Particle System, limited VFX Graph, SRP Batcher, BatchRendererGroup / Entities",
        "HDRP — photoreal high-end (desktop, Xbox, PlayStation), physical light units, advanced PBR, harder to customize lighting models, same SRP batching family",
        "Built-In — all platforms historically; C++ private source; Shader Graph on Built-in is compatibility-only; no SRP Batcher",
      ]),
      p("For this collaboration product: URP. Open Render pipeline feature comparison when they ask about a specific feature (decals, ray tracing, 2D renderer). Deep Unity 6 URP: Render Graph, Forward+, GPU Resident Drawer — see Render pipelines deep dive."),
      h2("lighting-flow", "Lighting configuration workflow"),
      ol([
        "Choose a render pipeline",
        "Configure lighting: baked GI, realtime GI, mixed, or none; pick a Lighting Mode (Baked Indirect, Subtractive, Shadowmask, Distance Shadowmask)",
        "Fine-tune: baked/realtime/mixed lights, emissive, reflection probes, light probes / LPPV",
      ]),
      h2("light-modes", "Light Modes"),
      table(
        ["Mode", "Cost story"],
        [
          ["Baked", "Editor bake to lightmaps; runtime cheap to shade, RAM for maps"],
          ["Realtime", "Every frame; shadows and overlapping lights hurt; Enlighten realtime GI is extra"],
          ["Mixed", "Realtime direct + baked indirect (behavior depends on Lighting Mode); moving the light at runtime does not rebake GI"],
        ]
      ),
      p("Unity 6 removed Auto Generate from the Lighting window (2023.2+). Preview baked lighting with Debug Draw Mode. Progressive GPU Lightmapper is supported. User-created rooms: you often cannot bake what is not there yet — probes, mixed, or runtime lights with a budget. That is a lead sentence."),
      h2("cameras", "Cameras"),
      p("Camera in CoreModule is how the player sees. URP: renderer on the camera, stacking, overlay UI cameras. Depth/opaque textures are a tax for soft particles and refraction. Culling masks and layer distances are occupancy of the GPU, not a gameplay joke."),
      callout("lead", "Split with the TA interview", "This chapter is pipeline + lighting choice. Particle overdraw and Shader Graph keywords are the VFX ebook/wing."),
    ],
  },
  {
    id: "ebook-simulation",
    title: "Ch. 7 — World simulation",
    group: "ebook",
    summary:
      "Manual featured sections: Animation (Mecanim), Physics (3D and CPU optimization), Audio, 2D, Visual effects chooser. Enough to navigate; occupancy still lives in the collaboration articles.",
    readMinutes: 12,
    tags: ["animation", "physics", "audio", "2D", "VFX"],
    related: ["animation-physics", "particle-system", "vfx-graph", "ebook-manual"],
    suggestedQuestions: [
      "What is the Mecanim stack: clip, controller, Animator, Avatar?",
      "How do I cut physics CPU without deleting gameplay?",
      "Particle System or VFX Graph — one Manual sentence?",
    ],
    blocks: [
      h2("animation", "Animation (Mecanim)"),
      p("Clip = recording of properties over time. Animator Controller = state machine + blend trees + parameters, an asset many models can share. Animator component on the instance references the controller; Avatar is for humanoid retargeting only. Layers and masks for upper-body vs locomotion. Root motion vs scripted motion is an occupancy/netcode decision: do not double-apply. LOD the Animator (cull, animate physics only when needed)."),
      h2("physics", "Physics"),
      p("3D: Rigidbody, colliders, joints, layers. Fixed timestep vs render. CPU optimization Manual: timestep, don’t spiral, query-only worlds can skip the default simulate, layer collision matrix, broadphase, primitive colliders over MeshCollider, cooking options, sleeping, solver iterations, collision detection mode. 2D has its own Rigidbody2D.Slide and composite operations (Unity 6 What’s New). Shared grabbing is not “parent to the hand and hope PhysX agrees” — see collaboration articles."),
      h2("audio", "Audio"),
      p("AudioClip, AudioSource, AudioListener (usually one). Import settings (compression, load type) are memory. Spatialization in a 3D room is not free on mobile. Voice chat is usually a separate plane (Vivox or similar), not a pile of AudioSources."),
      h2("2d", "2D"),
      p("Featured if you ship a 2D SKU. Unity 6 What’s New: Tile Palette overlays, SRP batching for 2D renderers, SpriteMask sources. This product is 3D rooms — know 2D exists; do not pretend you are a Tilemap lead unless you are."),
      h2("vfx", "Visual effects"),
      p("Manual chooser: Built-in Particle System (thousands, C# access, all pipelines) vs Visual Effect Graph (millions, GPU, URP/HDRP, compute). Unity 6 VFX Graph: URP buffers, Shader Graph keywords, strip indirect draw. Full treatment: VFX / Technical Artist wing."),
      qa(
        "Can animation be client-authoritative in a 30-user room?",
        "Cosmetic locomotion maybe, with reconciliation. Shared object pose and occupancy: no. Mecanim does not grant netcode."
      ),
    ],
  },
  {
    id: "ebook-ui",
    title: "Ch. 8 — UI and input",
    group: "ebook",
    summary:
      "UI toolkits in Unity 6: uGUI Canvas vs UI Toolkit (UXML, USS, UI Builder, data binding). Input System as the current stack. Safe areas and canvas rebuilds still kill rooms.",
    readMinutes: 9,
    tags: ["UI Toolkit", "uGUI", "Input System"],
    related: ["ui", "platforms", "ebook-scripting"],
    suggestedQuestions: [
      "Retained mode — what does UI Toolkit actually keep in memory?",
      "When would I still choose uGUI for a 3D world-space panel?",
      "Where does Input System live relative to gameplay?",
    ],
    blocks: [
      p("The Manual featured UI section is the chooser between toolkits. Unity 6 pushes UI Toolkit: UXML structure, USS style, UI Builder, UI Debugger, flexbox layout, runtime and Editor with the same language. Data binding in Unity 6 is a first-class story (also in the design-patterns e-book MVVM sample)."),
      h2("toolkit", "UI Toolkit"),
      ul([
        "Retained mode: a tree stays in memory; you mutate properties, the framework redraws",
        "Binding: data changes update UI and the reverse, when you set it up",
        "Visual Tree / PanelSettings at runtime; sorting and screen-space vs world-space constraints differ from Canvas",
        "Debugger like a browser inspector — use it before you rewrite USS",
      ]),
      h2("ugui", "uGUI"),
      p("Canvas, GraphicRaycaster, RectTransform. Rebuilds when geometry/layout dirty — split static and dynamic canvases. Best Fit on every Text is a hitch. World-space Canvas on a machine in a 3D room is still common; know the rebuild tax. EventSystem vs Input System UI module."),
      h2("input", "Input"),
      p("The Input System package is the Unity 6 default for new work: actions, maps, control schemes, PlayerInput. Hide it behind an interface so Mobile touch and PC cursor share rules. On-screen sticks are UI, not camera code. Rebind is a settings problem. Do not poll every axis in every Update on every avatar script."),
      h2("mobile", "Device UI"),
      p("Safe areas, DPI, landscape vs portrait if you support it, localization that must not dirty layout every frame. Permissions dialogs are platform, not Canvas."),
      callout("warn", "R3 / reactive", "If you already use R3, view-models stay plain C#. Occupancy does not live in Button.onClick. That is the engineering article — this chapter only names the toolkit."),
    ],
  },
  {
    id: "ebook-content",
    title: "Ch. 9 — Content and packages",
    group: "ebook",
    summary:
      "Asset workflow, serialization, Resources vs AssetBundles vs Addressables, Package Manager. What’s New: Asset Bundles and Package Manager notes in Unity 6.0.",
    readMinutes: 10,
    tags: ["Addressables", "assets", "Package Manager", "serialization"],
    related: ["assets", "unity-architecture", "ebook-api-core"],
    suggestedQuestions: [
      "When is Resources still legal?",
      "What does Package Manager have to do with a Team Lead review?",
      "Why does serialization ignore a private field?",
    ],
    blocks: [
      p("The Manual splits “what is an asset” from “how it ships.” Import pipeline, labels, serialization, and the three loading stories: Resources (tiny baked set), AssetBundles (format), Addressables (catalogs, remote, ref-count). Large selectable rooms belong on Addressables. Duplicate meshes in two groups are a packing bug."),
      h2("serialize", "Serialization (why Inspector fields exist)"),
      p("Unity serializes fields by its rules, not by C# auto-properties unless you are careful. [SerializeField] on privates. ScriptableObject and MonoBehaviour assets are YAML/binary on disk. Versioning ScriptableObject data is a lead problem when rooms persist. The Scripting API page for a type will tell you what is serialized."),
      h2("addressables", "Addressables (package 2.x on Unity 6)"),
      ul([
        "Load by key/address, not by Resources.Load string sprawl",
        "Unload when ref-count hits zero and nothing else holds a clone/handle/scene",
        "Memory Profiler snapshots: lobby → room A → room B → lobby",
        "Remote catalog, platform variants, compatibility window, failed download leaves the lobby usable",
      ]),
      h2("upm", "Package Manager"),
      p("Engine vs package: you pin versions. A Team Lead owns a manifest policy: no drive-by preview packages in production, changelog read on URP/NGO/Addressables bumps, CI validates the lock. Unity 6 What’s New includes Package Manager workflow changes — open that section when you upgrade, do not recite it from memory."),
      h2("bundles-new", "Asset Bundles in What’s New"),
      p("Unity 6.0 What’s New still lists Asset bundle changes. Addressables is the workflow; bundles remain the underlying packing. You can talk both without running two systems by hand."),
      qa(
        "Can user rooms be executable plugins?",
        "No. Untrusted content is data (catalog + assets), not loaded code. That is product security and a Manual-adjacent lead rule."
      ),
    ],
  },
  {
    id: "ebook-ship",
    title: "Ch. 10 — Platforms, XR, multiplayer, analysis",
    group: "ebook",
    summary:
      "Platform development, XR (visionOS in 6.0), Multiplayer Center/services, Profiler and friends. The shipping half of the Manual.",
    readMinutes: 12,
    tags: ["platforms", "XR", "multiplayer", "Profiler"],
    related: ["platforms", "networking", "profiling", "ebook-unity6"],
    suggestedQuestions: [
      "What does the Profiler not prove if I captured in the Editor?",
      "Is Multiplayer Center a netcode design?",
      "Name XR-related Unity 6 Manual topics I might be asked.",
    ],
    blocks: [
      h2("platforms", "Platform development"),
      p("Android, iOS, Windows/Mac/Linux, consoles, Web. IL2CPP vs Mono, stripping, player settings, permissions, store requirements, symbols for crashes. Quality tiers: resolution scale, shadows, LOD, lights, post. Detect RAM/GPU + a short benchmark. OnApplicationPause on mobile is session + occupancy. Thermal throttling after minutes — soak, do not trust a 30-second capture."),
      h2("xr", "XR"),
      p("Manual featured XR: AR/MR/VR. Unity 6 What’s New: visionOS 2.0 support, Optimized Buffer Discards for Render Graph. This product’s job post is Mobile + PC rooms. If they ask XR, say you have not shipped a visionOS title unless you have, then talk shared problems: frame time, tracking origin, UI in world space, comfort. Do not invent an XR portfolio."),
      h2("mp", "Multiplayer (Manual + 6.0)"),
      p("Featured Multiplayer section plus What’s New: Center, Widgets, Services (Lobby, Relay, Matchmaker, Multiplay, sessions), Tools 2.2.x (NGO 2.0, distributed authority, scene visualization). Netcode for GameObjects and Netcode for Entities are packages. Your SmartFox/WebSocket past is client-server instinct, not a 30-user 3D room credit. Authority, snapshots, interest, reconnect — collaboration articles."),
      h2("analysis", "Analysis tools (Manual + best practices)"),
      ul([
        "Profiler — CPU, GPU, memory, audio; development player on device",
        "Profile Analyzer — compare captures",
        "Memory Profiler — snapshots and leaks vs usage",
        "Frame Debugger — draws and ExecuteRenderGraph",
        "Rendering Debugger — URP",
        "Render Graph Viewer — URP 17 pass/resource graph",
        "Project Auditor — static hints",
        "Roslyn analyzers — team rules",
      ]),
      p("Editor fps is not evidence. Average fps is not p95 frame time. Draw-call count is not fill rate. The optimization Manual and the profiling interview article are the same religion."),
      callout(
        "honest",
        "Netcode gap",
        "I have not shipped this exact 3D collaboration product. I have shipped SmartFox, REST, and WebSocket clients. I would start from server occupancy and snapshots, and I would open the 6000.0 Multiplayer Manual plus NGO docs rather than invent RPCs."
      ),
    ],
  },
  {
    id: "ebook-unity-books",
    title: "Ch. 11 — Official Unity e-books",
    group: "ebook",
    summary:
      "Unity-authored PDFs: programming (C# style, SOLID, ScriptableObjects, DOTS) and graphics (VFX Graph Unity 6 edition, URP for advanced creators). Shader Graph is a chapter inside the VFX book, not a separate Shader Graph-only e-book.",
    readMinutes: 11,
    tags: ["e-book", "SOLID", "ScriptableObject", "DOTS", "style guide", "VFX Graph", "Shader Graph"],
    related: ["ebook", "ebook-scripting", "solid-patterns", "unity-architecture", "vfx-explained", "vfx-graph", "shader-graph"],
    suggestedQuestions: [
      "Is there a Unity e-book on Shader Graph and making VFX?",
      "Which official e-book should a new Team Lead make the team read first?",
      "ScriptableObjects vs ECS — what does Unity itself say?",
    ],
    blocks: [
      p("The Programming in Unity Manual page lists Unity’s own e-books. They are not third-party blogs. A Team Lead can put them in onboarding. Download from unity.com/resources; this encyclopedia will not pirate the PDFs."),
      h2("style", "Use a C# style guide (Unity 6 edition)"),
      p("URL: https://unity.com/resources/c-sharp-style-guide-unity-6 — January 2025. Naming, formatting, small classes, comments for non-obvious code. Unity’s point: the guide is a starting point for a team agreement, not a religion. Pick, write it down, enforce in review and Roslyn. This is how you stop a style war in a shared production codebase."),
      h2("solid", "Level up your code with design patterns and SOLID"),
      p("URL: https://unity.com/resources/design-patterns-solid-ebook — Unity 6 edition with a sample project (Asset Store, Unity 6 Preview or later). Eleven patterns: Factory, Object Pool, Singleton, Command, State, Observer, MVP, MVVM (UI Toolkit binding), Strategy, Flyweight, Dirty Flag. SOLID is expanded with code in the sample. Unity’s warning in the blog: your team’s style may differ from the sample — use the style-guide e-book. Interview: name a pattern only when it removes a real variation (interactables, commands for net, pool for FX). Three prefabs do not need Abstract Factory."),
      h2("so", "Create modular architecture with ScriptableObjects"),
      p("URLs: https://unity.com/resources/create-modular-game-architecture-with-scriptable-objects-ebook and the Unity 6 edition landing https://unity.com/resources/create-modular-game-architecture-scriptableobjects-unity-6 — companion Paddle Ball sample. Unity’s pitch: SOs are more than data containers — delegate/strategy objects, event channels (observer without a singleton), designer-friendly assets, testability. They live in the Project, not the Hierarchy. Pitfalls: accidental shared mutable state, lifetime vs scene, not ECS. For rooms: config, quality tiers, maybe event channels — not occupancy authority."),
      h2("dots", "Introduction to the Data-Oriented Technology Stack"),
      p("URL: https://unity.com/resources/introduction-to-dots-ebook — plus “How to convert a game to DOTS.” ECS: components are data, systems are logic, cache-friendly. Unity’s OOP vs DOD Manual page says they can mix. This product does not require an ECS rewrite to pass a Team Leader screen. If asked: I have not shipped a DOTS production title; I would use jobs/Burst on a measured hotspot before converting avatars to entities."),
      h2("vfx-ebook", "The definitive guide to creating advanced visual effects (Unity 6 edition)"),
      p("Yes — Unity wrote a VFX Graph e-book, and Shader Graph is inside it, not a second full PDF titled only Shader Graph. Title: The definitive guide to creating advanced visual effects in Unity (Unity 6 edition). About 160 pages. Aimed at VFX artists, technical artists, and programmers. Unity blog (2 Dec 2024): https://unity.com/blog/unity-6-vfx-graph-ebook — download landings: https://unity.com/resources/creating-advanced-vfx-unity6 and https://unity.com/resources/definitive-guide-to-creating-visual-effects"),
      ul([
        "Graph logic and every part of a VFX Graph",
        "VFX Graph on URP and HDRP",
        "Worked effect types, interactivity, Learning Templates (URP + HDRP)",
        "Using VFX Graph and Shader Graph together — per-particle shader values, Shader Graph Feature Examples, Shader Graph keywords so one graph serves multiple VFX assets",
        "Six-way lighting for realtime smoke",
        "Profiling and Debug panels, Custom HLSL blocks/operators",
        "Pipeline tools, optimization, advanced techniques",
      ]),
      p("This encyclopedia will not reprint that PDF. For a plain-language walk of the same public Unity 6 docs, open **VFX in plain language**, then VFX Graph / Shader Graph said simply, then Learn by doing. Use Unity’s PDF after you have opened a graph."),
      p("Discovering Shader Graph (https://unity.com/resources/discovering-shader-graph) is a Unity webinar/video, not a second e-book. For URP lighting, shaders, Resident Drawer, and Render Graph as a TA/lead, use Introduction to URP for advanced creators (Unity 6 edition): https://unity.com/resources/introduction-to-urp-advanced-creators-unity-6 — that book is URP, not a Shader Graph tutorial. Pair the VFX e-book with the VFX Graph Learning Templates sample in the Package Manager."),
      h2("order", "Team reading order"),
      ol([
        "C# style guide — one afternoon, then a written team subset",
        "SOLID + patterns — with the sample scenes, not as slogans",
        "ScriptableObjects — if designers must author data without scenes",
        "VFX Graph Unity 6 e-book — for the TA interview; Shader Graph lives in that chapter",
        "URP for advanced creators — if pipeline flags are still slogans",
        "DOTS — only if scale is the actual limiter",
      ]),
      h2("hub", "Best practices hub"),
      p("Unity collects how-tos and e-books at unity.com/how-to and the Manual’s best-practice guides. Prefer those over random Medium posts when you set a team standard."),
      callout(
        "honest",
        "Do not perform the PDF",
        "Having this list is not the same as having read 200 pages. In interview, cite one pattern you actually used (pooling, command, observer) and one you refused."
      ),
    ],
  }
];
