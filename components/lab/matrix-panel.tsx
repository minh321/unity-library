"use client";

import { useLab } from "@/components/lab/lab-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function MatrixPanel() {
  const { matrix, state } = useLab();
  const weak = [...state.progress].sort((a, b) => a.lastScore - b.lastScore).slice(0, 3);

  return (
    <aside className="hidden h-full w-[300px] shrink-0 flex-col border-l border-border bg-sidebar xl:flex">
      <div className="px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Skill matrix
        </p>
        <p className="mt-1 text-sm text-foreground">0–5 · target is Team Lead judgment</p>
      </div>
      <ScrollArea className="flex-1 px-3 pb-4">
        <div className="flex flex-col gap-1.5">
          {matrix.map((row) => (
            <div key={row.area} className="rounded-md border border-border/80 px-2 py-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] leading-tight text-foreground">{row.label}</span>
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    row.current + 0.4 >= row.target
                      ? "text-pass"
                      : row.priority === "P0"
                        ? "text-danger"
                        : "text-accent"
                  )}
                >
                  {row.current.toFixed(1)}/{row.target}
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full",
                    row.priority === "P0" ? "bg-danger" : "bg-accent"
                  )}
                  style={{ width: `${(row.current / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 px-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Recurring mistakes
          </p>
          <ul className="mt-2 space-y-2">
            {weak.length === 0 ? (
              <li className="text-xs text-muted-foreground">None recorded yet.</li>
            ) : (
              weak.map((w) => (
                <li key={w.topic} className="text-xs leading-snug text-muted-foreground">
                  <span className="text-foreground">{w.topic}</span>: {w.recurringMistake}
                </li>
              ))
            )}
          </ul>
        </div>
      </ScrollArea>
    </aside>
  );
}
