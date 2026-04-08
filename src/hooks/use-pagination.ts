import { useState, useMemo } from "react";

/** Paginate an array of items; returns the current page slice and controls */
export function usePagination<T>(items: T[], pageSize = 20) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const paged = useMemo(
    () => items.slice((clampedPage - 1) * pageSize, clampedPage * pageSize),
    [items, clampedPage, pageSize],
  );

  return {
    page: clampedPage,
    totalPages,
    paged,
    goTo: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    next: () => setPage((p) => Math.min(p + 1, totalPages)),
    prev: () => setPage((p) => Math.max(p - 1, 1)),
    hasNext: clampedPage < totalPages,
    hasPrev: clampedPage > 1,
  };
}
