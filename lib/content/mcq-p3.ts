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

export const mcqBankPart3: Record<string, McqPack> = {
  "cs-idisposable": {
    mcq: block([
      C(
        "A",
        "best",
        "Dispose what you own: CTS, files, RenderTextures you created, subscriptions not tied to a MonoBehaviour. Do not wrap every MB in IDisposable or Dispose Unity objects you do not own.",
        "Ownership is the rule.",
        ["native"]
      ),
      C("B", "trap", "Every MonoBehaviour should implement IDisposable instead of OnDestroy.", "Unity already has a lifetime hook.", []),
      C("C", "weak", "Only native plugins need IDisposable.", "Managed subscriptions and CTS also do.", []),
      C("D", "partial", "Use IDisposable for events and textures.", "Too vague on ownership and double-dispose.", ["native"]),
    ]),
    followUpMcq: block([
      C("A", "best", "On scene unload you can dispose twice or dispose a shared RenderTexture still used by a camera. Guard with an owned flag.", "Real failure mode.", ["native"]),
      C("B", "weak", "Nothing; Dispose is idempotent by law.", "Not for your types unless you make it so.", []),
      C("C", "trap", "Call GC.Collect after Dispose.", "Not the issue.", []),
      C("D", "partial", "Watch ObjectDisposedException.", "Symptom, not the Unity-specific double-unload case.", []),
    ]),
  },
  "rd-occlusion": {
    mcq: block([
      C(
        "A",
        "best",
        "Baked occlusion uses occluder geometry and camera cells to skip hidden static renderers. Dynamically loaded furniture is not in that bake unless you add proxies or another runtime cull. It will not save fill rate on visible glass.",
        "Bake limits + transparency caveat.",
        ["bake", "dynamic"]
      ),
      C("B", "trap", "Occlusion culling automatically includes Addressable instances at runtime.", "Bake does not magically include streamed meshes.", []),
      C("C", "weak", "It hides off-screen objects like frustum culling.", "Occlusion is hidden-by-geometry, not off-screen.", []),
      C("D", "partial", "It is baked. Dynamic objects get less benefit.", "Missing transparents and proxies.", ["bake", "dynamic"]),
    ]),
    followUpMcq: block([
      C("A", "best", "Bake occluders into the room shell; stream props with LODs/proxies; do not expect baked occlusion to fix glass overdraw.", "Shell vs streamed vs fill rate.", ["bake", "dynamic"]),
      C("B", "weak", "Rebake occlusion every time a chair downloads.", "Not a mobile strategy.", []),
      C("C", "trap", "Disable frustum culling so occlusion has more to do.", "Nonsense.", []),
      C("D", "partial", "Use baked occlusion only on the office shell.", "Right half; missing streamed props.", ["bake"]),
    ]),
  },
  "rd-overdraw": {
    mcq: block([
      C(
        "A",
        "best",
        "Overdraw is shading the same pixel more than once. Transparents do not occlude, so stacked glass, particles, and UI fill the GPU even when draw calls look fine.",
        "Definition + why interiors hurt.",
        ["od"]
      ),
      C("B", "weak", "Overdraw means too many draw calls.", "That is submit cost, not fill rate.", []),
      C("C", "trap", "Transparent objects are cheap because they have fewer triangles.", "Fill rate does not care about your triangle comfort.", []),
      C("D", "partial", "Alpha blending is expensive in interiors.", "True but incomplete: no pixel-level definition.", ["od"]),
    ]),
    followUpMcq: block([
      C("A", "best", "Overdraw view / Frame Debugger, then cut overlapping glass, particle screenspace, and split UI canvases. Recapture GPU time.", "Measure, change content, recapture.", ["od"]),
      C("B", "trap", "Add more realtime lights so the room feels less flat.", "Makes GPU worse.", []),
      C("C", "weak", "Increase target frame rate in QualitySettings.", "Does not reduce fill.", []),
      C("D", "partial", "Reduce particles.", "One lever only.", ["od"]),
    ]),
  },
  "pf-cpu-gpu": {
    mcq: block([
      C(
        "A",
        "best",
        "On a development player, compare main-thread CPU, render thread, and GPU time. CPU waiting on GPU → GPU-bound. Scripts/physics/UI eating the frame with GPU idle → CPU-bound. Editor numbers are not the device; thermals can appear later.",
        "Classification on device.",
        ["tools", "device"]
      ),
      C("B", "trap", "If fps is below 30 it is GPU. If scripts look busy it is CPU.", "fps is not a classifier.", []),
      C("C", "weak", "Look at the Profiler CPU module in the editor.", "Missing GPU and player.", ["tools"]),
      C("D", "partial", "Check whether GPU time is high in the Profiler.", "Need the comparison and a player build.", ["tools"]),
    ]),
    followUpMcq: block([
      C("A", "best", "After minutes on device, clocks drop. A 30-second editor capture will lie. Soak, then recapture.", "Thermals.", ["device"]),
      C("B", "weak", "Ignore thermals; we ship with fans.", "Phones throttle.", []),
      C("C", "trap", "Raise quality when thermals hit so the user notices less.", "Opposite of a budget.", []),
      C("D", "partial", "Test for several minutes on device.", "Right, missing what you compare.", ["device"]),
    ]),
  },
  "as-resources": {
    mcq: block([
      C(
        "A",
        "best",
        "Resources: tiny local set baked into the player. AssetBundles: packing format. Addressables: catalogs, remote host, ref-counting. Large selectable rooms belong on Addressables, not Resources.",
        "When to use each.",
        ["res", "addr"]
      ),
      C("B", "trap", "Resources is fine if you call UnloadUnusedAssets.", "Size and duplication still kill you.", []),
      C("C", "weak", "Always Addressables for every sprite.", "Overkill for a 20 KB icon.", []),
      C("D", "partial", "Addressables wrap bundles and support remote content.", "Missing why Resources is wrong for rooms.", ["addr"]),
    ]),
    followUpMcq: block([
      C("A", "best", "Two groups both pull the same mesh because it was not in a shared bundle. Memory Profiler shows duplicates. Fix grouping, not just Release.", "Duplication path.", ["addr"]),
      C("B", "weak", "Unity always duplicates Addressables. Live with it.", "False.", []),
      C("C", "trap", "Put the mesh in Resources to share it.", "Makes the player bigger.", []),
      C("D", "partial", "Check the bundle layout for duplicates.", "Right check, missing the shared-group fix.", ["addr"]),
    ]),
  },
  "nt-interp": {
    mcq: block([
      C(
        "A",
        "best",
        "Interpolation plays remote snapshots slightly in the past. Prediction guesses local movement and reconciles. A shared tablet should not be predicted by two clients; server occupancy, others interpolate.",
        "Clear split plus shared-object rule.",
        ["interp", "pred"]
      ),
      C("B", "trap", "Predict the tablet on both clients so it feels instant. Server can fix it later.", "Dual prediction is fighting.", []),
      C("C", "weak", "Interpolation and prediction are the same: hiding lag.", "They are not the same.", []),
      C("D", "partial", "Interpolate remotes, predict local avatar movement.", "Missing the tablet rule.", ["interp", "pred"]),
    ]),
    followUpMcq: block([
      C("A", "best", "Same tick: server serializes, one owner, loser reconciles. No dual hold.", "Race answer.", ["pred"]),
      C("B", "trap", "Merge both transforms.", "Corruption.", []),
      C("C", "weak", "Drop both requests.", "Punishes both users without a rule.", []),
      C("D", "partial", "First packet wins.", "Need a defined server order and a fail signal.", []),
    ]),
  },
  "ld-deadline": {
    mcq: block([
      C(
        "A",
        "best",
        "Put current frame time and crash risk on the table. Offer cuts: template rooms without UGC, lower mobile shadows, or slip the date. Do not silently accept a date that burns the team and the product.",
        "Evidence + options, not a flat no or a silent yes.",
        ["options", "evidence"]
      ),
      C("B", "trap", "Say yes and hope we optimize in crunch.", "The performance problem is already the requirement.", []),
      C("C", "weak", "Say no. Performance comes first. End of discussion.", "No options, no stakeholder path.", []),
      C("D", "partial", "Show Profiler data and ask for more time.", "Evidence without a cut still leaves them with one door.", ["evidence"]),
    ]),
    followUpMcq: block([
      C("A", "best", "Treat frame time as an acceptance criterion in the written plan, with a device named. Cuts are scope, not quality-secret.", "Budget as requirement.", ["options", "evidence"]),
      C("B", "weak", "Add a 'polish' ticket after launch.", "That ticket never wins.", []),
      C("C", "trap", "Hide the mid-range device from the test matrix.", "Fraud.", []),
      C("D", "partial", "Write the risk in the sprint notes.", "Writing is not a decision.", ["evidence"]),
    ]),
  },
  "ld-disagreement": {
    mcq: block([
      C(
        "A",
        "best",
        "Steelman their design through reconnect, two-user grab, and mobile pause. Time-box a spike if risk is high. Document one decision and a review date. Disagreement is useful; two architectures in the codebase are not.",
        "Failure modes + written decision.",
        ["listen", "decide"]
      ),
      C("B", "trap", "I am the lead so we do my design. They can catch up.", "You may not even have the title. Winning by rank fails.", []),
      C("C", "weak", "Let both implementations coexist until we see which is popular.", "Incompatible occupancy models will ship bugs.", []),
      C("D", "partial", "Have a meeting and take notes.", "No time-box, no failure-mode test.", ["listen"]),
    ]),
    followUpMcq: block([
      C("A", "best", "The spike is a two-client grab under loss, plus pause while holding a lock. Whichever design fails less on those becomes the recorded decision.", "Testable criterion.", ["decide"]),
      C("B", "weak", "The more senior person's preference.", "Seniority is not a test.", []),
      C("C", "trap", "Ship both behind ifdefs.", "A fork, not a decision.", []),
      C("D", "partial", "Prototype both for a day.", "Need the failure scenarios, not just calendar time.", ["listen"]),
    ]),
  },
  "sd-rooms": {
    mcq: block([
      C(
        "A",
        "best",
        "Assumptions: 30 users, dedicated server, persist layout, remote content, mobile suspend. Clients download a compatible pack, join server-authoritative occupancy, interpolate remotes, lock shared objects on the server. Reconnect loads a snapshot. Voice is a separate plane. Version mismatch refuses join.",
        "Assumptions first, then authority, content, failure.",
        ["assumptions", "auth", "content", "fail"]
      ),
      C("B", "trap", "One listen-server PC hosts; mobile clients are thin clients with client-owned furniture.", "Host migration and cheats aside, mobile hosts will not hold 30 users.", []),
      C("C", "weak", "Mirror/NGO default sample, plus Addressables.", "A sample is not an architecture.", []),
      C("D", "partial", "Dedicated server, Addressables rooms, interpolate avatars.", "Missing occupancy, reconnect snapshot, and version mismatch.", ["auth", "content"]),
    ]),
    followUpMcq: block(
      [
        C(
          "A",
          "best",
          "Cap room pack size, stream LODs, pause downloads on 2G-equivalent, keep lobby offline-capable, reduce tick/interest so snapshots fit lossy links, and never require 200 MB free if the active room is smaller—evict cache. Two-user grab still server-locked; prediction stays off for tools.",
          "Hits disk, cellular, and loss without dropping authority.",
          ["fail", "content", "auth"]
        ),
        C("B", "trap", "Download the full 400 MB room on cellular so quality matches PC.", "Breaks the new constraints.", []),
        C("C", "weak", "PC only until mobile networks improve.", "The job is Mobile + PC.", []),
        C("D", "partial", "Smaller mobile bundles and a retry button.", "Missing interest/tick and disk eviction.", ["content"]),
      ],
      "Constraint: cellular only, 200 MB disk on mobile, two users on high loss. How does the design change?"
    ),
  }
};
