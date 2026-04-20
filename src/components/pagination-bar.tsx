import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

/** Previous/next pagination controls. Renders null if only one page. */
export function PaginationBar({ page, totalPages, onPrev, onNext, hasNext, hasPrev }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className={cn(
          "flex items-center gap-1 text-sm transition-colors",
          hasPrev ? "text-foreground hover:text-primary" : "cursor-not-allowed text-muted-foreground",
        )}
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>
      <span className="font-mono text-xs text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className={cn(
          "flex items-center gap-1 text-sm transition-colors",
          hasNext ? "text-foreground hover:text-primary" : "cursor-not-allowed text-muted-foreground",
        )}
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
