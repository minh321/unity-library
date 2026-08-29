import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
