"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/filter-select";
import { useI18n } from "@/lib/i18n";

export function usePagination<T>(items: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, pageCount);
  const rows = useMemo(
    () => items.slice((current - 1) * pageSize, current * pageSize),
    [items, current, pageSize],
  );
  return { rows, page: current, pageCount, pageSize, total: items.length, setPage, setPageSize };
}

export function TablePagination({
  page,
  pageCount,
  pageSize,
  total,
  setPage,
  setPageSize,
}: Omit<ReturnType<typeof usePagination>, "rows">) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted-foreground tabular-nums">
        {t("{from}–{to} of {total}", { from, to, total })}
      </p>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-muted-foreground">{t("Rows per page")}</span>
          <FilterSelect
            value={String(pageSize)}
            onChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
            options={["5", "10", "20"]}
          />
        </div>
        <span className="tabular-nums">
          {t("Page {page} of {count}", { page, count: pageCount })}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label={t("First page")} disabled={page === 1} onClick={() => setPage(1)}>
            <ChevronsLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label={t("Previous page")} disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label={t("Next page")} disabled={page === pageCount} onClick={() => setPage(page + 1)}>
            <ChevronRight />
          </Button>
          <Button variant="outline" size="icon" aria-label={t("Last page")} disabled={page === pageCount} onClick={() => setPage(pageCount)}>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
