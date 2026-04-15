export const getAttendanceStatusStyleMap = (isDark: boolean) => ({
  present: {
    backgroundColor: isDark ? "#14532d33" : "#dcfce7",
    color: isDark ? "#16a34a" : "#15803d",
  },

  absent: {
    backgroundColor: isDark ? "#7f1d1d33" : "#fee2e2",
    color: isDark ? "#dc2626" : "#b91c1c",
  },

  late: {
    backgroundColor: isDark ? "#78350f33" : "#fef3c7",
    color: isDark ? "#d97706" : "#b45309",
  },

  half_day: {
    backgroundColor: isDark ? "#1e3a8a33" : "#dbeafe",
    color: isDark ? "#3b82f6" : "#1d4ed8",
  },

  on_leave: {
    backgroundColor: isDark ? "#4c1d9533" : "#ede9fe",
    color: isDark ? "#7c3aed" : "#6d28d9",
  },
});
