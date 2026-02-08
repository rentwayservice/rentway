import { buttonVariants } from "@rentway/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@rentway/ui/lib/utils";

export interface PaginationProps {
  /** Current page (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Base path (e.g. /cars) */
  basePath: string;
  /** Existing search params to preserve */
  searchParams?: Record<string, string>;
  /** Param name for page number */
  pageParam?: string;
  className?: string;
}

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string>,
  pageParam: string
): string {
  const params = new URLSearchParams(searchParams);
  if (page <= 1) {
    params.delete(pageParam);
  } else {
    params.set(pageParam, String(page));
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
  pageParam = "page",
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
  const prevHref = buildHref(basePath, prevPage, searchParams, pageParam);
  const nextHref = buildHref(basePath, nextPage, searchParams, pageParam);

  const getPageHref = (page: number) =>
    buildHref(basePath, page, { ...searchParams }, pageParam);

  const pageNumbers = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Link
        aria-disabled={currentPage <= 1}
        aria-label="Previous page"
        className={cn(
          buttonVariants({ size: "icon", variant: "outline" }),
          currentPage <= 1 &&
            "pointer-events-none opacity-50"
        )}
        href={prevHref}
      >
        <ChevronLeft className="size-4" />
      </Link>
      <ul className="flex items-center gap-1">
        {pageNumbers.map((page, idx) => {
          const key =
            page === "ellipsis"
              ? `ellipsis-${idx}-${String(pageNumbers[idx - 1])}-${String(pageNumbers[idx + 1])}`
              : page;
          return page === "ellipsis" ? (
            <li
              aria-hidden
              className="flex size-9 items-center justify-center px-2"
              key={key}
            >
              <span className="text-muted-foreground">…</span>
            </li>
          ) : (
            <li key={page}>
              <Link
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={buttonVariants({
                  size: "icon",
                  variant: page === currentPage ? "default" : "outline",
                })}
                href={getPageHref(page)}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>
      <Link
        aria-disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={cn(
          buttonVariants({ size: "icon", variant: "outline" }),
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
        href={nextHref}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}

function getVisiblePages(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  const showLeft = currentPage > 2;
  const showRight = currentPage < totalPages - 1;

  if (showLeft) {
    pages.push(1);
    if (currentPage > 3) {
      pages.push("ellipsis");
    }
  }
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (showRight) {
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }
    pages.push(totalPages);
  }
  return [...new Set(pages)].sort((a, b) => {
    if (a === "ellipsis") {
      return 1;
    }
    if (b === "ellipsis") {
      return -1;
    }
    return a - b;
  });
}
