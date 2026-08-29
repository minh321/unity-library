import type { Article, Block } from "@/lib/encyclopedia/types";

function h2(id: string, text: string): Block {
  return { type: "h2", id, text };
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

export const vfxPlainArticles: Article[] = [
  {
    id: "vfx-explained",
    title: "VFX in plain language",
    group: "vfx",
    summary:
      "My reading of Unity 6’s public VFX Graph and Shader Graph docs, said the way an engineer can hold it. This is not Unity’s e-book pasted in. Download theirs too.",
    readMinutes: 11,
    tags: ["plain language", "VFX Graph", "Shader Graph", "how to think"],
    practiceTopic: "vfx-graph",
    related: ["vfx-graph-plain", "shader-plain", "vfx-plus-shader", "vfx-graph", "ebook-unity-books"],
    suggestedQuestions: [
      "Explain VFX Graph like I have never opened the window.",
      "Where does Shader Graph sit in this picture?",
      "What should I open in Unity this week besides this article?",
    ],
    blocks: [
      callout(
        "honest",
        "What this is",
        "Unity’s VFX e-book is their PDF. I will not reprint it. What follows is how I hold the same public Unity 6 ideas: package docs, Manual chooser, Learning Templates, and Unity’s own blogs. If a sentence disagrees with a 6000.0 / package 17 page, the page wins."
      ),
      p("You already think in systems: spawn something, give it a lifetime, move it, draw it, pay for it on a mid-range phone. VFX Graph is that sentence on the GPU. Shader Graph is the sentence “what does this pixel actually look like.” Particle System is the same sentence on the CPU with a C# door. That is the whole map."),
      h2("two-graphs", "Two graphs, one picture"),
      p("Imagine a torch in a user room. VFX Graph decides how many sparks exist, where they are born, how they rise and die, and that they are quads (or a mesh). Shader Graph decides whether those quads are unlit fire, lit smoke, dissolving, or sampling the scene depth. If you only open VFX Graph, you get simulation and a built-in output look. If you only open Shader Graph, you get a material for a mesh, not a million sparks. The Unity 6 way is: simulate in VFX, shade in Shader Graph when the built-in look is not enough."),
      table(
        ["Tool", "In one breath", "You reach for it when"],
        [
          ["Particle System", "CPU particles you can poke from C#", "Hits, collisions that must agree with physics, thousands not millions, no compute"],
          ["VFX Graph", "GPU particles you author as a graph", "Atmosphere, hero FX, GPU events, URP/HDRP with compute"],
          ["Shader Graph", "A shader without writing HLSL first", "Dissolve, hologram, custom particle shading, keywords for quality"],
        ]
      ),
      h2("kitchen", "A kitchen metaphor (hold this)"),
      ul([
        "Spawn is the tap: how much batter hits the pan this frame",
        "Initialize is the recipe card at birth: start position, lifetime, color",
        "Update is cooking: forces, noise, aging, “collision” with depth",
        "Output is plating: billboard, mesh, strip, or a Shader Graph plate",
        "Capacity is how many plates you reserved in the cupboard — you pay even if the tap is quiet",
        "Blackboard / exposed properties are the knobs design can turn without opening the graph",
      ]),
      p("Vertical wires (top and bottom of the big colored boxes) are time: birth → life → draw. Horizontal wires (left into a block) are math: “this random, this curve, this texture.” Unity’s package docs call that processing workflow vs property workflow. If you mix them in speech — “I put velocity in Output” — a TA interviewer hears that you have not lived in the window."),
      h2("what-you-do-this-week", "What I would actually do this week"),
      ol([
        "Package Manager → Visual Effect Graph → Samples → import Learning Templates. Open the URP scene. One template a night. Read the sticky notes inside the graph.",
        "Make one torch: Spawn rate, Initialize position on a cone, Update add velocity up + noise, Output Unlit quad. Expose intensity. Put it in a furnished room and look at overdraw.",
        "Then one Shader Graph Unlit with Support VFX Graph on. Dedicated Shader Graph output on the torch. Change color from a particle attribute.",
        "Unity’s PDF is extra homework after that, not instead of opening the Editor.",
      ]),
      h2("honest-bar", "How you talk it without a TA title"),
      p("I have not shipped a production VFX Graph library. I can walk Spawn → Initialize → Update → Output, I know capacity is reserved GPU memory, I know Shader Graph hooks through Support VFX Graph and a dedicated output in Unity 6, and I would prove cost with the VFX debug/profiler panels and a device capture. Then stop. Do not add a reel you do not have."),
      qa(
        "Why not just read Unity’s e-book into this site?",
        "Because it is their book. This library is my version of the public docs so you can speak. Their PDF still has more pictures and worked graphs. Use both: this to talk, theirs to sit with a coffee."
      ),
    ],
  },
  {
    id: "vfx-graph-plain",
    title: "VFX Graph, said simply",
    group: "vfx",
    summary:
      "Asset vs component, templates, systems, the four contexts, blocks vs operators, capacity and bounds — interpreted from Visual Effect Graph 17 getting started and graph logic.",
    readMinutes: 14,
    tags: ["VFX Graph", "contexts", "capacity", "plain language"],
    practiceTopic: "vfx-graph",
    related: ["vfx-explained", "vfx-plus-shader", "vfx-graph", "particle-system"],
    suggestedQuestions: [
      "What is the difference between a Block and an Operator?",
      "Why does a looping torch with huge capacity still hurt when spawn is low?",
      "When does the graph recompile vs just change values?",
    ],
    blocks: [
      p("VFX Graph is a package that simulates on compute shaders and draws through URP or HDRP. Same version as your SRP package. HDRP often already includes it. You author a Visual Effect Graph Asset. A Visual Effect component in the scene points at that asset. Drag the asset into the Hierarchy and Unity makes the component for you."),
      h2("open", "How you get a graph on screen"),
      ol([
        "Assets → Create → Visual Effects → Visual Effect Graph, pick a template",
        "Or add Visual Effect on a GameObject and click New next to the asset",
        "Edit from the Inspector Edit button, or Window → Visual Effect → Visual Effect Graph",
      ]),
      p("Preview in the Inspector, or drop it in the Scene so you see real lighting. Attach a scene instance to the open graph (toolbar Auto Attach) so gizmos, control panel, and debug panel talk to that instance, not a ghost."),
      h2("recompile", "What makes it hitch while you edit"),
      p("Add, remove, or reconnect nodes: the graph recompiles the changed bits and restarts the effect. Nudge a curve or a number: usually live, no recompile. Settings (the fields without a wire) need a recompile. That is why “I tweaked a setting and nothing happened” is often “you did not let it recompile,” not a broken GPU."),
      h2("vertical", "Vertical: the life of a spark"),
      p("The big colored boxes are Contexts. Flow ports on the top and bottom chain them. Unity runs Blocks inside a Context from top to bottom. Reorder the stack and you change order. Four you must be able to say in order:"),
      table(
        ["Context", "When Unity calls it", "Plain job"],
        [
          ["Spawn", "Every frame while the spawn is active", "How many new particles this frame (rate, burst, event)"],
          ["Initialize", "Once, at birth", "Starting position, velocity, lifetime, color, UV"],
          ["Update", "Every simulated tick for living particles", "Forces, noise, collide, age, kill"],
          ["Output", "Every frame for drawing", "Quad / mesh / strip / distortion / Shader Graph look"],
        ]
      ),
      p("A Particle System in VFX Graph is exactly that chain: Initialize → Update → Output. A Spawn System can be just a Spawn Context feeding that chain. A Mesh Output can sit alone if it is not a particle system. Dashed outlines around a chain are one System — one simulated/rendered part. A torch might be Smoke system + Ember system in one asset. Name them. Reviewers cull cost by system, not by “the VFX on the wall.”"),
      h2("horizontal", "Horizontal: the math into a block"),
      p("Left port is input, right is output. Operators are the small nodes: add, random, sample curve, sample texture. You wire them into a Block’s property. The Block is the verb (“Add Velocity,” “Set Color,” “Collide with Depth”). The operator network is how you compute the numbers for that verb. Creating a node: right-click, spacebar, drag a wire into empty space, or drag from the Blackboard. The Create Node menu only shows what is legal in that hole. If the node you want is missing, you are in the wrong context."),
      h2("capacity-bounds", "Capacity and bounds — the two adult numbers"),
      p("Capacity is not “max I might see on a good day.” It is reserved GPU memory for that system. A looping room torch with capacity 200,000 and spawn 8 is still paying for 200,000. Set it to what the effect can actually hold, then quality-tier it. Bounds are the box used to cull. Wrong bounds: always simulated off-screen, or popping out when the camera should still see smoke. Attach the scene instance so you can see the gizmo."),
      h2("events", "Events, without folklore"),
      p("Play / SendEvent from C# is a CPU doorbell into Spawn. GPU events are “this particle births another system” and stay on the GPU — VFX Graph’s answer to sub-emitters. If design needs “the tenth spark grants occupancy,” you are in the wrong tool. Expose a float or an event for intensity; keep gameplay colliders on the CPU."),
      h2("unity6-feel", "What Unity 6 changed in the window (from public notes)"),
      ul([
        "Create Node is a tree + search + favorites — stop memorizing menu paths",
        "Toolbar is thinner; samples and docs are closer",
        "Shortcut Manager has a VFX Graph category",
        "URP can sample camera depth/color — GPU “hit the floor” without PhysX",
        "Shader Graph keywords on VFX outputs — one shader, several looks, also a variant tax",
      ]),
      qa(
        "I changed a value and the effect restarted from zero.",
        "You probably changed topology (a node or a setting), which recompiles. Curves and live numbers should not. If a looping torch must not flash empty, think prewarm / persistent particles, not “never touch the graph.”"
      ),
    ],
  },
  {
    id: "shader-plain",
    title: "Shader Graph, said simply",
    group: "vfx",
    summary:
      "A shader is a small program that colors pixels. Shader Graph is that program as nodes. Vertex vs fragment, keywords, precision — interpreted from Shader Graph 17 and Unity’s programming/graphics docs.",
    readMinutes: 12,
    tags: ["Shader Graph", "plain language", "keywords", "Master Stack"],
    practiceTopic: "shader-graph",
    related: ["vfx-explained", "vfx-plus-shader", "shader-graph", "render-pipelines"],
    suggestedQuestions: [
      "What is vertex vs fragment in one example?",
      "Why do keywords scare a Team Lead?",
      "What is Support VFX Graph in one sentence?",
    ],
    blocks: [
      p("A shader tells the GPU how a surface (or a particle quad) becomes a color. HLSL is the language. Shader Graph is boxes and wires that generate that HLSL. Unity ships it with URP and HDRP. Instant preview on a sphere is not the same as the furnished room on a phone — always check in-scene, on target lighting."),
      h2("window", "The three places you actually touch"),
      ul([
        "Blackboard — named knobs. They become material fields, and if Support VFX Graph is on, VFX can drive them per particle",
        "Graph Settings — which pipeline (Universal / HDRP), material type (Lit, Unlit, Sprite, …), Support VFX Graph, precision",
        "Master Stack — the only things that shade: Vertex stage and Fragment stage",
      ]),
      h2("vertex-frag", "Vertex vs fragment, with a room example"),
      p("Vertex runs once per corner of the mesh (or particle quad). That is where wind, outline extrusion, and “move the point” belong. Fragment runs once per pixel on screen. That is color, emission, alpha, “dissolve this pixel.” If you put wind in fragment, you pay it on every pixel of a big quad. If you dissolve only in fragment and forget the shadow pass, you get a ghost shadow after the mesh is gone — Alpha Clip must exist for shadows too."),
      h2("unlit-lit", "Unlit vs Lit for FX"),
      p("Muzzle, sparks, UI-world holograms: Unlit + emission. You are drawing light, not receiving the desk lamp. A wet floor or a metal prop: Lit, and you pay additional lights. Mixing “I want it cheap” with Lit + four extra lights is how a glassy meeting room dies. Quality tier: Low Unlit, High maybe Lit for one hero."),
      h2("keywords", "Keywords, in human"),
      p("A keyword is a compile switch. Each Boolean can double how many shader variants Unity stores. Four unchecked features on wallpaper is a player-size and first-use hitch — worse when the shader arrives with a remote room. Prefer a slider you lerp over a keyword if art can live with it. Unity 6 VFX can forward keywords onto Shader Graph outputs: power, and the same trap. Shader Feature can strip unused variants; Multi Compile keeps them for runtime. Know which you used."),
      h2("precision", "Half vs Single"),
      p("Mobile likes Half in fragment (faster, smaller). World-position math and some noise look dirty in Half — banding, “only on device.” That is not a broken texture. Precision is a Graph Settings / node choice. Prove on the phone."),
      h2("batcher", "SRP Batcher is not automatic"),
      p("The generated shader must stay compatible, and art must not unique every material with Property Blocks and one-off textures. Shader Graph is not “it batches because it is a graph.” Interview sentence: I would check the Frame Debugger / SRP Batcher, not assume."),
      h2("samples", "How I would learn nodes without a course"),
      p("Shader Graph package samples and the Shader Graph Feature Examples pack Unity mentions next to the VFX e-book: open an effect you want (dissolve, intersection, flipbook), copy the subgraph, strip what you do not need. Do not collect 40 Boolean features “for later.”"),
      qa(
        "Can I write a Custom Function instead of nodes?",
        "Yes — prefer an HLSL file in source control, not a 40-line string in the node. Someone has to review it. Custom Function is how you own a trick Unity did not ship. It is not a way to hide unread code."
      ),
    ],
  },
  {
    id: "vfx-plus-shader",
    title: "VFX Graph + Shader Graph together",
    group: "vfx",
    summary:
      "Unity 6 wiring: Support VFX Graph on the URP/HDRP target, dedicated Shader Graph outputs, per-particle properties, keywords. Interpreted from Visual Effect Graph 17’s Shader Graph pages.",
    readMinutes: 10,
    tags: ["VFX Graph", "Shader Graph", "Unity 6", "plain language"],
    practiceTopic: "shader-graph",
    related: ["vfx-graph-plain", "shader-plain", "vfx-graph", "shader-graph"],
    suggestedQuestions: [
      "Walk the Unity 6 steps to put a Shader Graph on a particle.",
      "Why is there no Visual Effect target anymore?",
      "What can Shader Graph do that a built-in VFX output cannot?",
    ],
    blocks: [
      p("Built-in VFX outputs (Unlit quad, Lit quad, …) are the default plate. Shader Graph is when you need a look those plates do not have: dissolve, custom lighting, scene-depth intersection, flipbook tricks, a hologram that still lives on a particle."),
      h2("old-vs-new", "Old tutorial vs Unity 6"),
      p("Older videos: Visual Effect Target, or a checkbox on Output Particle Quad. Unity deprecated that target. In 6 / v17 you: (1) Shader Graph with Universal or HDRP target, (2) enable Support VFX Graph in Graph Settings, (3) in VFX Graph add Output Particle Quad (Shader Graph) / Mesh / Strip — dedicated contexts, (4) assign the graph. The graph can still work as a normal mesh material. If it does not appear in the VFX picker, Support VFX Graph is off."),
      h2("why-bother", "What you gain"),
      ul([
        "Per-particle: color, dissolve amount, tex index — the shader reads attributes the VFX already simulates",
        "One Shader Graph, several VFX assets, via keywords (Unity 6) — also a variant budget",
        "Looks you would otherwise write in HLSL",
      ]),
      h2("limits", "What still fails (so you do not promise it)"),
      p("Package docs list known limits: some Blackboard types do not expose, Decal Shader Graphs often not supported on VFX outputs, HDRP fog-volume / some motion-vector vertex animation gaps, URP decal limits. If the panel asks “can every Shader Graph be a particle,” the adult word is no — check that page, do not invent."),
      h2("pink", "Pink on device, fine in Editor"),
      ol([
        "Variant stripped — remote room hit a keyword combo not in the player",
        "Compute missing — VFX Graph will not run; Shader Graph on a mesh might still",
        "Wrong target: HDRP graph in a URP player",
        "Support VFX Graph off, assigned anyway, output silently wrong",
      ]),
      p("Frame Debugger + shader stripping log. Never “rebuild the library” as a diagnosis."),
      h2("practice", "A one-hour exercise"),
      ol([
        "Unlit Shader Graph, one color property, Support VFX Graph",
        "VFX: tiny spawn, Initialize random color into a custom attribute or Color, Shader Graph output, wire the property",
        "Add a dissolve: fragment alpha clip driven by age / lifetime",
        "Put it in the glassy room. If GPU time jumps, it is fill + clip, not “the graph is advanced.”",
      ]),
      callout(
        "lead",
        "Partner sentence",
        "Art owns the look in Shader Graph. You own Support VFX Graph, which outputs exist, keyword count, and the mobile quality that swaps to a built-in Unlit output. Named budget, not a fight."
      ),
    ],
  },
  {
    id: "vfx-learn-by-doing",
    title: "Learn by doing: templates, smoke, debug",
    group: "vfx",
    summary:
      "How I would use VFX Learning Templates, six-way lighting (Unity’s public explanation), and debug panels — a practice path, not a PDF clone.",
    readMinutes: 13,
    tags: ["Learning Templates", "six-way lighting", "profiling", "plain language"],
    practiceTopic: "vfx-perf",
    related: ["vfx-explained", "vfx-graph-plain", "vfx-performance", "vfx-ta-interview"],
    suggestedQuestions: [
      "How do I import Learning Templates?",
      "What is six-way lighting in one paragraph?",
      "When is six-way lighting the wrong tool for a mobile room?",
    ],
    blocks: [
      h2("templates", "Learning Templates — the real classroom"),
      p("Unity ships a sample with 25+ small VFX assets for URP and HDRP (VFX Graph 16+ / 17). Package Manager → Visual Effect Graph → Samples → Learning Templates → Import. Open the URP or HDRP learning scene. Sample Showcase GameObject: custom window with a dropdown, description, docs links, Open VFX. Each graph has sticky notes. That is how you learn, not by highlighting a 160-page PDF."),
      p("Unity’s own groupings, in my words: (1) fundamentals — Spawn/Initialize/Update/Output, bounds, memory; (2) orient particles — billboard vs mesh, Orient block, axes; (3) flipbooks — TexIndex, frame blend, optical flow; (4) pivots; (5) mesh and texture sampling; (6) collisions and interactivity; (7) decals; (8) strips. Do not binge 25 in a day. One idea, speak it, next night."),
      ol([
        "Import sample, open URP scene",
        "Play Mode if the note says the effect needs it",
        "Showcase window → pick “bounds” or “capacity-like” first, then orientation, then flipbook",
        "Open VFX, read notes, change one number, say out loud what broke",
      ]),
      h2("six-way", "Six-way lighting — smoke that reacts to lamps"),
      p("Real volumetric lighting of smoke is too expensive for most games. The usual cheat is a flat sprite, which does not care where the lamp is. Six-way lighting (Unity’s public 2022.2+ write-up, still the idea in Unity 6) bakes how the puff answers light from six directions into two textures. At runtime the particle blends those maps from the actual light direction. You get rim light from behind, internal shadowing, and the same puff can sit in day or night without a unique color bake."),
      ul([
        "Two RGBA maps: six directions packed in RGB channels; alpha on the first is opacity; extra alpha often emission (fire in the smoke)",
        "VFX: Particle Lit Output → Material Type Six Way Smoke Lit → assign Positive / Negative axis maps",
        "Unity’s blog walkthrough was HDRP-first; treat URP/Shader Graph integration as something you verify on your 6.0 package page, not as a slogan from 2022",
        "Controls: color, absorption vs cheap multiply, emissive gradient, remapping — reuse maps",
        "Still a flipbook, not a volume. Shadows can flatten it. Neighbors do not occlude each other in the bake. Background steam, ornamental smoke, explosions — not a hero fog that must fill a room on mid-range Android",
      ]),
      p("Make maps in Houdini/Blender exporters (VFX Toolbox), or Unity’s ready library, or other DCCs with a six-point option you then remap. Baking: six directional white lights, camera-relative. If you have not baked one, say so: I understand the two-texture pack and the Lit output type; I have not run the Houdini exporter in production."),
      h2("debug", "Debug panels, in human"),
      p("Unity 6 VFX window profiling/debug: CPU and GPU time for that effect, memory, texture use, particle counts, sleep. Use them before you “optimize.” Then Frame Debugger (transparent pass), Rendering Debugger, a development player on the phone. Editor 60 fps with a torch in an empty scene is not a furnished room."),
      h2("hlsl", "Custom HLSL when nodes run out"),
      p("Custom HLSL Block (vertical, in a context) vs Operator (horizontal math). Flocking, odd physics, data you sampled yourself. Same rule as Shader Graph Custom Function: file in the repo, reviewed, not a personality test. Prefer nodes until a node cannot say it."),
      h2("path", "A four-evening path I trust more than a binge"),
      checklist([
        "Night 1: Learning Templates fundamentals + one torch you built from empty",
        "Night 2: Orientation + flipbook templates; speak TexIndex",
        "Night 3: Support VFX Graph on a dissolve; pink-on-device checklist",
        "Night 4: Overdraw in a glassy room; say no to volumetric fog as default; skim six-way so you can explain it",
      ]),
      callout(
        "tip",
        "Unity’s e-book still exists",
        "After these evenings, their Unity 6 VFX PDF is easier because you have a graph in muscle memory. Download: unity.com/resources/creating-advanced-vfx-unity6. This chapter is how I would teach you to walk into that PDF without drowning."
      ),
    ],
  },
];
