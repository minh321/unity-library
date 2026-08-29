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

export const quizzesPart3: Record<string, (area: SkillArea) => Question[]> = {
  "shared-interact": (area) => [
    q(`${area}-lr-1`, area, "How do you keep 30 avatars' animation affordable?", "B", {
      best: "LOD and cull distant Animators; replicate locomotion params and gesture ids, not every bone.",
      close: "Always Animate with IK so remote users look correct.",
      wrong: "Disable animation on all but the local player.",
      trap: "Network every Rigidbody joint so physics looks real.",
      whyBest: "Cost scales with active controllers. Replicate intent.",
      whyClose: "Always Animate × 30 will not hold mid-range.",
      whyWrong: "Others still need some motion; LOD it.",
      whyTrap: "Networked physics chaos was the warned mistake.",
    }),
    q(`${area}-lr-2`, area, "Interpolation vs prediction for a shared tablet?", "C", {
      best: "Others interpolate the server result. Do not let two clients predict the same grab.",
      close: "Predict the tablet on both clients so it feels instant; reconcile later.",
      wrong: "They are the same: both hide lag.",
      trap: "Use root motion on the tablet so it walks to the user.",
      whyBest: "Prediction is a local guess. Shared objects need a lock.",
      whyClose: "Dual prediction is fighting.",
      whyWrong: "The lesson's distinction.",
      whyTrap: "Root motion is for characters, not occupancy.",
    }),
    q(`${area}-lr-3`, area, "Two Use requests in the same tick. What happens?", "A", {
      best: "The server serializes them, one owner wins, the loser gets a fail pose and reconciles.",
      close: "Merge both transforms so both feel successful.",
      wrong: "Drop both so nobody cheats.",
      trap: "Whoever's physics updated last in Unity wins.",
      whyBest: "Defined order + fail signal. No dual hold.",
      whyClose: "Merge corrupts the object.",
      whyWrong: "Punishing both is not a rule, just a stall.",
      whyTrap: "Physics is not the authority model.",
    }),
    q(`${area}-lr-4`, area, "You have not shipped this 3D room. What do you say?", "D", {
      best: "I have not used that in production, but I would start from occupancy, small replicated state, and a device prototype.",
      close: "I should skip the question until I build a demo.",
      wrong: "Netcode for GameObjects would handle it, I have shipped this.",
      trap: "I shipped a 30-user Unity training room last year.",
      whyBest: "Honest gap plus approach. Required phrasing.",
      whyClose: "You still have to design it in the interview.",
      whyWrong: "A package name is not an authority model, and the ship claim is false.",
      whyTrap: "Do not invent the product.",
    }),
  ],
  canvas: (area) => [
    q(`${area}-lr-1`, area, "A ticking latency label stutters the HUD. First fix?", "C", {
      best: "Split static UI from the dynamic label onto another canvas so one dirty text does not rebuild the inventory grid.",
      close: "Put everything on one canvas so batching is better.",
      wrong: "Enable Best Fit on every Text.",
      trap: "Update all layout groups every frame so they stay correct.",
      whyBest: "Canvas rebuilds are the cost. Split dirty from static.",
      whyClose: "One canvas is the mistake in the lesson.",
      whyWrong: "Best Fit dirties layout constantly.",
      whyTrap: "Forcing rebuilds is the opposite of a fix.",
    }),
    q(`${area}-lr-2`, area, "What else belongs in UI architecture, not polish?", "B", {
      best: "Safe areas, cursor vs touch, pooling scroll lists, and turning off unused raycast targets.",
      close: "Picking a nicer font.",
      wrong: "A single EventSystem per button.",
      trap: "World-space canvases for every floating name, always on.",
      whyBest: "Input and rebuild cost are architecture.",
      whyClose: "Font is polish.",
      whyWrong: "You want one EventSystem, not one per control.",
      whyTrap: "Nameplates are overdraw unless budgeted.",
    }),
    q(`${area}-lr-3`, area, "Where should the view-model live if you already use R3?", "A", {
      best: "Plain C# / reactive model; the view binds. Do not put room occupancy in the Button onClick.",
      close: "In the Canvas Scaler.",
      wrong: "Only in ScriptableObjects so scenes stay empty.",
      trap: "In a static UIManager that every Text pulls from Update.",
      whyBest: "R3 is for binding, not for stuffing domain into views.",
      whyClose: "Scaler is layout.",
      whyWrong: "SOs can hold config; they are not the only model.",
      whyTrap: "Static Update polling is the old manager smell.",
    }),
    q(`${area}-lr-4`, area, "Chat message arrives and the list hitches. Best approach?", "D", {
      best: "Pool rows, avoid ContentSizeFitter on the whole list, dirty only the new row's canvas group.",
      close: "Rebuild the entire VerticalLayoutGroup so spacing is perfect.",
      wrong: "Instantiate a new prefab without pooling; GC is fine on mobile.",
      trap: "Use Best Fit so long messages never clip, on every row.",
      whyBest: "Pooling + isolating rebuilds.",
      whyClose: "Full layout rebuild is the hitch.",
      whyWrong: "Allocation spikes are real on mid-range.",
      whyTrap: "Best Fit per row is a layout bomb.",
    }),
  ],
  authority: (area) => [
    q(`${area}-lr-1`, area, "What should be server-authoritative in a 30-user training room?", "B", {
      best: "Shared equipment, occupancy, scores, persistent layout, and join eligibility. Clients own input.",
      close: "Every avatar bone and every particle, so cheaters cannot win.",
      wrong: "Nothing. Client authority feels smoother on mobile.",
      trap: "The first PC to enter is the listen-server host.",
      whyBest: "Server owns fights. Clients own input.",
      whyClose: "Bone-level authority explodes bandwidth.",
      whyWrong: "Smoothness comes from interpolation, not giving away grabs.",
      whyTrap: "P2P/listen-server is a poor default for 30 mobile users.",
    }),
    q(`${area}-lr-2`, area, "How does reconnection work?", "C", {
      best: "Rejoin with a session token, receive a full snapshot, then resume deltas. Do not rely on TCP luck.",
      close: "The TCP connection resumes and state is already there.",
      wrong: "Reload the app and hope the room is empty.",
      trap: "Keep simulating locally for two minutes and push the result.",
      whyBest: "Reconnect is a snapshot. Say it that way.",
      whyClose: "Mobile will drop TCP. State is not magically there.",
      whyWrong: "Punishes the user and may leak locks.",
      whyTrap: "Local simulation as truth is client authority.",
    }),
    q(`${area}-lr-3`, area, "How do you test 250 ms RTT and 5% loss?", "A", {
      best: "A network simulator (or NGO/tools) plus a two-client grab race, pause-while-locked, and reconnect mid-use.",
      close: "Ask QA to use the office Wi-Fi.",
      wrong: "Unit-test Time.deltaTime.",
      trap: "Ship and watch crash analytics.",
      whyBest: "Named scenarios: loss, race, pause, reconnect.",
      whyClose: "Office Wi-Fi is not a loss profile.",
      whyWrong: "Unrelated.",
      whyTrap: "Users are not your lab.",
    }),
    q(`${area}-lr-4`, area, "Voice in this product should be…", "D", {
      best: "A separate plane from gameplay snapshots, with its own failure UX.",
      close: "RPCs of audio clips through the same tick.",
      wrong: "Required before occupancy, because talking is the product.",
      trap: "Peer-to-peer voice hosted by the same mobile listen server.",
      whyBest: "Voice failure must not desync the room.",
      whyClose: "Audio through gameplay tick is a bandwidth trap.",
      whyWrong: "Occupancy still works if voice drops.",
      whyTrap: "Same P2P problem as gameplay hosting.",
    }),
  ],
  tiers: (area) => [
    q(`${area}-lr-1`, area, "How do you choose quality without killing training value?", "C", {
      best: "Budgets per tier that keep readable machines and avatars; drop shadows, post, and density first, not interaction fidelity.",
      close: "Lowest settings on all mobiles so nobody complains.",
      wrong: "PC Ultra, mobile Ultra, same assets.",
      trap: "Disable the room on any device below a flagship.",
      whyBest: "Protect the training task. Cut decoration first.",
      whyClose: "A floor that destroys readability fails the product.",
      whyWrong: "Same assets ignore memory.",
      whyTrap: "The job is mid-range support.",
    }),
    q(`${area}-lr-2`, area, "Capability detection should use…", "B", {
      best: "RAM, GPU family, and a short runtime benchmark—not only a marketing device name.",
      close: "iPhone vs Android boolean.",
      wrong: "The user's QualitySettings dropdown only.",
      trap: "Shader Model from 2016 hardcoded per SKU.",
      whyBest: "Names lie. Measure and budget.",
      whyClose: "Too coarse.",
      whyWrong: "Users will pick Ultra and thermal throttle.",
      whyTrap: "Hardcoded SKUs rot.",
    }),
    q(`${area}-lr-3`, area, "What belongs in the device testing matrix?", "A", {
      best: "At least two Android tiers, target iOS if you ship it, one Windows machine, plus a soak in the heaviest room.",
      close: "The lead artist's laptop.",
      wrong: "Editor only, if it is a Development Build.",
      trap: "Whatever QA already owns under their desk.",
      whyBest: "A matrix with owners, not a rumor.",
      whyClose: "Artist PC is one point, not a matrix.",
      whyWrong: "Editor is not a device.",
      whyTrap: "Convenience is not coverage.",
    }),
    q(`${area}-lr-4`, area, "IL2CPP stripping surprised a plugin. Prevention?", "D", {
      best: "link.xml / preserved symbols, a device build in CI, and crash symbols for the store build.",
      close: "Switch back to Mono forever.",
      wrong: "Disable stripping globally and ignore store size.",
      trap: "Catch the crash and ignore it so the room stays up.",
      whyBest: "Preserve, CI player, symbols. Release hygiene.",
      whyClose: "Mono is not the mobile default you want.",
      whyWrong: "Size and security still matter.",
      whyTrap: "Swallowing native crashes hides the matrix gap.",
    }),
  ],
  incident: (area) => [
    q(`${area}-lr-1`, area, "QA cannot reproduce an Android crash. You still have…", "B", {
      best: "Crash rate, devices, OS versions, and symbolicated stacks. Halt staged rollout while you decide rollback vs hotfix.",
      close: "Nothing until someone gets a local repro.",
      wrong: "Only the last Debug.Log on your machine.",
      trap: "Keep the rollout; crashes under 2% are noise.",
      whyBest: "No local repro is not no data. Stop the bleed first.",
      whyClose: "The lesson's rejected answer.",
      whyWrong: "Editor logs are not the fleet.",
      whyTrap: "A silent percent can still be a store disaster.",
    }),
    q(`${area}-lr-2`, area, "Stack points at a native plugin after 10 minutes in one room. Divide work how?", "C", {
      best: "You: go/no-go and symbols. Junior: isolate the room pack on a loaner. Art: unique shaders/VFX. QA: GPU-family soak. Status every 30 minutes.",
      close: "Everyone debugs the plugin in one huddle.",
      wrong: "Engineering only. Art is irrelevant to a native crash.",
      trap: "Ship a 'disable that room' flag tomorrow without telling Product.",
      whyBest: "Owners, including content, plus a time-box.",
      whyClose: "No owner, wasted parallel work.",
      whyWrong: "Room-specific often is content + driver.",
      whyTrap: "A flag may be right; hiding it from Product is not.",
    }),
    q(`${area}-lr-3`, area, "When is the incident actually over?", "A", {
      best: "Fix verified on the failing tier, release shipped, and the device matrix / soak test changed so this class cannot hide again.",
      close: "When the stacktrace is understood.",
      wrong: "When fps in the editor is 60.",
      trap: "When the Slack thread goes quiet.",
      whyBest: "The matrix change is the close.",
      whyClose: "Understanding without a ship and a test is incomplete.",
      whyWrong: "Editor is not the failing device.",
      whyTrap: "Silence is not a postmortem.",
    }),
    q(`${area}-lr-4`, area, "Rollback vs hotfix vs flag. How do you choose?", "D", {
      best: "Blast radius and time-to-safe: halt first, rollback if the last build is known-good, hotfix if the regression is tiny, flag if the feature can go dark.",
      close: "Always hotfix. Rollback looks bad.",
      wrong: "Always rollback. Hotfix is for weak teams.",
      trap: "Let the store percentage climb for data.",
      whyBest: "Decision from blast radius, not ego.",
      whyClose: "Pride is not a strategy.",
      whyWrong: "Hotfix is valid when isolated.",
      whyTrap: "Users are not telemetry probes during a crashout.",
    }),
  ],
  req: (area) => [
    q(`${area}-lr-1`, area, "Product says 'users can create virtual rooms.' You start by…", "B", {
      best: "Asking who, persist?, invite mechanism, platforms, max occupants, offline, and what is out of scope.",
      close: "Estimating eight story points after standup.",
      wrong: "Building a full UGC modeler because that is what 'create' means.",
      trap: "Agreeing to two weeks including voice, moderation, and custom meshes.",
      whyBest: "A slogan is not a spec. Extract the questions.",
      whyClose: "Points on a slogan are fake precision.",
      whyWrong: "That is a non-goal until named.",
      whyTrap: "Hero estimate. Instant fail.",
    }),
    q(`${area}-lr-2`, area, "They want it in two weeks. Safe MVP is six. Cut line?", "C", {
      best: "Template room, invite link, join up to N, persist transforms. Out: custom mesh UGC, moderation, voice. Spike occupancy day one.",
      close: "Invites only, rooms later.",
      wrong: "Say no and wait for a new date.",
      trap: "Agree and quietly drop tests.",
      whyBest: "A usable MVP with non-goals and a spike.",
      whyClose: "Invites without a room is not a product.",
      whyWrong: "A flat no is not a plan.",
      whyTrap: "Quality traded in secret.",
    }),
    q(`${area}-lr-3`, area, "Where does uncertainty go in the estimate?", "A", {
      best: "A named spike with a time box, not a hidden buffer nobody can see.",
      close: "Average the 2-day UI with the 3-week net risk into 1 week.",
      wrong: "Ignore it so the date looks confident.",
      trap: "Double every number 'just in case' without saying so.",
      whyBest: "Visible uncertainty. Spikes, not fake averages.",
      whyClose: "Averaging hides the tail risk.",
      whyWrong: "Confidence theater.",
      whyTrap: "Secret padding destroys trust later.",
    }),
    q(`${area}-lr-4`, area, "What belongs in the written design besides tasks?", "D", {
      best: "Assumptions, API contracts, edge cases, test strategy, rollout, monitoring, and explicit non-goals.",
      close: "Only a Jira epic title.",
      wrong: "A UML wall nobody updates.",
      trap: "Nothing. Docs slow the team.",
      whyBest: "The lesson's output list.",
      whyClose: "A title is not a design.",
      whyWrong: "Ceremony without maintenance is waste; the list still matters.",
      whyTrap: "The role requires documentation.",
    }),
  ],
  "render-pipeline": (area) => [
    q(`${area}-lr-1`, area, "Why not Built-in RP for new Unity 6 work?", "B", {
      best: "It is deprecated in Unity 6, has no SRP Batcher, no VFX Graph, no Render Graph, no GPU Resident Drawer. Particle System still works on URP — migrate.",
      close: "Because HDRP is required for particles.",
      wrong: "Because Built-in RP cannot render UI.",
      trap: "Because Unity 6 removed the Particle System component.",
      whyBest: "Docs: deprecated through 6.7 LTS for upgrades, not for new architecture.",
      whyClose: "VFX Graph is URP/HDRP, not HDRP-only.",
      whyWrong: "uGUI works on Built-in. That is not the reason.",
      whyTrap: "Particle System is not deprecated.",
    }),
    q(`${area}-lr-2`, area, "GPU Resident Drawer requires which of these?", "A", {
      best: "Forward+ path, compute (not OpenGL ES), Mesh Renderer, SRP Batcher on, BRG variants kept, Instanced Drawing enabled. Otherwise Unity falls back silently.",
      close: "Forward path and any particle Renderer.",
      wrong: "HDRP only.",
      trap: "A Shader Graph keyword named Resident.",
      whyBest: "Quoted from the Unity 6 URP page. Three different CPU-save stories: Batcher, instancing, Resident Drawer.",
      whyClose: "Particles are not Mesh Renderers. Forward is not Forward+.",
      whyWrong: "It is a URP feature with those constraints.",
      whyTrap: "Not a keyword.",
    }),
    q(`${area}-lr-3`, area, "What is Render Graph actually doing in URP 17?", "C", {
      best: "Recording passes and resources, then executing an optimized graph: allocate what the frame uses, sync graphics/compute, merge passes. New custom passes use RecordRenderGraph.",
      close: "Replacing the SRP Batcher.",
      wrong: "A visual node editor for artists, like Shader Graph for cameras.",
      trap: "Compatibility Mode is the Unity 6 recommended API for new Renderer Features.",
      whyBest: "Framework on top of SRP. Viewer + Rendering Debugger to inspect.",
      whyClose: "Batcher still exists; Render Graph is pass/resource lifetime.",
      whyWrong: "There is a viewer, but you do not author the pipeline as a Shader Graph.",
      whyTrap: "Unity is not developing the compatibility path.",
    }),
    q(`${area}-lr-4`, area, "Furnished room, many lamps, Mobile + PC. Which URP path is the adult default?", "D", {
      best: "Forward+ on capable tiers so many local lights are clustered, not per-object. Drop to Forward with fewer realtime lamps on low Android.",
      close: "HDRP deferred for every SKU including mid-range Android.",
      wrong: "Built-in forward, because it is simpler.",
      trap: "GPU Resident Drawer without Forward+, hoping lights cluster anyway.",
      whyBest: "Forward+ is the Unity 6 sentence for dense interiors. Tier the path.",
      whyClose: "HDRP is a high-end SKU, not this product’s mobile default.",
      whyWrong: "Deprecated pipeline.",
      whyTrap: "Resident Drawer itself requires Forward+.",
    }),
  ]
};
