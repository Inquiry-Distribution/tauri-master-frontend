import { useMemo } from 'react';
import { ThemeTokens } from '../types';

export function useThemeTokens(dark: boolean): ThemeTokens {
  return useMemo(
    () => ({
      // ── Backgrounds ──────────────────────────────
      bg: dark ? "#0D1117" : "#F0F4F8",
      surface: dark ? "#161B27" : "#FFFFFF",
      surfaceElevated: dark ? "#1C2333" : "#FFFFFF",

      // ── Borders ──────────────────────────────────
      border: dark ? "#252D3D" : "#E2E8F0",
      borderLight: dark ? "#1E2533" : "#F1F5F9",

      // ── Text ─────────────────────────────────────
      text: dark ? "#E2E8F0" : "#1E293B",
      textSec: dark ? "#94A3B8" : "#475569",
      textMuted: dark ? "#4D5868" : "#94A3B8",

      // ── Accent / Primary (#4f7df3) ────────────────
      accent: dark ? "#6B8FF8" : "#4F7DF3",
      accentLight: dark ? "#1A2744" : "#EEF2FF",
      accentText: dark ? "#93B4FB" : "#3B6DE0",

      // ── Semantic: Success (green) ─────────────────
      success: dark ? "#34D399" : "#34D399",
      successLight: dark ? "#052E1C" : "#ECFDF5",

      // ── Semantic: Warning (orange) ────────────────
      warning: dark ? "#FB923C" : "#FB923C",
      warningLight: dark ? "#2D1500" : "#FFF7ED",

      // ── Semantic: Danger (red) ────────────────────
      danger: dark ? "#F87171" : "#F87171",
      dangerLight: dark ? "#2D0A0A" : "#FEF2F2",

      // ── Sidebar ───────────────────────────────────
      sidebarBg: dark ? "#0C1020" : "#FFFFFF",
      sidebarText: dark ? "#475569" : "#94A3B8",
      sidebarActive: dark ? "#6B8FF8" : "#4F7DF3",
      sidebarActiveBg: dark ? "rgba(79,125,243,0.15)" : "#EEF2FF",

      // ── Chart / Tooltip ───────────────────────────
      chartGrid: dark ? "#1E2533" : "#F1F5F9",
      tooltipBg: dark ? "#1C2333" : "#1E293B",

      sidebarBorder: dark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
      sidebarHeading: dark ? "#64748B" : "#94A3B8",
      sidebarHover: dark ? "rgba(255,255,255,0.08)" : "#F1F5F9",
    }),
    [dark],
  );
}
