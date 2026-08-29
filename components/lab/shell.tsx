"use client";

import { LabProvider, useLab } from "@/components/lab/lab-context";
import { Sidebar, MobileBar } from "@/components/lab/sidebar";
import { Transcript } from "@/components/lab/transcript";
import { Composer } from "@/components/lab/composer";
import { MatrixPanel } from "@/components/lab/matrix-panel";

function ShellInner() {
  const { ready } = useLab();
  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background font-serif text-xl text-muted-foreground">
        Opening the lab…
      </div>
    );
  }

  return (
    <div className="flex h-dvh bg-background text-foreground">
      <div className="hidden w-[280px] shrink-0 md:block">
        <Sidebar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Mock room
            </p>
            <p className="text-sm text-muted-foreground">
              Multiple choice. Pick the Team Lead answer. Keys A–D.
            </p>
          </div>
          <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
            No invented titles · measure first
          </p>
        </header>
        <MobileBar />
        <div className="min-h-0 flex-1">
          <Transcript />
        </div>
        <Composer />
      </div>
      <MatrixPanel />
    </div>
  );
}

export function LabShell() {
  return (
    <LabProvider>
      <ShellInner />
    </LabProvider>
  );
}
