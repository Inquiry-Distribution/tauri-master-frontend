import { useEffect } from "react";
import { DynamicTableProps, skeletonWidth, TableColumn } from "./types";
import { cn } from "@/src/utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import Checkbox from "../form/checkBox";
import SortIcon from "./sort";
import PaginationButton, { buildPages } from "./paginationButton";

function DynamicTable<T extends Record<string, any>>({
  columns,
  data = [],

  currentPage,
  rowsPerPage,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
  pagination = true,
  showRowsPerPage = true,
  rowsPerPageOptions = [10, 25, 50],

  searchTerm = "",
  onSearchChange,
  searchable = true,
  searchPlaceholder = "Search…",

  selectable = false,
  selectedRows,
  onSelectChange,
  rowKey,

  loading = false,
  emptyMessage = "No data found.",

  sortKey,
  sortDirection,
  onSortChange,

  className,
  skeletonRows = 4,
  onRowClick,
  striped = false,
  showSerialNumber = true,
}: DynamicTableProps<T>) {
  console.log("Rendering DynamicTable with data:", data);
  // ── Selection helpers ──────────────────────────────────────────────────────
  const safeSelected = selectedRows ?? [];

  const identity = (row: T) => (rowKey ? rowKey(row) : data.indexOf(row));

  const isSelected = (row: T) =>
    safeSelected.some((r) => identity(r) === identity(row));

  const toggleRow = (row: T) => {
    if (!onSelectChange) return;
    isSelected(row)
      ? onSelectChange(
          safeSelected.filter((r) => identity(r) !== identity(row)),
        )
      : onSelectChange([...safeSelected, row]);
  };

  const toggleAll = () => {
    if (!onSelectChange) return;
    safeSelected.length === data.length
      ? onSelectChange([])
      : onSelectChange([...data]);
  };

  // Reset selection when data changes
  useEffect(() => {
    onSelectChange?.([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ── Sorting ────────────────────────────────────────────────────────────────
  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable || col.key === "actions" || !onSortChange) return;
    const key = col.key as keyof T;
    if (sortKey !== key) return onSortChange(key, "asc");
    if (sortDirection === "asc") return onSortChange(key, "desc");
    onSortChange(key, null);
  };

  // ── Alignment helper ───────────────────────────────────────────────────────
  const alignClass = (align?: "left" | "center" | "right") =>
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  // ── Extra columns count (serial + checkbox) ────────────────────────────────
  const prefixCols = (showSerialNumber ? 1 : 0) + (selectable ? 1 : 0);
  const totalCols = columns.length + prefixCols;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* ── Toolbar ── */}
      {searchable && (
        <div className="flex items-center justify-between gap-3">
          <div className="relative">
            {/* Search icon */}
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-(--textMuted) pointer-events-none"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="7" cy="7" r="5" />
              <path d="m11 11 3 3" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className={cn(
                "pl-8 pr-3 py-1.5 rounded-md text-sm",
                "border border-(--border) bg-(--surface)",
                "text-(--text) placeholder:text-(--textMuted)",
                "focus:outline-none focus:ring-2 focus:ring-(--primary)/40",
                "transition-shadow",
              )}
            />
          </div>

          {selectable && safeSelected.length > 0 && (
            <span className="text-xs font-medium text-(--textMuted) tabular-nums">
              {safeSelected.length} row{safeSelected.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-xl border border-(--border) overflow-hidden">
        <Table>
          {/* ── Head ── */}
          <TableHeader>
            <TableRow>
              {/* Select-all checkbox */}
              {selectable && (
                <TableHead className="w-10 px-4">
                  <Checkbox
                    checked={
                      data.length > 0 && safeSelected.length === data.length
                    }
                    indeterminate={
                      safeSelected.length > 0 &&
                      safeSelected.length < data.length
                    }
                    onChange={toggleAll}
                  />
                </TableHead>
              )}

              {/* Serial number */}
              {showSerialNumber && (
                <TableHead className="w-14 text-(--textMuted) text-xs font-bold uppercase tracking-wider">
                  #
                </TableHead>
              )}

              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider text-(--textMuted)",
                    alignClass(col.align),
                    col.sortable &&
                      col.key !== "actions" &&
                      "cursor-pointer select-none hover:text-(--text) transition-colors",
                    col.className,
                  )}
                  onClick={() => handleSort(col)}
                >
                  <span className="inline-flex items-center">
                    {col.label}
                    {col.sortable && col.key !== "actions" && (
                      <SortIcon
                        direction={
                          sortKey === col.key ? (sortDirection ?? null) : null
                        }
                      />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {/* Loading skeleton */}
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, ri) => (
                <TableRow key={ri} className="animate-pulse">
                  {selectable && (
                    <TableCell className="w-10 px-4">
                      <div className="w-4 h-4 rounded bg-(--border)" />
                    </TableCell>
                  )}
                  {showSerialNumber && (
                    <TableCell>
                      <div className="h-3 w-6 rounded bg-(--border)" />
                    </TableCell>
                  )}
                  {columns.map((col, ci) => (
                    <TableCell key={String(col.key)}>
                      <div
                        className={cn(
                          "h-3 rounded bg-(--border)",
                          skeletonWidth(ci, ri),
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              /* Empty state */
              <TableRow>
                <TableCell
                  colSpan={totalCols}
                  className="py-16 text-center text-(--textMuted)"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-10 h-10 opacity-30"
                      fill="none"
                      viewBox="0 0 48 48"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <rect
                        x="6"
                        y="10"
                        width="36"
                        height="28"
                        rx="4"
                        strokeDasharray="4 2"
                      />
                      <path d="M6 18h36M16 10v28" />
                    </svg>
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* Data rows */
              data.map((row, ri) => {
                const selected = isSelected(row);
                const serialNum = (currentPage - 1) * rowsPerPage + ri + 1;

                return (
                  <TableRow
                    key={rowKey ? rowKey(row) : ri}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      onRowClick && "cursor-pointer",
                      striped && ri % 2 !== 0 && "bg-(--surface)/40",
                      selected && "bg-(--primary)/5",
                    )}
                  >
                    {/* Checkbox cell */}
                    {selectable && (
                      <TableCell
                        className="w-10 px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(row);
                        }}
                      >
                        <Checkbox
                          checked={selected}
                          onChange={() => toggleRow(row)}
                        />
                      </TableCell>
                    )}

                    {/* Serial number */}
                    {showSerialNumber && (
                      <TableCell className="text-(--textMuted) text-sm tabular-nums">
                        {serialNum}
                      </TableCell>
                    )}

                    {/* Data cells */}
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className={cn(alignClass(col.align), col.className)}
                      >
                        {col.render
                          ? col.render(row)
                          : col.key !== "actions"
                            ? String(row[col.key as keyof T] ?? "—")
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Rows per page */}
          {showRowsPerPage && (
            <div className="flex items-center gap-2 text-sm text-(--textMuted)">
              <span>Rows per page</span>
              <select
                title="Rows per page"
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
                className={cn(
                  "rounded-md border border-(--border) bg-(--surface)",
                  "text-(--text) text-sm px-2 py-1",
                  "focus:outline-none focus:ring-2 focus:ring-(--primary)/40",
                )}
              >
                {rowsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Page info + buttons */}
          <div className="flex items-center gap-1">
            {/* First */}
            <PaginationButton
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              «
            </PaginationButton>

            {/* Prev */}
            <PaginationButton
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ‹
            </PaginationButton>

            {buildPages(currentPage, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-1 text-(--textMuted) text-sm select-none"
                >
                  …
                </span>
              ) : (
                <PaginationButton
                  key={p}
                  active={currentPage === p}
                  onClick={() => onPageChange?.(p as number)}
                  aria-label={`Page ${p}`}
                  aria-current={currentPage === p ? "page" : undefined}
                >
                  {p}
                </PaginationButton>
              ),
            )}

            {/* Next */}
            <PaginationButton
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              ›
            </PaginationButton>

            {/* Last */}
            <PaginationButton
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              »
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicTable;
