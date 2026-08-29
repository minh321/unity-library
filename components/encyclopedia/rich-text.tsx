import { Fragment } from "react";

const token = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(token);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={i}
              className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.84em] text-accent"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
