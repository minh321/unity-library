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

export const quizzesPart1: Record<string, (area: SkillArea) => Question[]> = {
  "value-ref": (area) => [
    q(`${area}-lr-1`, area, "Where can a C# struct live?", "B", {
      best: "Often on the stack, but also on the heap as a class field, in an array, or when boxed.",
      close: "Structs live on the stack, except when you put them in a List.",
      wrong: "Structs always live on the stack, which is why they never garbage-collect.",
      trap: "Use structs for everything in Unity so the GC never runs.",
      whyBest: "The heap/stack slogan is incomplete. Arrays, fields, and boxing put structs on the heap.",
      whyClose: "Lists of structs are on the heap, but that is only one of several cases.",
      whyWrong: "'Never GC' is the trap your teammate would say. Boxing and arrays prove it false.",
      whyTrap: "Large or mutable structs can be worse than a class. Do not ban classes.",
    }),
    q(`${area}-lr-2`, area, "What is boxing in a Unity hot path?", "C", {
      best: "Wrapping a value type in a heap object, often via object, non-generic interfaces, or some LINQ.",
      close: "Copying a struct into a local variable in Update.",
      wrong: "Converting int to float, which is slower than a cast.",
      trap: "Boxing never happens if you only use structs and Vector3.",
      whyBest: "Boxing is an allocation. Prove it with GC Alloc before rewriting.",
      whyClose: "A local Vector3 copy is usually cheap and is not boxing.",
      whyWrong: "Numeric conversion is not boxing.",
      whyTrap: "Vector3 boxed through an interface or LINQ still allocates.",
    }),
    q(`${area}-lr-3`, area, "LINQ in Update is a problem. What do you do first?", "A", {
      best: "Measure GC Alloc on a development player build and confirm LINQ is the limiter before rewriting.",
      close: "Replace every LINQ call with a for-loop in the whole project.",
      wrong: "Turn off the garbage collector on mobile.",
      trap: "If the editor still shows 60 fps, LINQ is fine in Update.",
      whyBest: "Measurement-first. LINQ may not be the frame's real cost.",
      whyClose: "A blanket ban wastes time on cold paths and editor tools.",
      whyWrong: "You cannot ship 'GC off' as architecture.",
      whyTrap: "Editor fps is not a device diagnosis.",
    }),
    q(`${area}-lr-4`, area, "A junior says foreach on List is always free. What is the accurate correction?", "D", {
      best: "foreach on List<T> is usually fine; foreach via IEnumerable can box the enumerator. Prove allocation before changing style.",
      close: "foreach always allocates in Unity, so only use for-loops.",
      wrong: "foreach is illegal in IL2CPP.",
      trap: "IEnumerator is a class, so every foreach is a heap alloc, always.",
      whyBest: "The List enumerator is a struct. The interface path is what boxes.",
      whyClose: "Over-correcting hides the real boxing cases.",
      whyWrong: "IL2CPP runs foreach every day in production.",
      whyTrap: "The enumerator type depends on the collection, not a universal rule.",
    }),
  ],
  "title-gap": (area) => [
    q(`${area}-lr-1`, area, "How do you open the title-gap sentence?", "C", {
      best: "I have not yet held the formal Team Leader title for a full year, but I have already performed several lead-level responsibilities… then proof.",
      close: "I am not qualified, but please consider me.",
      wrong: "I have been a Team Leader in everything but name, so the requirement should not apply.",
      trap: "I managed a team of eight Unity developers for a year.",
      whyBest: "Name the gap once, then evidence. Not defensive, not fake.",
      whyClose: "Do not argue against yourself.",
      whyWrong: "Litigating the spec sounds defensive.",
      whyTrap: "Invented headcount. Overclaim.",
    }),
    q(`${area}-lr-2`, area, "Which is the strongest honest evidence from your background?", "B", {
      best: "Owning migrations/client adaptations and protecting a revenue live title with very little downtime, plus coordinating design/art/QA.",
      close: "I have used Unity for several years and I know Addressables.",
      wrong: "We shipped a lot of games as a company.",
      trap: "I designed our production 30-user 3D collaboration stack.",
      whyBest: "Owned work, stability, coordination. Numbers you actually have.",
      whyClose: "Stack names are implementer-level.",
      whyWrong: "'We' without I/we split.",
      whyTrap: "You have not shipped that product.",
    }),
    q(`${area}-lr-3`, area, "A junior misses deadlines. First move?", "A", {
      best: "Diagnose scope, blockers, or skill gap; cut the next slice and pair. Do not start with blame.",
      close: "Stay late and finish their tickets so the board is green.",
      wrong: "Put them on a PIP as their manager.",
      trap: "Call them out in the team channel to set a standard.",
      whyBest: "Diagnose, then coach. You may not even be their manager.",
      whyClose: "Heroics hide the system problem.",
      whyWrong: "You do not hold that title; PIPs are not your first tool.",
      whyTrap: "Public shaming fails the respect test.",
    }),
    q(`${area}-lr-4`, area, "Why you instead of someone with a formal TL year?", "D", {
      best: "Production judgment on live revenue systems, migration sequencing, and honest gaps I will close—especially collaboration architecture I have not shipped yet.",
      close: "I want to grow and I learn fast.",
      wrong: "I would do the same coding job with a better title.",
      trap: "I already think like a director of engineering.",
      whyBest: "Specific evidence + named gap. Lead-level humility.",
      whyClose: "Growth is fine; it is not a reason to hire you over them.",
      whyWrong: "This role is not a title upgrade for the same IC work.",
      whyTrap: "Overclaiming seniority.",
    }),
  ],
  ai: (area) => [
    q(`${area}-lr-1`, area, "What is a responsible use of AI on this team?", "B", {
      best: "Draft tests, docs, and checklists, then a human verifies against Unity docs and your catalog before merge.",
      close: "Generate shaders and ship if they compile.",
      wrong: "Paste production logs with user ids into a public model to debug faster.",
      trap: "Let it design occupancy authority unsupervised because it sounds confident.",
      whyBest: "AI assists; humans own correctness.",
      whyClose: "Compile ≠ correct or licensed.",
      whyWrong: "Secrets and personal data do not go in prompts.",
      whyTrap: "Architecture stays a human decision.",
    }),
    q(`${area}-lr-2`, area, "What must never go into a prompt?", "C", {
      best: "Secrets, player personal data, and proprietary code you are not allowed to send off-machine.",
      close: "Stack traces with types stripped.",
      wrong: "Public Unity API names.",
      trap: "The whole repo, so the model has full context.",
      whyBest: "The three hard no's.",
      whyClose: "Even stripped traces can leak product internals; treat carefully.",
      whyWrong: "Public API names are fine.",
      whyTrap: "Whole-repo dumps are a data policy failure.",
    }),
    q(`${area}-lr-3`, area, "How do you stop juniors from over-depending on AI?", "A", {
      best: "Review every diff, require them to explain the change, and use AI for boilerplate—not as the author of core systems.",
      close: "Ban AI entirely.",
      wrong: "Accept AI code if tests were also generated.",
      trap: "Measure productivity by lines the model wrote.",
      whyBest: "Ownership + review. Learning stays intact.",
      whyClose: "A ban is optional policy; the lesson is review, not prohibition.",
      whyWrong: "Generated tests of generated code are a circular compliment.",
      whyTrap: "Lines are a vanity metric.",
    }),
    q(`${area}-lr-4`, area, "AI hallucinated an Addressables API. What is the rule?", "D", {
      best: "Treat unknown APIs as false until Unity docs or the package version confirm them. Do not merge.",
      close: "If IntelliSense did not error in the editor, it is real.",
      wrong: "Hallucinations are rare enough to ignore.",
      trap: "Leave a comment '// generated' and ship.",
      whyBest: "Verify or reject. Hallucinated APIs compile… until they do not.",
      whyClose: "The editor can still resolve a wrong package.",
      whyWrong: "Rarity is not a control.",
      whyTrap: "A comment is not a review.",
    }),
  ],
  particles: (area) => [
    q(`${area}-lr-1`, area, "When do you pick Built-in Particle System over VFX Graph?", "B", {
      best: "When gameplay must Emit/GetParticles, collide with the world, or run on a device without compute. Budget is thousands, not millions.",
      close: "Whenever the artist prefers the Inspector modules, even for 200k GPU leaves.",
      wrong: "Never — VFX Graph replaced it in Unity 6.",
      trap: "Always, because particles are just free quads.",
      whyBest: "Unity’s chooser: script access + all pipelines + thousands. VFX Graph is GPU/compute/URP-HDRP.",
      whyClose: "Authoring comfort is not a collision or compute requirement.",
      whyWrong: "Unity 6 still documents both. Particle System is not deprecated.",
      whyTrap: "Additive billboards are fill-rate bombs. Count ≠ GPU cost.",
    }),
    q(`${area}-lr-2`, area, "A designer wants 50,000 leaves colliding with furniture. First answer?", "A", {
      best: "Refuse world-collision Particle System at that count. Propose VFX Graph without physics contacts, a card mesh LOD, or Unity 6 URP depth-buffer GPU collision — and a gameplay lie that leaves do not need Rigidbody hits.",
      close: "Raise max particles and enable Collision World with bounce.",
      wrong: "Put a Rigidbody on every leaf.",
      trap: "GPU Resident Drawer will instance the collisions for free.",
      whyBest: "World collision is CPU queries. Resident Drawer does not simulate leaf contacts.",
      whyClose: "That is the hitch. Max particles is a cap, not a physics budget.",
      whyWrong: "50k bodies is not an effect; it is a physics incident.",
      whyTrap: "Resident Drawer is Mesh Renderer instancing, not particle collision.",
    }),
    q(`${area}-lr-3`, area, "How should a gun spark be spawned from C#?", "C", {
      best: "ParticleSystem.Emit with reused EmitParams (or a burst). Do not GetParticles/SetParticles every shot.",
      close: "Enable Rate over Time for one frame in Update.",
      wrong: "Instantiate a new Particle System prefab without pooling, every bullet.",
      trap: "Send a GPU event on a VFX Graph you cannot read back for hit confirmation.",
      whyBest: "Emit is the gameplay API. GetParticles is for sampling, not fire-and-forget sparks.",
      whyClose: "A one-frame rate is racy and still simulates a looping contract.",
      whyWrong: "Instantiate cost plus teardown. Pool Play/Stop/Clear.",
      whyTrap: "If the spark must confirm a hit, you needed CPU particles or a separate collider.",
    }),
    q(`${area}-lr-4`, area, "Which Particle System module is usually the GPU surprise?", "D", {
      best: "Renderer: additive billboards, overdraw, lit particle shaders, shadows on.",
      close: "Main.maxParticles, because it is a large integer.",
      wrong: "Shape cone radius.",
      trap: "Simulation space Local, which always hits the GPU harder than World.",
      whyBest: "Fill rate lives on the Renderer and the shader. Max particles is a CPU/GPU sim cap, not overdraw by itself.",
      whyClose: "A high cap can cost simulation, but a hundred fullscreen quads can cost more than 2k tiny ones.",
      whyWrong: "Shape is emission placement.",
      whyTrap: "Local vs World is transform math, not fill rate.",
    }),
  ],
  "vfx-graph": (area) => [
    q(`${area}-lr-1`, area, "What do the four VFX Graph contexts do?", "A", {
      best: "Spawn decides how many; Initialize runs once at birth; Update every tick; Output how it is drawn.",
      close: "They are four materials the graph blends.",
      wrong: "They map 1:1 to Particle System modules with the same names.",
      trap: "Output is where you set velocity so the GPU stays in the pixel shader.",
      whyBest: "That sentence is the interview. Output is topology/shading, not simulation.",
      whyClose: "Contexts are GPU stages, not materials.",
      whyWrong: "Modules are CPU component sections. Contexts are a graph.",
      whyTrap: "Velocity belongs in Initialize/Update. Output reads attributes.",
    }),
    q(`${area}-lr-2`, area, "What is capacity in VFX Graph?", "C", {
      best: "Reserved GPU memory for that system — a budget, not a soft visual max you might see.",
      close: "The same as Particle System max particles, so set it to 1 million to be safe.",
      wrong: "The number of Visual Effect components in the scene.",
      trap: "A Unity 6 automatic that scales with GPU Resident Drawer.",
      whyBest: "Oversized looping torches waste VRAM. Size it, then quality-tier it.",
      whyClose: "A million reserved on a room accent is undisciplined even if spawn is low.",
      whyWrong: "Capacity is per system inside the asset.",
      whyTrap: "Resident Drawer does not size VFX buffers.",
    }),
    q(`${area}-lr-3`, area, "How do you use Shader Graph with VFX Graph in Unity 6?", "B", {
      best: "Enable Support VFX Graph on the URP/HDRP target, then use a dedicated Shader Graph output context (Quad/Mesh/Strip), not a checkbox on Output Particle Quad.",
      close: "Add the deprecated Visual Effect Target the 2021 way.",
      wrong: "Assign any Lit shader to the Visual Effect component material slot.",
      trap: "Turn on GPU Resident Drawer so graphs compile as particles.",
      whyBest: "Unity 6 / v17 workflow: dedicated outputs + Support VFX Graph.",
      whyClose: "Docs tell you to remove that target.",
      whyWrong: "The component does not take a random material the Particle System way.",
      whyTrap: "Unrelated feature.",
    }),
    q(`${area}-lr-4`, area, "Name a real Unity 6 / VFX Graph 17 headline.", "D", {
      best: "URP camera depth/color buffers for GPU collision or scene-color inherit, plus Shader Graph keyword support on VFX outputs.",
      close: "VFX Graph now runs on Built-in RP.",
      wrong: "GetParticles became GPU-fast.",
      trap: "Unity 6 removed capacity so you never budget.",
      whyBest: "Quoted from the v17 what’s-new page. Use it, then mention fill-rate cost of those buffers.",
      whyClose: "VFX Graph still needs URP/HDRP and compute.",
      whyWrong: "You still do not iterate particles in C#.",
      whyTrap: "Capacity remains a reservation.",
    }),
  ],
  "shader-graph": (area) => [
    q(`${area}-lr-1`, area, "Art wants dissolve, hologram, wetness, and damage on one graph. You say?", "A", {
      best: "That is four keywords and a variant incident. Split by use, or one packed enum/quality with documented variant count, before you agree.",
      close: "Add four Boolean keywords; Shader Feature will strip them perfectly from Addressable rooms.",
      wrong: "Do it all in one Custom Function string so there are no keywords.",
      trap: "Unity 6 Shader Graph compiles every combination for free now.",
      whyBest: "Keywords double variants; remote rooms hitch on first use. Name the count.",
      whyClose: "Addressable content still has to pull variants. Stripping is not magic.",
      whyWrong: "An unread HLSL dump is not cheaper; it is unreviewable.",
      whyTrap: "Keywords still compile combinations.",
    }),
    q(`${area}-lr-2`, area, "Where does vertex wind belong?", "C", {
      best: "Vertex stage (Position, then rebuild Normal if needed). Fragment wind wastes ALU per pixel.",
      close: "Fragment Base Color so it previews better.",
      wrong: "A C# script that moves every vertex on the CPU.",
      trap: "A Multi Compile keyword per grass blade.",
      whyBest: "Master Stack: vertex animation in vertex.",
      whyClose: "Preview is not the reason to pick a stage.",
      whyWrong: "Possible for tiny meshes; not a field of grass.",
      whyTrap: "Per-instance keywords are a variant bomb.",
    }),
    q(`${area}-lr-3`, area, "Soft particles look hard-edged on Android. Likely cause?", "B", {
      best: "Depth texture is off on the mobile URP Asset, or the graph samples Scene Depth that was never generated.",
      close: "Half precision; switch the whole graph to Single.",
      wrong: "GPU Resident Drawer is disabled.",
      trap: "Built-in RP particle shaders will fix it if you mix pipelines.",
      whyBest: "Scene Depth / soft particles need the pipeline to supply depth.",
      whyClose: "Precision can band; it does not invent a depth texture.",
      whyWrong: "Resident Drawer is opaque Mesh Renderer instancing.",
      whyTrap: "Do not mix leftover Built-in materials into URP as a fix.",
    }),
    q(`${area}-lr-4`, area, "Shader Graph and the SRP Batcher — the lead sentence?", "D", {
      best: "Generated shaders are not automatically batcher-friendly. Keep variants compatible; avoid unique Property Blocks and unique textures per wallpaper.",
      close: "Shader Graph always batches; that is why we use it.",
      wrong: "Disable the SRP Batcher so GPU instancing works on every graph.",
      trap: "Enable GPU Resident Drawer on the shader asset.",
      whyBest: "Batcher wants compatible variants and persistent material data.",
      whyClose: "The docs even warn instancing vs batcher interactions.",
      whyWrong: "Killing the batcher to “get instancing” is usually a misunderstanding of three systems.",
      whyTrap: "Resident Drawer is on the URP Asset for Mesh Renderers, not a graph toggle.",
    }),
  ],
  "vfx-perf": (area) => [
    q(`${area}-lr-1`, area, "GPU time is high, draw calls look fine. Particle-side check?", "B", {
      best: "Overdraw/fill: additive billboards, stacked glass, particles, bloom, scene-color grabs. Use overdraw view and Frame Debugger transparent events — not the stats-bar SetPass count.",
      close: "Raise max particles so the system stops reallocating.",
      wrong: "Disable SRP Batcher; particles need the old batcher.",
      trap: "Turn on GPU Resident Drawer so transparents instance.",
      whyBest: "Interiors fail on fill rate. Draw calls will not show it.",
      whyClose: "A higher cap increases simulation; it does not fix overdraw.",
      whyWrong: "Wrong tool.",
      whyTrap: "Resident Drawer is opaque Mesh Renderers, not additive FX.",
    }),
    q(`${area}-lr-2`, area, "Default lighting for muzzle FX?", "A", {
      best: "Unlit plus emission. Lit particles × additional lights are a tax; isolate if a hologram must receive a desk lamp.",
      close: "Lit + all additional shadows so it grounds in the room.",
      wrong: "Standard lit opaque with shadow casting on.",
      trap: "Path tracing in HDRP on mobile.",
      whyBest: "TA default. Lighting is opt-in and tiered.",
      whyClose: "Grounding is art; shadows on billboards are usually wrong and expensive.",
      whyWrong: "Opaques with shadows are not sparks.",
      whyTrap: "Wrong pipeline and device.",
    }),
    q(`${area}-lr-3`, area, "Design wants volumetric fog in every user room on mobile.", "C", {
      best: "Refuse full-screen volumetric as default. Offer height fog, cheap cone particles, PC-only VFX Graph fog, or baked density — and put GPU ms on the table.",
      close: "Enable it and lower resolution scale to 0.3 so fps returns.",
      wrong: "Bake the fog into lightmaps only; never a runtime effect.",
      trap: "Unity 6 Render Graph makes volumetrics free.",
      whyBest: "Named alternative + measurement. TA partners with the cut line.",
      whyClose: "0.3 scale destroys training readability.",
      whyWrong: "Baked fog can be a piece of the answer, not a ban on all runtime.",
      whyTrap: "Render Graph does not delete fill rate.",
    }),
    q(`${area}-lr-4`, area, "How do you quality-tier a hero VFX Graph?", "D", {
      best: "Named budgets: drop GPU events and distortion on Low, keep Unlit torch on Mid, allow scene-color on High. Detect with GPU/RAM + a short benchmark, not artist PCs.",
      close: "One asset, always; the GPU will LOD it.",
      wrong: "Duplicate the whole room prefab per tier.",
      trap: "Shader Feature keywords for every ember color.",
      whyBest: "Same discipline as engineering quality tiers, owned with art.",
      whyClose: "VFX Graph will not invent a mobile LOD for you.",
      whyWrong: "Room duplication explodes Addressables. Swap the effect, not the building.",
      whyTrap: "Color is a property; not a keyword per ember.",
    }),
  ]
};
