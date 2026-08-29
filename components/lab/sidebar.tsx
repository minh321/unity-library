"use client";

import { BookOpen, GraduationCap, RotateCcw, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLab } from "@/components/lab/lab-context";
import { commandHelp } from "@/lib/content/briefing";
import { modules } from "@/lib/content/modules";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { state, send, reset, matrix } = useLab();
  const done = state.questionIndex + (state.phase === "complete" ? 1 : 0);
  const total = Math.max(1, state.questionQueue.length);
  const pct = state.phase === "complete" ? 100 : (done / total) * 100;
  const p0 = matrix.filter((r) => r.priority === "P0").slice(0, 4);

  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar">
      <div className="px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
          Unity Lead Lab
        </p>
        <h1 className="mt-1 font-serif text-xl leading-tight text-foreground">
          Team Leader interview trainer
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          3D simulation · online rooms · Mobile + PC. Strict, measurement-first, no invented
          experience.
        </p>
      </div>
      <Separator />
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{state.mode.replace("-", " ")}</span>
          <span>
            {Math.min(done + 1, total)}/{total}
          </span>
        </div>
        <Progress value={pct} className="mt-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Phase: {state.phase}
          {state.examCoaching ? "" : " · exam (no coaching)"}
        </p>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="px-3 py-3">
          <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Commands
          </p>
          <div className="flex flex-col gap-0.5">
            {commandHelp.slice(0, 12).map((c) => (
              <button
                key={c.cmd}
                type="button"
                onClick={() => {
                  if (c.cmd.startsWith("/learn")) send("/learn");
                  else if (c.cmd.includes("[")) send(`${c.cmd.split(" ")[0]} profiling`);
                  else send(c.cmd);
                }}
                className="rounded-md px-2 py-1.5 text-left text-[13px] text-foreground/90 hover:bg-muted"
                title={c.why}
              >
                <span className="font-mono text-accent">{c.cmd.split(" ")[0]}</span>
                <span className="ml-1 text-muted-foreground">
                  {c.cmd.includes(" ") ? c.cmd.slice(c.cmd.indexOf(" ")) : ""}
                </span>
              </button>
            ))}
          </div>
          <p className="mb-2 mt-4 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Modules
          </p>
          <div className="flex flex-col gap-0.5">
            {modules.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => send(`/learn ${m.letter}`)}
                className="flex items-start gap-2 rounded-md px-2 py-1.5 text-left hover:bg-muted"
              >
                <span className="font-mono text-xs text-accent">{m.letter}</span>
                <span className="text-[13px] leading-snug text-foreground">{m.title}</span>
              </button>
            ))}
          </div>
          <p className="mb-2 mt-4 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            P0 gaps
          </p>
          <div className="flex flex-col gap-2 px-1 pb-4">
            {p0.length === 0 ? (
              <p className="text-xs text-muted-foreground">Answer diagnostic questions to rank gaps.</p>
            ) : (
              p0.map((r) => (
                <button
                  key={r.area}
                  type="button"
                  onClick={() => send(`/learn ${r.label.split(" ")[0].toLowerCase()}`)}
                  className="rounded-md border border-border bg-card px-2 py-2 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{r.label}</span>
                    <span className="font-mono text-xs text-danger">{r.current.toFixed(1)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{r.gap}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </ScrollArea>
      <Separator />
      <div className="flex gap-2 p-3">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => send("/matrix")}>
          <Target className="h-3.5 w-3.5" />
          Matrix
        </Button>
        <Button size="sm" variant="outline" className="flex-1" onClick={() => send("/weaknesses")}>
          <BookOpen className="h-3.5 w-3.5" />
          Gaps
        </Button>
        <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset session">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </aside>
  );
}

export function MobileBar() {
  const { send } = useLab();
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
      {[
        ["/diagnose", "Diagnose"],
        ["/learn networking", "Learn"],
        ["/mock technical", "Mock"],
        ["/stories", "Stories"],
        ["/matrix", "Matrix"],
      ].map(([cmd, label]) => (
        <Button key={cmd} size="sm" variant="outline" onClick={() => send(cmd)}>
          {label}
        </Button>
      ))}
    </div>
  );
}

export function ModeChip({ className }: { className?: string }) {
  const { state } = useLab();
  return (
    <Badge className={cn("border-accent/40 text-accent", className)}>
      <GraduationCap className="mr-1 h-3 w-3" />
      {state.mode}
    </Badge>
  );
}
