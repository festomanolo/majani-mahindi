import { cn } from "@/lib/utils";

export function Spinner({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "sm" && "size-4",
        size === "md" && "size-6",
        size === "lg" && "size-8",
        className,
      )}
    />
  );
}
