"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActiveMcq } from "@/lib/trainer/engine";
import { useLab } from "@/components/lab/lab-context";
import { cn } from "@/lib/utils";
import type { Choice } from "@/lib/trainer/types";

export function Composer() {
  const { state, send } = useLab();
  const [command, setCommand] = useState("");
  const mcq = getActiveMcq(state);
  const choosing = Boolean(mcq) && (state.phase === "question" || state.phase === "follow-up");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!choosing) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const letter = e.key.toUpperCase();
      if (letter === "A" || letter === "B" || letter === "C" || letter === "D") {
        e.preventDefault();
        send(letter);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choosing, send]);

  function submitCommand() {
    const text = command.trim();
    if (!text) return;
    send(text.startsWith("/") ? text : `/${text}`);
    setCommand("");
  }

  return (
    <div className="border-t border-border bg-background/95 p-3 backdrop-blur md:p-4">
      <div className="mx-auto max-w-3xl">
        {choosing && mcq ? (
          <div className="mb-3 flex flex-col gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {state.phase === "follow-up" ? "Follow-up · choose one" : "Choose the best answer"} · keys A–D
            </p>
            {mcq.choices.map((choice) => (
              <ChoiceButton key={choice.id} choice={choice} onPick={() => send(choice.id)} />
            ))}
          </div>
        ) : (
          <p className="mb-3 text-sm text-muted-foreground">
            {state.phase === "complete"
              ? "Diagnostic block finished. Run /learn, /drill, or /mock from the command line."
              : "No active multiple-choice item. Use a command below."}
          </p>
        )}

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submitCommand();
          }}
        >
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="/learn networking  ·  /diagnose  ·  /mock technical"
            className="h-10 flex-1 rounded-md border border-border bg-card px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Trainer command"
          />
          <Button type="submit" size="icon" disabled={!command.trim()} aria-label="Run command">
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChoiceButton({ choice, onPick }: { choice: Choice; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "flex gap-3 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:border-accent/60 hover:bg-muted/40"
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-accent/40 font-mono text-sm text-accent">
        {choice.id}
      </span>
      <span className="text-[14.5px] leading-snug text-foreground">{choice.text}</span>
    </button>
  );
}
