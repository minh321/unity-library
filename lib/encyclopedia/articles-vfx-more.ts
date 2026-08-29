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

export const vfxArticlesMore: Article[] = [
  {
    id: "shader-graph",
    title: "Shader Graph",
    group: "vfx",
    summary:
      "Visual shaders for URP and HDRP in Unity 6 (Shader Graph 17). Master Stack, keywords, precision, SRP Batcher, and Support VFX Graph.",
    readMinutes: 15,
    tags: ["Shader Graph", "URP", "keywords", "Master Stack"],
    related: ["shader-plain", "vfx-plus-shader", "render-pipelines", "vfx-graph", "vfx-performance", "rendering"],
    practiceTopic: "shader-graph",
    suggestedQuestions: [
      "What belongs in Vertex vs Fragment?",
      "How do keywords explode a mobile build?",
      "How do I make a graph legal for VFX Graph in Unity 6?",
    ],
    blocks: [
      p("Shader Graph 17 ships with URP and HDRP in Unity 6. You connect nodes; Unity generates HLSL. A Technical Artist is expected to know the graph as a shader, not as a “material editor.” Built-In RP support exists for compatibility only — Unity tells you not to build new Shader Graph work there."),
      h2("window", "The window"),
      ul([
        "Blackboard: exposed properties. These become material inspector fields and, if Support VFX Graph is on, VFX output properties",
        "Graph Inspector / Graph Settings: Active Targets (Universal, HDRP), material type, Support VFX Graph, precision",
        "Master Stack: Vertex stage and Fragment stage blocks — the only things that actually shade",
        "Main Preview: a mesh, not the room. Always check in-scene on target lighting",
      ]),
      h2("stack", "Vertex vs Fragment"),
      p("Vertex: Position, Normal, Tangent, and custom interpolators. Vertex animation (wind, dissolve height, outline extrusion) belongs here. Doing wind in fragment wastes ALU on every pixel. Fragment: Base Color, Normal, Metallic/Specular, Smoothness, Emission, Occlusion, Alpha, Alpha Clip. A dissolve that must kill shadows needs Alpha Clip and a Shadowcaster that uses the same clip — or you get shadow blobs after the mesh is gone."),
      h2("targets", "Targets and material types"),
      table(
        ["Target", "Typical TA use"],
        [
          ["Universal Unlit", "FX, UI-world, cheap emissive, particles"],
          ["Universal Lit", "Room surfaces, characters; pays lighting"],
          ["Universal Decal", "Projected dirt/wear; not all VFX outputs support it"],
          ["HDRP Lit / Unlit / Hair / StackLit", "High-end PC lookdev; not the default for a mobile room product"],
        ]
      ),
      p("A graph can have multiple targets. Shipping both URP and HDRP from one asset is possible and is a variant tax. For this product, one URP target unless a PC-only SKU exists."),
      h2("keywords", "Keywords are a production incident waiting"),
      p("Keywords compile shader variants. Shader Feature strips unused ones from the player based on materials in the build (and what Addressable rooms pull in). Multi Compile keeps combinations for runtime branching (quality, lights). Every Boolean keyword can double variants. A TA who adds four unchecked Boolean features on a room wallpaper shader will blow the player size and hitch on first use of a remote room."),
      ul([
        "Prefer a material property slider over a keyword if art can live with a small branch or a lerp",
        "Document which keywords VFX Graph 17 now forwards to Shader Graph outputs — Unity 6 added this; it is power and risk",
        "Strip in URP Asset / Graphics settings; prove with a shader variant viewer, not hope",
      ]),
      h2("precision-batcher", "Precision and the SRP Batcher"),
      p("Half vs Single: mobile fragment likes Half; world-position math and some noise do not. Mixing precision carelessly causes banding or color that “looks dirty only on device.” SRP Batcher wants compatible shader variants and persistent material data. Material Property Blocks, GPU instancing toggles, and random unique textures can break the batch. Interview sentence: Shader Graph is not automatically SRP-Batcher-friendly; the generated shader must stay compatible, and art must not unique every wallpaper."),
      h2("custom", "Custom Function, Sub Graphs, textures"),
      p("Custom Function node: HLSL file you can review in PR, not a 40-line string nobody owns. Sub Graphs: the TA’s function library (rim, triplanar, dither fade). Scene Color / Scene Depth: distortion, foam, soft particles — they require the pipeline to supply those textures and they cost a sample plus often a grab. Soft particles that fail on Android are usually depth texture off in the URP asset."),
      h2("vfx-support", "Support VFX Graph"),
      ol([
        "Open the Shader Graph",
        "Graph Settings: Universal or HDRP target",
        "Enable Support VFX Graph",
        "In VFX Graph, add a Shader Graph output context (not a legacy checkbox on Output Particle Quad)",
        "Assign the graph; tune exposed properties on the context",
      ]),
      p("Unity versions 2021.2 and earlier used a Visual Effect Target. Unity 6 docs tell you to remove that target. Quoting it in an interview dates you."),
      h2("lookdev-tasks", "Tasks this panel will mime"),
      ul([
        "Interactive hologram: Unlit, emission, intersection via Scene Depth, dithered distance fade",
        "Wear on a desk: detail maps, triplanar if UVs are trash, not a unique 4k for every prop",
        "Vertex cloth / foliage: vertex offset + normal rebuild, wind on a global time node, not per-material clocks that desync",
        "Stylized water: vertex waves cheap, refraction optional on PC quality tier only",
      ]),
      qa(
        "Art wants a shader that does dissolve, hologram, wetness, and damage.",
        "That is four keywords and a review fail. Split by use, or one uber with a single enum quality and textures packed. Name the variant count before you agree."
      ),
      callout("warn", "Generated HLSL", "You still own the output. If the Frame Debugger shows a unexpected pass (shadow, depth, motion vectors), the stack asked for it. Turn off what the FX does not need."),
    ],
  },
  {
    id: "render-pipelines",
    title: "Render pipelines deep dive (Unity 6)",
    group: "vfx",
    summary:
      "What a render pipeline is, why Built-in RP is deprecated, URP 17 Render Graph and GPU Resident Drawer, Forward+, HDRP when it is justified, and how a TA talks about a frame.",
    readMinutes: 18,
    tags: ["URP", "HDRP", "Render Graph", "Forward+", "Unity 6"],
    related: ["rendering", "shader-graph", "vfx-graph", "vfx-performance", "profiling"],
    practiceTopic: "render-pipeline",
    suggestedQuestions: [
      "Walk a URP camera frame in Unity 6.",
      "Forward vs Forward+ vs Deferred — which for a 30-user room?",
      "What does GPU Resident Drawer actually require?",
    ],
    blocks: [
      p("A render pipeline is the engine’s recipe for one camera image: cull what is visible, decide lights and shadows, draw opaques then transparents, run post-processing, present. Unity 6 still lets you pick Built-in RP, URP, or HDRP. For a new Mobile + PC collaboration product, the adult choice is URP. HDRP is a high-end PC/console lookdev pipeline. Built-in RP is deprecated."),
      h2("birp", "Built-in Render Pipeline"),
      p("Unity 6 documents that Built-in RP is deprecated and will become obsolete after the Unity 6.7 LTS window. It still receives fixes through that window so upgrades are possible. It has no SRP Batcher, no VFX Graph, no GPU Resident Drawer, no Render Graph. A TA who proposes staying on Built-in “because particles work” is proposing a dead-end. Particle System works on URP. Migrate."),
      h2("urp-loop", "URP camera loop"),
      p("Unity 6’s URP manual splits the camera loop as: gather culling parameters → cull (renderers, lights, shadow casters) → build RenderingData from quality, camera, platform → set up the renderer (queue of passes) → execute the renderer into the framebuffer. Custom work injects as Renderer Features / Scriptable Render Passes, not as “a script in Update that Blits.”"),
      h3("paths", "Rendering paths"),
      table(
        ["Path", "How lights work", "When a TA/TL picks it"],
        [
          ["Forward", "Main light + limited additional lights per object", "Simple mobile; additional lights become a per-object tax"],
          ["Forward+ (clustered)", "Many lights in tiles/clusters, not N lights × M objects", "Furnished rooms, many lamps; required for GPU Resident Drawer"],
          ["Deferred (URP)", "G-buffer then lighting", "Heavier PC; not the default mobile story"],
        ]
      ),
      p("Forward+ is the Unity 6 sentence for a dense interior: lots of local lights without the Forward per-object additional-light clamp. It needs a capable GPU. Quality tiers can drop to Forward on low Android with fewer lamps baked or faked."),
      h2("unity6-urp", "Unity 6 / URP 17 headlines"),
      h3("render-graph", "Render Graph"),
      p("Render Graph is the framework on top of SRP that records passes and resources, then executes an optimized graph. It allocates only what the frame uses, handles graphics/compute sync, and can merge passes. You inspect it with Window → Analysis → Render Graph Viewer and with the Rendering Debugger’s Render Graph log. Custom passes in Unity 6 belong on RecordRenderGraph. Compatibility Mode (Project Settings → Graphics → Render Graph → Compatibility Mode / Render Graph Disabled) exists so old ScriptableRenderPass code still runs. Unity is not developing that path. Do not write new Renderer Features on the compatibility API."),
      h3("grd", "GPU Resident Drawer"),
      p("GPU Resident Drawer draws Mesh Renderers via BatchRendererGroup GPU instancing so the CPU is not preparing every draw. Requirements from the Unity 6 manual: Forward+ path, compute (not OpenGL ES), Mesh Renderer, SRP Batcher on, BatchRendererGroup Variants = Keep All in Graphics shader stripping, GPU Resident Drawer = Instanced Drawing on the URP Asset. It will silently fall back if you ignore those. Frame Debugger shows Hybrid Batch Group. This is not particle instancing and not the SRP Batcher — three different CPU-save stories. Mixing the words is a fail."),
      h3("other-u6", "Also in the URP 17 notes"),
      ul([
        "Alpha Processing: keep alpha through post if you composite",
        "Spatial-Temporal Post-Processing (STP) upscaling on supported platforms — a quality-tier tool, not a license to ship 4k UI on mobile",
        "Rendering Debugger and profiler markers such as RenderLoop.DrawSRPBatcher, ExecuteRenderGraph",
      ]),
      h2("urp-assets", "Assets a TA must name"),
      ul([
        "URP Asset: quality, HDR, shadows, depth/opaque textures, additional lights, SRP Batcher, GPU Resident Drawer",
        "Renderer asset (Universal Renderer): path (Forward/Forward+/Deferred), Renderer Features, shadows",
        "Volume / Volume Profile: post, color, fog — not free; bloom in a glassy room is fill rate",
        "Camera: renderer override, renderer features per camera (UI camera vs room camera)",
      ]),
      h2("lights-shadows", "Lights and shadows"),
      p("Main Directional Light + shadow cascades are a budget. Additional lights: per-object (Forward) vs clustered (Forward+). Additional light shadows are a separate tax. Mixed lighting and lightmaps cost bake time and lightmap RAM. Reflection probes and screen-space effects need the textures enabled on the URP Asset. A TA cuts cascades and per-lamp shadows before they cut readable emissive signs."),
      h2("hdrp", "HDRP — when it is the answer"),
      p("High Definition Render Pipeline 17 is physically based, volume-driven, deferred-first, with optional ray tracing, path tracing, and much heavier defaults. Use it for a PC-only cinematic SKU or a film-quality hero space. Do not pick HDRP for mid-range Android collaboration rooms. Shader Graph and VFX Graph work here with an HDRP target. Features (decals, distortion, fog volumes) do not 1:1 port from URP. A dual-pipeline product is two shading libraries unless you are extremely strict with graph targets."),
      h2("custom-pass", "Custom passes without folklore"),
      ol([
        "Subclass ScriptableRenderPass; record resources and a render func on the Render Graph builder",
        "Subclass ScriptableRendererFeature to inject at an injection point",
        "Or subscribe to RenderPipelineManager events — last resort, harder to budget",
        "Verify with Render Graph Viewer: unexpected imported textures = extra memory; unmerged passes = extra bandwidth",
      ]),
      h2("ta-speech", "How you talk a frame in interview"),
      ol([
        "Camera → cull (layers, distance) → shadows → opaques (SRP Batcher / Resident Drawer) → sky/post mid → transparents (VFX, glass, UI world) → post → UI overlay",
        "Name the limiter you would measure: CPU submit, GPU fill, bandwidth, variants",
        "Name the Unity 6 tool: Profiler, Frame Debugger (ExecuteRenderGraph), Rendering Debugger, Render Graph Viewer",
        "Name the owner: art budget vs engineering path vs quality tier",
      ]),
      qa(
        "Why enable Opaque and Depth textures on URP?",
        "Soft particles, refraction, distortion, some decals, SSAO. Each is a fullscreen sample tax. If the project does not use them, leave them off on the mobile URP Asset."
      ),
      callout(
        "lead",
        "Team Lead overlap",
        "A TA who can say Forward+ and Resident Drawer still needs a lead who puts those flags in a named quality tier and a device matrix. If you sit both interviews, do not pretend the graphics flags replace occupancy design."
      ),
    ],
  },
  {
    id: "vfx-performance",
    title: "VFX lookdev cost and budgets",
    group: "vfx",
    summary:
      "Overdraw, fill rate, sorting, lighting of particles, quality tiers, and how a TA partners with engineering on a furnished room.",
    readMinutes: 12,
    tags: ["overdraw", "fill rate", "budgets", "mobile"],
    related: ["vfx-learn-by-doing", "particle-system", "vfx-graph", "render-pipelines", "profiling", "rendering"],
    practiceTopic: "vfx-perf",
    suggestedQuestions: [
      "Why is GPU time high when draw calls look fine?",
      "What is a responsible particle budget for a mid-range Android room?",
      "How do I quality-tier a hero VFX Graph?",
    ],
    blocks: [
      p("Interiors with glass, screens, and “atmospheric” particles fail on fill rate, not on draw-call count. The Team Leader encyclopedia already said this. The TA interview wants you to own the particles that caused it."),
      h2("overdraw", "Overdraw and blend"),
      ul([
        "Additive / Blend: every overlapping quad writes the pixel again. A 2k torch sprite filling the screen is a GPU dump",
        "Alpha Blend needs back-to-front sort; Billboard particles fight furniture; Sorting Fudge is a local hack",
        "Alpha Clip / dither fade can restore some depth rejection; edge noise is the art cost",
        "Soft particles sample depth; cheaper than a giant blur, still not free, needs depth texture",
      ]),
      h2("count-vs-cost", "Count is not cost"),
      table(
        ["What you see", "What you measure"],
        [
          ["Particle count in the Scene overlay", "GPU time, overdraw view, pixel quad overdraw"],
          ["One Visual Effect in the Hierarchy", "Capacity × systems × outputs, including hidden GPU events"],
          ["Low SetPass in the stats bar", "Transparent pass time in Frame Debugger"],
          ["Editor 60 fps", "Mid-range Android after 10 minutes thermal"],
        ]
      ),
      h2("lights-on-fx", "Lighting particles"),
      p("Lit particle shaders and additional lights multiply cost. Unlit + baked-looking emission is the default for muzzle, sparks, UI-world. If a hologram must receive a desk lamp, isolate that system and cap additional lights on the mobile renderer. Light probes on billboards look wrong; do not “fix” with more realtime lights."),
      h2("authoring-cheap", "Author cheap"),
      ul([
        "Texture sheet / atlas over unique materials",
        "Mesh particles only with GPU instancing and a tiny mesh",
        "Cull with bounds; stop simulation when the room is empty if gameplay allows",
        "Prewarm only what the user sees at spawn; do not prewarm off-screen weather",
        "VFX Graph: lower capacity, lower spawn, cheaper Update (noise quality), Unlit output",
        "Particle System: disable unused modules; Noise quality; world collision off",
      ]),
      h2("tiers", "Quality tiers for FX"),
      p("Named budgets with owners. Example: Low — no GPU events, no distortion, Particle System LODs, bloom off. Mid — VFX Graph torch, no scene-color sample. High — distortion, extra embers, Forward+ lamps. Detect with RAM/GPU + a short GPU benchmark, same as the engineering quality article. Artist PC is not a tier."),
      h2("debug", "Debug like a TA"),
      ol([
        "Scene overdraw / mipmaps view",
        "Frame Debugger: transparent events, unexpected grabs",
        "Rendering Debugger (URP): wireframe, lighting, render graph log",
        "Profiler GPU module on a development player",
        "RenderDoc / AGI / Xcode when the Unity tools disagree with the device",
      ]),
      h2("collab", "Working with art and with the future Team Lead"),
      p("Art owns silhouette, timing, color. You own blend mode, resolution of flipbooks, whether the effect is GPU, and the number that goes in the budget sheet. If you later sit the Team Leader interview, you already know how to say: this is a content budget, not a missing occlusion bake."),
      qa(
        "Design wants volumetric fog in every user room on mobile.",
        "Refuse full-screen volumetric as default. Offer height fog, cheap particles in cones, a PC-only VFX Graph fog, or a baked density volume. Put the GPU ms on the table."
      ),
      callout("warn", "Rejected TA answer", "I would just lower the particle count. Count may not be the limiter. Say fill rate, variants, or lighting — after a capture."),
    ],
  },
  {
    id: "vfx-question-bank",
    title: "VFX / TA question bank",
    group: "vfx",
    summary: "Questions a Technical Artist panel actually asks. Use Ask on a heading or the trainer’s quiz intent.",
    readMinutes: 8,
    tags: ["questions", "technical artist", "VFX"],
    related: ["vfx-ta-interview", "vfx-explained", "particle-system", "vfx-graph", "shader-graph", "render-pipelines"],
    suggestedQuestions: [
      "Pick a TA question and help me answer in 90 seconds.",
      "What is the follow-up after I mention Forward+?",
    ],
    blocks: [
      h2("chooser", "Chooser questions"),
      ul([
        "Built-in Particle System or VFX Graph for rain that must wet a collider?",
        "When is a mesh particle worth it?",
        "Can this effect run on a device without compute?",
      ]),
      h2("ps", "Particle System"),
      ul([
        "Walk Emission vs Shape vs Renderer",
        "World vs Local simulation space on a moving avatar tool",
        "GetParticles vs Emit — which do you use for a gun?",
        "Why did max particles not match what I see?",
        "Sub-emitter death vs a second system",
      ]),
      h2("vfx", "VFX Graph"),
      ul([
        "Spawn vs Initialize vs Update vs Output",
        "What is capacity?",
        "GPU event vs CPU SendEvent",
        "Unity 6 URP camera buffers — what problem do they solve?",
        "How do you hook Shader Graph in Unity 6 without the old checkbox?",
      ]),
      h2("sg", "Shader Graph"),
      ul([
        "Vertex dissolve vs fragment dissolve",
        "Keyword vs property",
        "Why is the player hitching the first time a remote room’s shader appears?",
        "Support VFX Graph steps",
        "Half precision banding on mobile",
      ]),
      h2("rp", "Render pipeline"),
      ul([
        "Why not Built-in RP in Unity 6?",
        "Forward vs Forward+ in a furnished room",
        "What is Render Graph actually saving?",
        "GPU Resident Drawer requirements and fallback",
        "Why enable depth texture? Why not?",
        "HDRP for this product — yes or no?",
      ]),
      h2("perf", "Performance"),
      ul([
        "GPU-bound room, low draw calls — list causes",
        "Quality tier for a hero explosion",
        "How you would prove overdraw",
        "Bloom plus additive particles",
      ]),
      checklist([
        "I can choose Particle System vs VFX Graph with a constraint",
        "I can walk URP 17 Render Graph without calling it “SRP”",
        "I can explain SRP Batcher vs GPU instancing vs GPU Resident Drawer",
        "I can enable Support VFX Graph the Unity 6 way",
        "I do not claim a TA title or a VFX Graph shipping credit I do not have",
      ]),
    ],
  }
];
