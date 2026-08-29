import { areaMeta, areaOrder } from "@/lib/content/areas";
import { diagnosticQuestions } from "@/lib/content/diagnostic";
import type { Evaluation, SkillArea, SkillRow } from "@/lib/trainer/types";
import { average, round1 } from "@/lib/utils";

const PRIORITY_BY_GAP: Record<SkillArea, "P0" | "P1" | "P2" | "P3"> = {
  networking: "P0",
  leadership: "P0",
  profiling: "P0",
  "unity-architecture": "P0",
  "technical-english": "P1",
  rendering: "P1",
  assets: "P1",
  requirements: "P1",
  mentoring: "P1",
  conflict: "P1",
  estimation: "P1",
  memory: "P1",
  "cross-platform": "P1",
  "oop-solid": "P2",
  "unity-lifecycle": "P2",
  animation: "P2",
  physics: "P2",
  ui: "P2",
  testing: "P2",
  debugging: "P2",
  documentation: "P2",
  "csharp-fundamentals": "P2",
  "advanced-csharp": "P2",
  "design-patterns": "P2",
  dsa: "P3",
};

const BACKGROUND_FLOOR: Partial<Record<SkillArea, number>> = {
  "csharp-fundamentals": 3,
  "advanced-csharp": 2.5,
  "oop-solid": 3,
  "design-patterns": 2.5,
  dsa: 2,
  "unity-lifecycle": 3,
  "unity-architecture": 2.5,
  profiling: 3,
  rendering: 2.5,
  memory: 3,
  assets: 3,
  animation: 3,
  physics: 2.5,
  ui: 2.5,
  networking: 2,
  "cross-platform": 3,
  testing: 2,
  debugging: 3.5,
  documentation: 2.5,
  estimation: 2.5,
  leadership: 2.5,
  mentoring: 2.5,
  conflict: 2,
  requirements: 2.5,
  "technical-english": 2.5,
};

function areaEvaluations(
  evals: Record<string, Evaluation[]>,
  area: SkillArea
): Evaluation[] {
  const out: Evaluation[] = [];
  for (const q of diagnosticQuestions) {
    if (q.area === area || q.relatedAreas?.includes(area)) {
      const list = evals[q.id];
      if (list?.length) out.push(...list);
    }
  }
  return out;
}

export function computeSkillMatrix(
  evals: Record<string, Evaluation[]>
): SkillRow[] {
  return areaOrder.map((area) => {
    const related = areaEvaluations(evals, area);
    const answered = related.length > 0;
    const overalls = related.map((e) => e.overall);
    const evidenceScore = related.map((e) => e.scores.evidence);
    const comm = related.map((e) => e.scores.communication);
    const floor = BACKGROUND_FLOOR[area] ?? 1;
    const measured = answered ? average(overalls) : floor - 0.4;
    const current = round1(
      clampMix(measured, floor, answered ? 0.75 : 0.15)
    );
    const target = areaMeta[area].target;
    const gapPoints = Math.max(0, target - current);
    const evidence = answered
      ? `Diagnostic answers (${related.length} scored). Evidence avg ${round1(average(evidenceScore))}, communication ${round1(average(comm))}.`
      : "Not directly tested yet. Conservative floor from stated background only.";
    const gap = gapText(area, current, target, answered);
    const priority = gapPoints >= 2 ? bump(PRIORITY_BY_GAP[area]) : PRIORITY_BY_GAP[area];
    return {
      area,
      label: areaMeta[area].label,
      current,
      target,
      evidence,
      gap,
      priority,
    };
  });
}

function clampMix(measured: number, floor: number, weight: number) {
  const v = measured * weight + floor * (1 - weight);
  return Math.min(5, Math.max(0, v));
}

function bump(p: "P0" | "P1" | "P2" | "P3"): "P0" | "P1" | "P2" | "P3" {
  if (p === "P3") return "P2";
  if (p === "P2") return "P1";
  return "P0";
}

function gapText(area: SkillArea, current: number, target: number, answered: boolean) {
  if (current >= target) return "At target. Keep sharp with drills.";
  const map: Partial<Record<SkillArea, string>> = {
    networking:
      "Explain authority, interpolation vs prediction, reconnection, and occupancy without inventing production 3D-MMO experience.",
    leadership:
      "Convert informal ownership (migrations, live stability, coordination) into STAR stories. Do not claim the title.",
    profiling:
      "Speak a measurement-first process: CPU vs GPU, tools, one change, device validation.",
    "unity-architecture":
      "Describe boundaries, thin MonoBehaviours, bootstrap, and content as a product—not a scene.",
    "technical-english":
      "60–90 second structure. I/we split. Fewer filler words.",
    rendering:
      "Define batching vs instancing vs SRP Batcher, and separate draw calls from fill rate.",
    assets:
      "Addressables ref-counts, remote catalogs, version mismatch, failed downloads.",
    requirements:
      "Turn slogans into MVP cuts, risks, and ranges.",
    mentoring: "Diagnose, protect the release, coach with examples.",
    conflict: "Evidence, options, respect, escalation path.",
    estimation: "Ranges, spikes, and explicit uncertainty.",
    memory: "Snapshot comparison and when Release does not free native memory.",
  };
  const prefix = answered ? "" : "Untested. ";
  return prefix + (map[area] ?? `Raise from ${current} to ${target} with production explanations, not definitions.`);
}

export function prepPlan(rows: SkillRow[]) {
  const p0 = rows.filter((r) => r.priority === "P0").map((r) => r.label);
  const p1 = rows.filter((r) => r.priority === "P1").slice(0, 6).map((r) => r.label);
  return {
    weeks: [
      {
        name: "Focus block 1 — Interview-critical gaps",
        items: [
          "Networking collaboration model (honest + complete)",
          "Measurement-first optimization spoken drill",
          "Lead intro and five STAR stories",
        ],
        areas: p0,
      },
      {
        name: "Focus block 2 — Senior Unity depth",
        items: [
          "Rendering trade-offs for interiors on mobile",
          "Addressables delivery and unload",
          "Architecture of interaction + rooms",
        ],
        areas: p1,
      },
      {
        name: "Focus block 3 — Lead behaviors",
        items: [
          "Requirement → MVP → estimate under pressure",
          "Incident command and stakeholder updates",
          "Code review and mentoring scenarios",
        ],
        areas: ["Leadership", "Mentoring", "Requirements"],
      },
      {
        name: "Focus block 4 — Full mocks",
        items: [
          "/mock technical",
          "/mock leadership",
          "/mock system-design",
          "/mock english",
          "/final-exam",
        ],
        areas: ["All"],
      },
    ],
    daily: [
      "One 90-second spoken answer recorded out loud",
      "One measurement-first optimization explanation",
      "One honest-gap sentence for a topic you have not shipped",
    ],
  };
}
