import { useTheme } from "@/src/contexts";

/**
 * Priority styles
 */
export const getPriorityStyle = (priority: "high" | "medium" | "low") => {
  // NOTE: theme hook cannot be used here directly
  // so we pass theme externally
  return priority;
};

export const getPriorityStyleMap = (isDark: boolean) => ({
  high: {
    backgroundColor: isDark ? "#78350f33" : "#fef3c7",
    color: isDark ? "#fcd34d" : "#b45309",
  },
  medium: {
    backgroundColor: isDark ? "#1f293733" : "#f3f4f6",
    color: isDark ? "#d1d5db" : "#374151",
  },
  low: {
    backgroundColor: isDark ? "#14532d33" : "#dcfce7",
    color: isDark ? "#86efac" : "#15803d",
  },
});

/**
 * Status styles
 */
export const getStatusStyleMap = (isDark: boolean) => ({
  assigned: {
    bg: isDark ? "#1e3a8a33" : "#dbeafe",
    color: isDark ? "#93c5fd" : "#1d4ed8",
  },
  unassigned: {
    bg: isDark ? "#7f1d1d33" : "#fee2e2",
    color: isDark ? "#fca5a5" : "#dc2626",
  },
  in_progress: {
    bg: isDark ? "#14532d33" : "#dcfce7",
    color: isDark ? "#86efac" : "#15803d",
  },
  follow_up: {
    bg: isDark ? "#37415133" : "#e5e7eb",
    color: isDark ? "#d1d5db" : "#374151",
  },
  closed: {
    bg: isDark ? "#11182733" : "#e5e7eb",
    color: isDark ? "#9ca3af" : "#374151",
  },
});
