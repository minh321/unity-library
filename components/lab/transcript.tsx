"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLab } from "@/components/lab/lab-context";
import { EvaluationCard } from "@/components/lab/evaluation-card";
import type { Message } from "@/lib/trainer/types";
import { cn } from "@/lib/utils";

function kindLabel(kind: Message["kind"]) {
  switch (kind) {
    case "briefing":
      return "Briefing";
    case "question":
      return "Question";
    case "follow-up":
      return "Follow-up";
    case "evaluation":
      return "Score";
    case "improved":
      return "Model";
    case "teach":
      return "Teach";
    case "recap":
      return "Recap";
    case "command":
      return "Command";
    default:
      return "Note";
  }
}

export function Transcript() {
  const { state } = useLab();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.messages.length]);

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 pb-40 md:pb-8">
        {state.messages.map((m) => (
          <MessageBlock key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}

function MessageBlock({ message }: { message: Message }) {
  if (message.role === "candidate") {
    return (
      <article className="ml-6 rounded-lg border border-border bg-candidate px-4 py-3 md:ml-16">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            You
          </span>
          <span className="text-[11px] text-muted-foreground">
            {message.kind === "command" ? "command" : "choice"}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
          {message.text}
        </p>
      </article>
    );
  }

  if (message.kind === "evaluation" && message.evaluation) {
    return <EvaluationCard evaluation={message.evaluation} />;
  }

  return (
    <article
      className={cn(
        "rounded-lg border px-4 py-3",
        message.kind === "question" || message.kind === "follow-up"
          ? "border-accent/40 bg-card"
          : "border-border bg-card/70"
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <Badge
          className={cn(
            message.kind === "question" && "border-accent/50 text-accent",
            message.kind === "follow-up" && "border-danger/40 text-danger"
          )}
        >
          {kindLabel(message.kind)}
        </Badge>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Trainer
        </span>
      </div>
      <div className="whitespace-pre-wrap font-serif text-[16.5px] leading-[1.55] text-foreground">
        {message.text}
      </div>
    </article>
  );
}
