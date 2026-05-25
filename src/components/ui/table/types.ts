const SKELETON_WIDTHS = ["w-1/3", "w-1/2", "w-2/3", "w-3/4", "w-4/5"];
export const skeletonWidth = (col: number, row: number) =>
  SKELETON_WIDTHS[(col * 3 + row) % SKELETON_WIDTHS.length];

export type SortDirection = "asc" | "desc" | null;

export type TableColumn<T> = {
  key: keyof T | "actions";
  label: string;
  /** Custom cell renderer. Receives the full row object. */
  render?: (row: T) => React.ReactNode;
  /** Allow sorting on this column (only works when key is keyof T). */
  sortable?: boolean;
  /** Extra className forwarded to both <th> and <td>. */
  className?: string;
  /** Align cell content. Defaults to "left". */
  align?: "left" | "center" | "right";
  /** Tailwind width class OR css width value */
  width?: string;
};

export interface DynamicTableProps<T> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Row data */
  data?: T[];

  // ── Pagination ──────────────────────────────────────────────────────────────
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  /** Hide the whole pagination bar */
  pagination?: boolean;
  /** Hide the "rows per page" selector */
  showRowsPerPage?: boolean;
  rowsPerPageOptions?: number[];

  // ── Search ──────────────────────────────────────────────────────────────────
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;

  // ── Selection ───────────────────────────────────────────────────────────────
  selectable?: boolean;
  selectedRows?: T[];
  onSelectChange?: (rows: T[]) => void;
  /** Unique key extractor for stable identity comparison (defaults to object ref) */
  rowKey?: (row: T) => string | number;

  // ── State ───────────────────────────────────────────────────────────────────
  loading?: boolean;
  /** Message shown when data is empty */
  emptyMessage?: React.ReactNode;

  // ── Sorting (controlled) ────────────────────────────────────────────────────
  sortKey?: keyof T | null;
  sortDirection?: SortDirection;
  onSortChange?: (key: keyof T, direction: SortDirection) => void;

  // ── Appearance ───────────────────────────────────────────────────────────────
  className?: string;
  /** Number of skeleton rows shown while loading */
  skeletonRows?: number;
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Stripe alternate rows */
  striped?: boolean;
  /** Show a serial-number column as the first column */
  showSerialNumber?: boolean;

  renderExpandedRow?: (row: T) => React.ReactNode;
  expandedRowId?: string | number | null;
  onToggleExpand?: (row: T) => void;
  getRowId?: (row: T) => string | number;
}
