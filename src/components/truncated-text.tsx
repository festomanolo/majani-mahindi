import { cn } from "@/lib/utils";

/** Truncates overflowing text with an ellipsis and optional tooltip */
export function TruncatedText({ text, className }: { text: string; className?: string }) {
  return (
    <span title={text} className={cn("block truncate", className)}>
      {text}
    </span>
  );
}
