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
function checklist(items: string[]): Block {
  return { type: "checklist", items };
}

export const vfxArticles: Article[] = [
  {
    id: "vfx-ta-interview",
    title: "VFX / Technical Artist interview",
    group: "vfx",
    summary:
      "A later-date Technical Artist screen: lookdev judgment, graph literacy, shader literacy, and render-pipeline fluency — not a gameplay FX artist quiz and not a second Team Leader interview.",
    readMinutes: 10,
    tags: ["technical artist", "VFX", "interview", "Unity 6"],
    related: ["vfx-explained", "particle-system", "vfx-graph", "shader-graph", "render-pipelines", "vfx-performance", "ebook-unity-books"],
    suggestedQuestions: [
      "How is a TA interview different from the Team Leader interview?",
      "What should I admit I have not shipped in VFX Graph?",
      "Give me a 90-second intro for a Technical Artist panel.",
    ],
    blocks: [
      p("You already have a Team Leader encyclopedia for architecture, rooms, and delivery. This wing is for a separate later interview: VFX / Technical Artist. They will still care that you can speak Unity 6, but they will grade look, cost, and pipeline — not occupancy authority."),
      callout(
        "honest",
        "Do not recast yourself",
        "You are a Unity / Cocos engineer with production optimization, Addressables, and Profiler work. You have not held a Technical Artist title. Do not claim a shipped VFX Graph library, a lookdev reel you do not have, or shader authorship you cannot walk. Say: I have shipped Unity content that includes particles and materials; I study Particle System, VFX Graph, Shader Graph, and URP at Unity 6 so I can talk mechanism and budget."
      ),
      h2("what-they-hire", "What this panel is hiring"),
      ul([
        "Someone who can choose Built-in Particle System vs Visual Effect Graph for a given effect and device",
        "Someone who can open Shader Graph and explain vertex vs fragment, keywords, and why variants explode builds",
        "Someone who can explain URP in Unity 6: Forward+, Render Graph, GPU Resident Drawer — not “we use URP because it is modern”",
        "Someone who can budget overdraw, fill rate, and particle capacity with art, not fight art",
        "Someone who can debug a pink shader, a missing VFX output, or a GPU-bound meeting room without guessing",
      ]),
      h2("vs-tl", "How it differs from the Team Leader screen"),
      table(
        ["Team Leader", "VFX / Technical Artist"],
        [
          ["Architecture, rooms, incidents, honest lead stories", "Graphs, shaders, frame, lookdev language"],
          ["Occupancy, Addressables catalogs, QA matrix", "Blend modes, sorting, soft particles, lighting of FX"],
          ["You own the cut line with Product", "You own the visual budget with Art, still measured"],
          ["Server authority answers", "Pipeline and GPU answers"],
        ]
      ),
      h2("spoken-open", "Allowed opening (TA panel)"),
      p("I have not worked under a formal Technical Artist title. I am a Unity engineer who has shipped live titles and measured CPU, GPU, and memory. For this interview I will talk Particle System, VFX Graph, Shader Graph, and the Unity 6 render pipeline the way a TA is expected to: mechanism, cost, and how I would partner with art."),
      h2("how-to-study", "How to use this wing"),
      ol([
        "Start with **VFX in plain language** if graphs still feel like a foreign window — then VFX Graph / Shader Graph said simply",
        "Read Render pipelines first if URP vs HDRP is still a slogan in your mouth",
        "Read Particle System, then VFX Graph, then Shader Graph — they stack",
        "Read VFX performance before you practice lookdev talk; fill rate is the trap in interiors",
        "Learn by doing: Learning Templates sample, then Unity’s VFX Graph e-book (Unity 6 edition). Shader Graph is a chapter in that book, not a separate Shader Graph PDF. This library does not reprint the PDF.",
        "Open Unity 6 docs linked on each article. The trainer will cite them; it will not invent nodes",
        "Ask the trainer: “quiz me as a TA, not as a Team Lead” on any heading",
      ]),
      h2("typical-asks", "Typical asks"),
      ul([
        "Walk this fire: which system, which modules or contexts, what would I measure?",
        "Why is this glassy room GPU-hot with few draw calls?",
        "Make a dissolve that still batches. What did you put on the Blackboard?",
        "When do you refuse VFX Graph on a mid-range Android room?",
        "Unity 6: what did Render Graph and GPU Resident Drawer change for you?",
      ]),
      callout(
        "lead",
        "Same honesty rule",
        "If you have not used a node in production, say so, then describe how you would approach it from the Unity 6 docs and a measured prototype. That is a TA-level sentence, not a junior one."
      ),
    ],
  },
  {
    id: "particle-system",
    title: "Built-in Particle System",
    group: "vfx",
    summary:
      "CPU-simulated, C#-addressable particles. Unity 6 still ships this for gameplay-driven FX, collisions, and thousands — not millions — of particles.",
    readMinutes: 16,
    tags: ["Particle System", "modules", "CPU", "C#", "Unity 6"],
    related: ["vfx-explained", "vfx-graph", "vfx-performance", "shader-graph", "render-pipelines"],
    practiceTopic: "particles",
    suggestedQuestions: [
      "When do I pick Particle System over VFX Graph?",
      "Which modules actually cost CPU vs GPU?",
      "How do I drive bursts from gameplay without allocating every shot?",
    ],
    blocks: [
      p("Unity 6 still offers two particle solutions. The Built-in Particle System is a component: modules in the Inspector, full read/write from C#, works on Built-in RP, URP, and HDRP. Visual Effect Graph is a GPU graph that can reach millions of particles but needs compute and does not give you cheap per-particle C#."),
      callout(
        "tip",
        "Official chooser",
        "Unity’s “Choosing your particle system solution” page is the interview source of truth: Particle System = thousands, script access, all pipelines. VFX Graph = millions, GPU, URP/HDRP, graph authoring. You can use both in one project if the platform supports compute."
      ),
      h2("when", "When a TA picks this"),
      ul([
        "Gameplay must read or write particles: hits, collectibles, trigger callbacks, custom emission from code",
        "World collision, bounce, and “die on hit” that must agree with physics",
        "UI-adjacent or small counts: muzzle smoke, sparks, dust motes, looping room accents under a few thousand",
        "Platforms without compute, or a fallback LOD of a VFX Graph hero effect",
        "Artists who already live in the module Inspector, and the effect does not need GPU events",
      ]),
      h2("main", "Main module — the contract"),
      p("Duration, looping, prewarm, start delay, start lifetime / speed / size / rotation / color, gravity modifier, simulation space, scaling mode, play on awake, emitter velocity, max particles, auto random seed. Max particles is a hard cap: emission above it is silently dropped. Prewarm fills a looping system so a torch is not empty on room enter. Simulation space Local parents the cloud to a moving gun; World leaves smoke in the room. Custom simulation space is the rare third."),
      ul([
        "Delta Time vs Unscaled Time: pause must not freeze a UI sparkle if that is the spec; a world fire should freeze with the simulation",
        "Scaling Mode: Hierarchy vs Local vs Shape — wrong choice makes a parented burst explode when the avatar scales",
        "Stop Action: Destroy, Disable, Callback — pooling wants Disable + Clear, not Destroy",
      ]),
      h2("emit-shape", "Emission and Shape"),
      p("Rate over Time, Rate over Distance, and Bursts. Distance rate is for trails behind a moving object. Bursts are the gameplay API: a hit spark is a burst, not a high rate you enable for one frame. Shape: Sphere, Hemisphere, Cone, Donut, Box, Mesh, MeshRenderer, SkinnedMeshRenderer, Sprite, Circle, Edge, Rectangle. Mesh emission samples positions; skinned mesh follows a character. Cone + radius is still the standard muzzle."),
      h2("motion", "Motion modules"),
      table(
        ["Module", "What it is for", "Cost note"],
        [
          ["Velocity over Lifetime", "Wind, rise, orbital", "CPU; curves allocate nothing extra if you stay on the component"],
          ["Limit Velocity over Lifetime", "Drag, damp", "Cheap vs a Force Field for simple drag"],
          ["Inherit Velocity", "Muzzle smoke that keeps gun motion", "Multiplier; wrong value looks like the FX is stuck or flung"],
          ["Force over Lifetime", "Constant or curve force", "Not the same as Particle System Force Field volumes"],
          ["Noise", "Turbulence", "Quality settings cost CPU; do not max Quality on mobile dust"],
          ["External Forces", "Force Fields", "Layer mask; overused fields fight each other"],
        ]
      ),
      h2("look", "Color, Size, Rotation, Texture Sheet"),
      p("Color / Size / Rotation over Lifetime are the lookdev knobs. Gradients and curves are multiplied with Main start values — interviewers like that sentence. Texture Sheet Animation: grid or sprites, over lifetime or FPS. A 4×4 flipbook of a flame is cheaper than a unique mesh with a heavy shader. Frame over Time vs start-frame random is how you desync a row of torches."),
      h2("collision-trigger", "Collision, Triggers, Sub Emitters"),
      p("Collision: Planes (cheap, authored) vs World (physics-scene queries, CPU, can hitch). Bounce, lifetime loss, dampen, collides with. This is the reason you did not pick VFX Graph for “sparks that must sit on the floor.” Triggers: callback when particles enter a volume — collectible sparkles, “extinguish the fire.” Sub Emitters: birth, collision, death. Death sub-emitter is the spark when a rain drop hits. Keep sub-emitter max particles honest or you spawn a second system that is the real cost."),
      h2("renderer", "Renderer module"),
      ul([
        "Render Mode: Billboard, Stretched Billboard, Horizontal/Vertical Billboard, Mesh, None",
        "Material: almost always a particle shader (Unlit, or Lit if you accept lighting cost). Wrong surface shader = lighting and shadows you cannot afford",
        "Sort Mode and Sorting Fudge: interiors + transparency = fighting the sofa. Fudge is a scalpel, not a pipeline",
        "Light Probes / Reflection Probes: lit particles in a baked room; extra cost",
        "Cast Shadows: usually off for additive FX",
        "GPU Instancing: mesh particles, same mesh/material; enable only when the Renderer supports it — see Unity 6 Particle GPU instancing docs",
        "Vertex streams: pack Custom1/Custom2 into the shader instead of unique materials",
      ]),
      h2("scripting", "C# a TA is expected to know"),
      ul([
        "Play, Pause, Stop(ParticleSystemStopBehavior), IsAlive, Clear",
        "Emit(EmitParams, count) — reuse EmitParams, do not allocate Particle[] every shot if you can Emit without GetParticles",
        "GetParticles / SetParticles — the heavy API; use for gameplay sampling, not for per-frame lookdev",
        "Main, Emission, Shape modules as structs from particleSystem.main etc.",
        "OnParticleCollision / OnParticleTrigger on the receiving script",
      ]),
      h2("unity6", "Unity 6 notes"),
      p("The component API and modules remain the authoring model. Unity 6 documentation still treats this as the scriptable solution. Built-in Render Pipeline is deprecated in Unity 6 but Particle System itself is not deprecated. If the project is URP (it should be for Mobile + PC rooms), use URP particle shaders / Shader Graph unlit particles, not leftover Built-in particle materials from an upgrade."),
      qa(
        "A designer wants 50,000 leaves colliding with furniture.",
        "That is not this component’s job. Collision world queries at that count will melt the main thread. Propose VFX Graph without world collision, or a mesh/LOD of cards, or GPU collision via VFX depth buffer in Unity 6 URP — and a gameplay lie: leaves do not need Rigidbody contacts."
      ),
      callout("warn", "Trap answer", "“Particles are free, they are just quads.” Billboard additive quads are fill-rate bombs in a glassy meeting room. Count is not the same as GPU cost."),
    ],
  },
  {
    id: "vfx-graph",
    title: "Visual Effect Graph",
    group: "vfx",
    summary:
      "GPU particle graph for URP and HDRP. Unity 6 / package 17 adds URP camera buffers and Shader Graph keyword support. Capacity, contexts, and outputs are the interview.",
    readMinutes: 16,
    tags: ["VFX Graph", "GPU", "Unity 6", "compute"],
    related: ["vfx-graph-plain", "particle-system", "shader-graph", "render-pipelines", "vfx-performance"],
    practiceTopic: "vfx-graph",
    suggestedQuestions: [
      "Walk Spawn → Initialize → Update → Output.",
      "What did Unity 6 change for VFX Graph on URP?",
      "When do I refuse VFX Graph on mobile?",
    ],
    blocks: [
      p("Visual Effect Graph (package 17 in Unity 6) authors effects as a graph of contexts that run on the GPU. You place a Visual Effect component, assign a Visual Effect Asset, expose properties for art and gameplay. Simulation is not the Particle System component. You do not GetParticles every frame."),
      h2("requirements", "Requirements and refusals"),
      ul([
        "URP or HDRP — not a reason to keep Built-in RP alive",
        "Compute shaders: no OpenGL ES fallback fantasy. If the device has no compute, this asset does not run",
        "Capacity is reserved GPU memory, not “max we might see.” Oversized capacity on a looping room torch is a leak of VRAM discipline",
        "Culling uses the system bounds. Wrong bounds = always simulated or popped out",
      ]),
      h2("contexts", "Contexts — the sentence you must say"),
      table(
        ["Context", "When it runs", "TA meaning"],
        [
          ["Spawn", "How many, when, from events or rate", "Budget lives here as much as in shaders"],
          ["Initialize", "Once per particle at birth", "Set position, velocity, lifetime, color, UV"],
          ["Update", "Every simulated tick", "Forces, noise, collision-with-depth, aging"],
          ["Output", "How it is drawn", "Quad, mesh, strip, distortion, Shader Graph outputs"],
        ]
      ),
      p("Blocks sit inside contexts (Set Velocity, Add Position, …). Operators sit in the graph body (Add, Sample Curve, Sample Texture). Mixing them in speech — “I added a velocity node in output” — is how candidates fail. Output is shading and topology, not simulation."),
      h3("events", "Events and GPU events"),
      p("CPU events (SendEvent from C#, or Play) enter Spawn. GPU events spawn other systems from particle conditions — a GPU trail of sparks from a GPU meteor. That is the VFX Graph answer to Sub Emitters, and it stays on the GPU. Do not round-trip to C# to spawn the child."),
      h2("attributes", "Attributes"),
      p("position, velocity, color, size, age, lifetime, alive, texIndex, mass, targetPosition, and custom attributes. Initialize writes them. Update reads/writes. Output reads. Inheritance on GPU events is how a child keeps the parent’s color. If a particle is black in the Scene view, you forgot to set color in Initialize or multiplied by zero in Update."),
      h2("outputs-sg", "Outputs and Shader Graph (Unity 6)"),
      p("Do not look for a “use Shader Graph” checkbox on a generic Output Particle Quad the way older tutorials showed. From 2023.3 / Unity 6 the workflow is dedicated outputs: Output Particle Quad (Shader Graph), Mesh (Shader Graph), Strip (Shader Graph). In Shader Graph, Graph Settings → URP or HDRP target → enable Support VFX Graph. The graph can still work as a normal material. Assign the Shader Graph on the VFX output; exposed properties appear on the context."),
      ul([
        "Lit vs Unlit outputs: lit particles in a baked interior pay additional lights. Unlit + emission is the usual hero FX",
        "Distortion / refraction outputs need pipeline support and a color buffer; they are fill-rate plus a grab",
        "Decal outputs are pipeline-specific; URP/HDRP each have limits listed in the VFX + Shader Graph known-limitations page",
      ]),
      h2("unity6-new", "What is new in VFX Graph 17 / Unity 6"),
      ul([
        "URP Camera Buffer: sample scene depth and color on URP. Fast GPU “collision” against depth, spawn against the buffer, inherit scene color — the official Unity 6 headline",
        "Shader Graph keyword support on VFX Shader Graph outputs: parametric graphs tunable from the VFX context, which is also a variant-budget problem if you go wild",
        "Always confirm the package version in the project (17.x for Unity 6). Do not quote 2021 Visual Effect Target workflow; it is deprecated",
      ]),
      h2("gameplay-hook", "Talking to gameplay without lying"),
      p("Expose a SpawnEvent, a texture, a float “intensity”, a Transform. From C#: VisualEffect.SetFloat, SetTexture, SendEvent, playRate, pause. You still do not iterate particles. If design needs “the tenth spark grants occupancy,” that is the wrong tool — drop a Particle System or a mesh, or fake it with a collider the graph does not own."),
      h2("authoring-discipline", "Authoring discipline"),
      ol([
        "Name systems (Smoke, Embers, Distortion) so a reviewer can cull cost",
        "One looping room accent per Visual Effect when possible; mega-graphs are unreviewable",
        "Log capacity × systems × rooms in a furnished space",
        "Provide a quality exposed float or a cheap child asset for mobile",
        "Document which outputs are Shader Graph and which keywords they require",
      ]),
      qa(
        "Why is my VFX pink on device but fine in editor?",
        "Shader variant stripped, missing compute, wrong URP asset features, or a Shader Graph target that was HDRP while the player is URP. Use the Frame Debugger and shader stripping logs. Never say “rebuild the library.”"
      ),
      callout(
        "honest",
        "If you have not shipped VFX Graph",
        "Say you have not shipped a production VFX Graph library. Then walk contexts, capacity, Unity 6 URP buffers, and Shader Graph outputs from the docs. Offer a one-day prototype plan: one torch, one GPU event spark, one mobile quality switch, measured in Rendering Debugger."
      ),
    ],
  },
]