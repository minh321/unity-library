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

export const mcqBankPart2: Record<string, McqPack> = {
  "diag-09-delivery": {
    mcq: block([
      C(
        "A",
        "trap",
        "Put all rooms in Resources / StreamingAssets so they work offline on every device.",
        "Hundreds of MB per room cannot ship in the player on mobile.",
        []
      ),
      C(
        "B",
        "weak",
        "Use Addressables remote catalogs. Users download the room they pick.",
        "True but incomplete: no platform variants, resume, or version compatibility.",
        ["not-resources", "remote"]
      ),
      C(
        "C",
        "best",
        "Not Resources. Addressables + remote catalog, per-room groups, platform variants (mobile LODs/textures vs PC). App ships lobby + minimum set. Downloads resume, check disk, and retry; failure keeps the lobby. Content versions are pinned to a client compatibility range so an old app cannot load a new schema.",
        "Delivery, variants, failure, versioning—the lead package.",
        ["not-resources", "remote", "split-budget", "failure", "versioning", "ux"]
      ),
      C(
        "D",
        "partial",
        "CDN + AssetBundles, smaller textures on mobile, show a progress bar.",
        "Missing catalog versioning and what happens when the train kills the download at 80%.",
        ["remote", "split-budget", "ux"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "Resume the same content version from cache, verify checksum, finish the pack, then enter. If the catalog is now incompatible, stay in the lobby and prompt an app or content update. Never load a half-written bundle.",
          "Resume + integrity + compatibility. Offline-capable lobby.",
          ["failure", "versioning"]
        ),
        C(
          "B",
          "trap",
          "Load the 80% bundle anyway so the user is not blocked.",
          "Corrupt content crashes more than a retry dialog.",
          []
        ),
        C(
          "C",
          "weak",
          "Start the download from zero every launch.",
          "Punishes mobile users and ignores cache.",
          ["failure"]
        ),
        C(
          "D",
          "partial",
          "Addressables cache should resume. Show retry.",
          "Resume is right; you skipped schema mismatch and integrity.",
          ["failure"]
        ),
      ],
      "Download dies at 80% on a train. User reopens the app. What happens?"
    ),
  },
  "diag-10-animation": {
    mcq: block([
      C(
        "A",
        "trap",
        "30 full Animators with IK and Always Animate, plus networked Rigidbodies on every shared tool so physics looks real.",
        "This will not run on mobile and will desync. Do not pick this.",
        []
      ),
      C(
        "B",
        "best",
        "LOD and cull distant Animators; replicate locomotion params and gesture ids, not bones. Shared machines use a server occupancy lock; others see the result. I have not shipped a 30-user 3D collaboration room; I have shipped SmartFox/WebSocket clients, and I would not pretend Rigidbodies replicate cleanly.",
        "Cost, authority, and an honest production gap.",
        ["animator-cost", "network-anim", "authority", "physics-net", "honest-gap"]
      ),
      C(
        "C",
        "partial",
        "Use Animator culling and replicate fewer parameters. Lock the object so only one user uses it.",
        "Good, but missing the honest gap and the warning against networked physics.",
        ["animator-cost", "authority"]
      ),
      C(
        "D",
        "weak",
        "Bake all animations into vertex textures and run them on GPU.",
        "A research flex that does not answer occupancy or 30-user replication.",
        []
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "trap",
          "Yes, I shipped this exact 30-user Unity training room in production last year.",
          "You have not. Do not invent it.",
          []
        ),
        C(
          "B",
          "best",
          "I have not used this in production. I would start from server occupancy, small replicated state, and interpolation. I would refuse to guess bone-level replication budgets without a prototype on a mid-range device.",
          "The required honest sentence plus a concrete approach and a refusal to bluff numbers.",
          ["honest-gap", "authority"]
        ),
        C(
          "C",
          "weak",
          "I have not, so I would not answer this question in the interview.",
          "You must still design it. Silence is not seniority.",
          ["honest-gap"]
        ),
        C(
          "D",
          "partial",
          "I have not shipped it, but Netcode for GameObjects would handle it.",
          "Honesty is good; naming a package is not an authority model.",
          ["honest-gap"]
        ),
      ],
      "Have you shipped this networked interaction in production?"
    ),
  },
  "diag-11-network": {
    mcq: block([
      C(
        "A",
        "trap",
        "Peer-to-peer listen server on the first PC that enters. Clients own their grabs. TCP will handle reconnect.",
        "P2P, client-authoritative grabs, and TCP-as-reconnect are all wrong for 30 mobile users.",
        []
      ),
      C(
        "B",
        "weak",
        "Use a dedicated server and send every transform at 60 Hz. Interpolation is for lag.",
        "No interest management, no occupancy, bandwidth will explode, and you skipped reconnection snapshots.",
        ["server-auth", "interp"]
      ),
      C(
        "C",
        "partial",
        "Dedicated server authority for equipment. Clients send input. Remote avatars interpolate. Reconnect by rejoining the room.",
        "Close, but 'rejoin' is not a snapshot, and you did not say what must never be client-authoritative.",
        ["server-auth", "interp"]
      ),
      C(
        "D",
        "best",
        "Dedicated server owns shared equipment, occupancy, scores, and persistence. Clients own input; maybe predicted locomotion only. Tick snapshots + deltas; remotes interpolate. Grabs are never client-authoritative. Reconnect = full snapshot then deltas. I have not shipped this exact product; I would take SmartFox/WebSocket lessons and choose Unity Netcode only after the authority model is clear.",
        "Authority, sync, reconnect, honest gap.",
        ["server-auth", "what-sync", "interp", "reconnect", "assumptions"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "The grabber's client shows a predicted hold only if the design allows it; otherwise it waits. The server serializes Use requests; one wins. Other clients keep interpolating the last snapshot, then snap to the granted owner. Packet loss: the loser may briefly see a ghost grab that reconciles. Occupancy timeout covers the 250 ms RTT so locks cannot stick.",
          "Walks through both clients, loss, and lock lifetime.",
          ["interp", "reconnect", "server-auth"]
        ),
        C(
          "B",
          "trap",
          "Both users hold it for two seconds; the later physics update wins.",
          "Dual ownership is the failure mode you must prevent.",
          []
        ),
        C(
          "C",
          "weak",
          "Hide the tablet until the server answers. Two seconds of nothing is fine.",
          "Better than dual hold, but you ignored the other 29 users and packet loss.",
          []
        ),
        C(
          "D",
          "partial",
          "Server lock. Winner animates. Loser plays a fail. Interpolation hides delay.",
          "Correct skeleton; missing loss/RTT specifics the question asked for.",
          ["server-auth", "interp"]
        ),
      ],
      "250 ms RTT, 5% loss, two users grab a tablet. What does each client see for two seconds?"
    ),
  },
  "diag-12-platforms": {
    mcq: block([
      C(
        "A",
        "weak",
        "Quality settings dropdown: Low / Medium / High. Same UI and input on every platform.",
        "A dropdown without budgets, detection, or mobile pause is not a strategy.",
        []
      ),
      C(
        "B",
        "best",
        "Tiers with budgets (resolution scale, shadows, LOD, lights, post). Detect RAM/GPU and a short runtime benchmark. Engineering beyond sliders: touch vs cursor, safe areas, OnApplicationPause, thermals, IL2CPP stripping. A phone call must timeout occupancy so the user does not keep a lock forever.",
        "Graphics + lifecycle + input. Mobile suspend is a networking event.",
        ["detect", "budgets", "lifecycle", "input-ui", "graphics-api"]
      ),
      C(
        "C",
        "partial",
        "Smaller textures and fewer lights on phones. PC gets shadows. Handle safe areas.",
        "Missing capability detection, pause/reconnect, and who owns the matrix.",
        ["budgets", "input-ui"]
      ),
      C(
        "D",
        "trap",
        "Ship one Ultra preset. Mid-range phones should not be a target if the simulation looks worse.",
        "The job requires mid-range. Excluding them is a product failure.",
        []
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "On pause: stop sending input, start a lock timeout or explicitly release occupancy, keep the session token. On resume: reconnect, request a snapshot, restore the view, do not resume a stale grab. Tell the user if the machine was taken.",
          "Pause is session + occupancy, not just a mute.",
          ["lifecycle"]
        ),
        C(
          "B",
          "trap",
          "Keep simulating in the background so they do not lose their place.",
          "iOS will suspend you. Holding a lock in the background blocks colleagues.",
          []
        ),
        C(
          "C",
          "weak",
          "Reload the whole app when they come back.",
          "Punishes the user and still may leave a server lock.",
          []
        ),
        C(
          "D",
          "partial",
          "Use OnApplicationPause to show a reconnecting UI.",
          "UI only. You did not free or timeout the shared object.",
          ["lifecycle"]
        ),
      ],
      "A phone call hits during a collaborative session. What must the client do?"
    ),
  },
  "diag-13-leadership": {
    mcq: block([
      C(
        "A",
        "trap",
        "As their manager I would put both on a PIP and revert the code myself so release is safe.",
        "You are not their manager. PIPs and hero-reverts without a plan also skip mentoring.",
        []
      ),
      C(
        "B",
        "weak",
        "I would stay late and finish the junior's work, and ship the unmaintainable code because it works.",
        "Heroics hide the problem. Working-but-unmaintainable on a shared module is a release risk.",
        []
      ),
      C(
        "C",
        "partial",
        "Talk to the junior about estimates. Ask the other developer to clean up after release.",
        "Soft and late. You did not protect the release or diagnose cause.",
        ["mentor-plan"]
      ),
      C(
        "D",
        "best",
        "Diagnose first: scope, blockers, or skill gap—then cut the next slice and pair. For the risky module, protect the release now (flag, revert, or wrap) and talk privately with examples, not adjectives. I have not been a formal Team Leader, but I have blocked risky changes on a live revenue client and I would escalate options to Product rather than hope QA saves us.",
        "Diagnose, protect, coach, honest scope, Product conversation.",
        ["diagnose-first", "protect-release", "mentor-plan", "respect", "honest-scope"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "I would not ship it on the revenue path. Options: revert, feature-flag off, or isolate behind a hardened wrapper if the flag is already in the wild. I tell Product the risk in user terms and the time to a clean path—not a flat 'no' without options.",
          "Protect the path, offer options, no blame theater.",
          ["protect-release"]
        ),
        C(
          "B",
          "trap",
          "Ship it. Working code is working. We can refactor in the next sprint.",
          "Shared revenue-path debt is how you get the next incident.",
          []
        ),
        C(
          "C",
          "weak",
          "Rewrite it tonight before QA.",
          "Hidden heroics, no communication, high regression risk.",
          []
        ),
        C(
          "D",
          "partial",
          "Revert and tell the developer to do it properly.",
          "Revert may be right; the Product conversation and isolation option are missing.",
          ["protect-release"]
        ),
      ],
      "The unmaintainable code sits on the revenue-critical path. Ship, revert, or isolate—and how do you tell Product?"
    ),
  },
  "diag-14-requirements": {
    mcq: block([
      C(
        "A",
        "trap",
        "Two weeks is tight but we can do full UGC modeling, invites, persistence, voice, and moderation if we work weekends.",
        "Estimating a slogan and promising heroics. Instant fail.",
        []
      ),
      C(
        "B",
        "weak",
        "I would ask for a spec and then estimate in story points after grooming.",
        "Process theater. A lead extracts the questions now.",
        []
      ),
      C(
        "C",
        "best",
        "I ask who the user is, persist or not, invite mechanism, platforms, max occupants, offline. I write an MVP (template room, invite, join, persist layout) and explicit non-goals (custom modeling, moderation). Break into client UI, data, permissions, net, content, QA, analytics. Ranges with spikes on net/UGC. If they want two weeks, I offer a cut MVP rather than a silent six-week plan.",
        "Questions, cuts, breakdown, uncertainty, deadline honesty.",
        ["questions", "nfr", "breakdown", "estimate", "docs"]
      ),
      C(
        "D",
        "partial",
        "Clarify acceptance criteria, split client and server, estimate three weeks, add a buffer.",
        "Better than a slogan, but a hidden buffer is not a spike, and you did not name the cut line.",
        ["questions", "breakdown", "estimate"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "Cut line: create from a template, invite by link, join up to N, persist furniture transforms. Out: custom mesh UGC, moderation console, voice, cross-region. Spike occupancy + reconnect on day 1. Show the two-week board vs the six-week board.",
          "A real MVP with non-goals and a spike.",
          ["breakdown", "estimate", "docs"]
        ),
        C(
          "B",
          "trap",
          "Agree to two weeks and quietly drop tests.",
          "You traded quality without telling Product. That is not leadership.",
          []
        ),
        C(
          "C",
          "weak",
          "Say no and wait for them to change the date.",
          "A flat no without a cut is not a plan.",
          []
        ),
        C(
          "D",
          "partial",
          "Ship invites only, rooms later.",
          "A cut, but invites without a room is not a usable MVP.",
          ["breakdown"]
        ),
      ],
      "Product wants it in two weeks. You believe a safe MVP is six. What is the cut line?"
    ),
  },
  "diag-15-incident": {
    mcq: block([
      C(
        "A",
        "trap",
        "Tell QA to try harder. We cannot act without a local repro. Keep the rollout going.",
        "You already have rates, devices, and stacks. Rolling forward is malpractice.",
        []
      ),
      C(
        "B",
        "weak",
        "I would debug the stacktrace myself until I find it, then hotfix.",
        "No halt, no owner split, no Product time-box. Hero debugging.",
        ["signals"]
      ),
      C(
        "C",
        "partial",
        "Halt rollout, read Crashlytics, try to match the device, then fix.",
        "Missing stakeholder comms, rollback vs hotfix decision, and postmortem of the matrix.",
        ["severity", "signals", "rollback"]
      ),
      C(
        "D",
        "best",
        "Halt staged rollout, pull crash rate/devices/OS/symbolicated stacks, decide rollback vs hotfix by blast radius. Match GPU family, memory pressure, language, and the room content. Assign an owner, give Product a time-boxed status, then dig. Afterward add the device-matrix gap and a soak test.",
        "Stop the bleed, evidence, comms, divide work, change the matrix.",
        ["severity", "signals", "rollback", "repro-strategy", "comms", "postmortem"]
      ),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "Me: go/no-go and plugin/native symbols. Junior: isolate whether the room content pack reproduces on one loaner device. Art: identify unique shaders/VFX in that room. QA: GPU-family matrix and a 15-minute soak. Status to Product every 30 minutes until we halt or hotfix.",
          "Clear owners, including yourself. No Slack pile-on.",
          ["repro-strategy", "comms"]
        ),
        C(
          "B",
          "trap",
          "Everyone debugs the plugin together until someone finds it.",
          "No owner, no content isolation, wasted parallel work.",
          []
        ),
        C(
          "C",
          "weak",
          "I take the plugin, junior watches, art waits, QA files a ticket.",
          "Art and QA are idle while a room-specific crash is likely content + driver.",
          []
        ),
        C(
          "D",
          "partial",
          "Split engineering vs QA. Art is not needed for a native crash.",
          "Room-specific often is content. Excluding art is a miss.",
          ["repro-strategy"]
        ),
      ],
      "Stack points at a native graphics plugin after 10 minutes in one room. How do you divide work?"
    ),
  },
  "cs-boxing": {
    mcq: block([
      C("A", "weak", "Boxing is converting int to float. It is slow in Update.", "Wrong definition.", []),
      C(
        "B",
        "best",
        "Boxing allocates a heap wrapper for a value type (object/interface). In Unity it shows up in non-generic collections, some LINQ, and enum keys. Confirm with GC Alloc before rewriting.",
        "Definition plus hot path plus proof.",
        ["box", "hot"]
      ),
      C("C", "trap", "Boxing never happens if you use structs.", "Structs box when passed as object/interfaces.", []),
      C("D", "partial", "Boxing puts value types on the heap. Avoid object in Update.", "Right idea, missing how you would prove it.", ["box"]),
    ]),
    followUpMcq: block([
      C("A", "best", "Allocation Callstacks / GC Alloc on the boxing site in a player build, then a single generic-collection change and a recapture.", "Proof loop.", ["hot"]),
      C("B", "weak", "If the code looks cleaner, ship it.", "Not evidence.", []),
      C("C", "trap", "Disable the GC.", "Not a strategy.", []),
      C("D", "partial", "Look at GC Alloc in the Profiler.", "Missing isolation and recapture.", ["hot"]),
    ]),
  }
};
