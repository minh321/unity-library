"use client";

import { useState } from "react";
import { evaluateAnswer } from "@/lib/trainer/evaluate";
import type { Question } from "@/lib/trainer/types";
import { useEncyclopedia } from "./provider";
import { cn } from "@/lib/utils";

export function PracticeBlock({
  topicTitle,
  questions,
}: {
  topicTitle: string;
  questions: Question[];
}) {
  const { askAbout } = useEncyclopedia();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  if (questions.length === 0) return null;

  const q = questions[index];
  const choices = q.mcq?.choices ?? [];
  const evald = picked ? evaluateAnswer(q, picked, "follow-up") : null;
  const best = choices.find((c) => c.tier === "best");
  const selected = choices.find((c) => c.id === picked);

  return (
    <section className="mt-10 rounded-xl border border-border bg-card p-5">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Check yourself · {index + 1} of {questions.length}
      </p>
      <h2 className="mt-2 font-serif text-2xl tracking-tight">{topicTitle}</h2>
      <p className="mt-4 text-[15px] leading-7">{q.prompt}</p>
      <div className="mt-4 grid gap-2">
        {choices.map((c) => {
          const selectedChoice = picked === c.id;
          const show = Boolean(evald);
          return (
            <button
              key={c.id}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => setPicked(c.id)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left text-sm leading-6",
                selectedChoice ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40",
                show && c.tier === "best" ? "ring-1 ring-pass/50" : ""
              )}
            >
              <span className="mr-2 font-semibold text-accent">{c.id}.</span>
              {c.text}
            </button>
          );
        })}
      </div>
      {evald && selected ? (
        <div className="mt-4 space-y-3 rounded-lg border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">
              {selected.tier === "best" ? "Best option." : "Not the strongest option."}
            </span>{" "}
            {selected.why}
          </p>
          {best ? (
            <p>
              <span className="text-accent">Best answer was {best.id}:</span> {best.text}
            </p>
          ) : null}
          <p className="text-foreground">{evald.deepAnswer}</p>
          <div className="flex flex-wrap gap-2">
            {index < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setIndex((i) => i + 1);
                  setPicked(null);
                }}
                className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
              >
                Next check
              </button>
            ) : (
              <p className="text-xs text-pass">All checks for this article are done.</p>
            )}
            <button
              type="button"
              onClick={() =>
                askAbout(
                  `I picked ${picked} on: ${q.prompt.slice(0, 140)}. Why is the best option stronger?`
                )
              }
              className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Ask the trainer about this check
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
