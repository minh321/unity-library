"use client";

import type { Evaluation } from "@/lib/trainer/types";
import { verdictLabel } from "@/lib/trainer/evaluate";
import { cn } from "@/lib/utils";

const categories: { key: keyof Evaluation["scores"]; label: string }[] = [
  { key: "technicalCorrectness", label: "Technical" },
  { key: "depth", label: "Depth" },
  { key: "productionThinking", label: "Production" },
  { key: "leadership", label: "Leadership" },
  { key: "communication", label: "Communication" },
  { key: "evidence", label: "Evidence" },
];

export function EvaluationCard({ evaluation }: { evaluation: Evaluation; body?: string }) {
  const tone =
    evaluation.verdict === "team-lead" || evaluation.verdict === "senior"
      ? "pass"
      : evaluation.verdict === "mid"
        ? "mid"
        : "fail";

  return (
    <article className="rounded-lg border border-border bg-card px-4 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Verdict
          </p>
          <p
            className={cn(
              "font-serif text-2xl tracking-tight",
              tone === "pass" && "text-pass",
              tone === "mid" && "text-accent",
              tone === "fail" && "text-danger"
            )}
          >
            {verdictLabel(evaluation.verdict)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Would pass at {verdictLabel(evaluation.verdict).toLowerCase()}. Nothing above that.
          </p>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          Overall <span className="text-foreground">{evaluation.overall.toFixed(1)}</span> / 5
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {categories.map((c) => (
          <ScoreCell key={c.key} label={c.label} value={evaluation.scores[c.key]} />
        ))}
      </div>

      <section className="mt-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          What was strong
        </h3>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-sm">
          {evaluation.strong.length ? (
            evaluation.strong.map((s) => <li key={s}>{s}</li>)
          ) : (
            <li>Nothing I will give credit for yet.</li>
          )}
        </ul>
      </section>

      <section className="mt-3">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Problems
        </h3>
        <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-danger/90">
          {evaluation.problems.length ? (
            evaluation.problems.map((s) => <li key={s}>{s}</li>)
          ) : (
            <li className="text-muted-foreground">No major holes in this pass.</li>
          )}
        </ul>
      </section>

      {evaluation.englishNotes.length > 0 && (
        <section className="mt-3">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            English notes
          </h3>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {evaluation.englishNotes.map((n) => (
              <li key={n.issue}>
                <span className="text-foreground">{n.issue}.</span> {n.suggestion}
              </li>
            ))}
          </ul>
        </section>
      )}

      {evaluation.choiceReview && evaluation.choiceReview.length > 0 && (
        <section className="mt-4">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Your pick
          </h3>
          <ul className="mt-2 flex flex-col gap-2">
            {evaluation.choiceReview
              .filter((c) => c.selected || (evaluation.revealBest && c.best))
              .map((c) => (
                <li
                  key={c.id}
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    c.best && evaluation.revealBest
                      ? "border-pass/50 bg-pass/10"
                      : c.selected
                        ? "border-accent/40 bg-muted/40"
                        : "border-border"
                  )}
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {c.id}
                    {c.selected ? " · selected" : ""}
                    {c.best && evaluation.revealBest ? " · best" : ""}
                    {` · ${c.tier}`}
                  </p>
                  <p className="mt-1 leading-snug">{c.text}</p>
                  <p className="mt-1 text-muted-foreground">{c.why}</p>
                </li>
              ))}
          </ul>
        </section>
      )}

      <section className="mt-3">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Concepts
        </h3>
        <ul className="mt-1 grid gap-1 text-[13px] sm:grid-cols-2">
          {evaluation.hitConcepts.map((c) => (
            <li key={c.id} className={c.hit ? "text-pass" : "text-muted-foreground"}>
              {c.hit ? "✓" : "○"} {c.label}
              {c.required ? "" : " · bonus"}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function ScoreCell({ label, value }: { label: string; value: number }) {
  const color = value >= 4 ? "text-pass" : value >= 3 ? "text-accent" : "text-danger";
  return (
    <div className="rounded-md border border-border bg-muted/40 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("font-mono text-lg", color)}>{value.toFixed(1)}</p>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-current opacity-80" style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  );
}
