import { useState, type ReactNode } from "react";
import clsx from "clsx";

import { useTheme } from "@/src/contexts";

export type TabItem = {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  content?: ReactNode;
};

type TabsVariant = "card" | "pill" | "underline" | "solid" | "timeline";

type TabsProps = {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  variant?: TabsVariant;
  className?: string;

  isPadded?: boolean;
};

const Tabs = ({
  tabs,
  value,
  defaultValue,
  onChange,
  variant = "card",
  className = "",

  isPadded = true,
}: TabsProps) => {
  const { tokens } = useTheme();

  const isControlled = value !== undefined;
  const [internalTab, setInternalTab] = useState(defaultValue || tabs[0]?.key);

  const activeTab = isControlled ? value : internalTab;

  const setTab = (key: string) => {
    if (!isControlled) setInternalTab(key);
    onChange?.(key);
  };

  const activeIndex = tabs.findIndex((t) => t.key === activeTab);
  const activeContent = tabs.find((t) => t.key === activeTab)?.content;

  // ─────────────────────────────────────────
  // 🟣 TIMELINE VARIANT
  // ─────────────────────────────────────────
  if (variant === "timeline") {
    return (
      <div className={className}>
        <div className="flex items-center w-full">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            const isCompleted = index < activeIndex;

            return (
              <div
                key={tab.key}
                className="flex justify-center items-center flex-1 cursor-pointer"
                onClick={() => setTab(tab.key)}
              >
                {/* Circle */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all "
                    style={{
                      background: isActive
                        ? tokens.accent
                        : isCompleted
                          ? tokens.success
                          : tokens.surfaceElevated,
                      color:
                        isActive || isCompleted ? "#fff" : tokens.textMuted,
                      border: `1px solid ${
                        isActive ? tokens.accent : tokens.border
                      }`,
                    }}
                  >
                    {tab.icon || index + 1}
                  </div>

                  <span
                    className="mt-1 text-xs font-medium"
                    style={{
                      color: isActive ? tokens.accent : tokens.textMuted,
                    }}
                  >
                    {tab.label}
                  </span>
                </div>

                {/* Line */}
                {index !== tabs.length - 1 && (
                  <div
                    className="flex-1 h-[2px] mx-2"
                    style={{
                      background:
                        index < activeIndex ? tokens.success : tokens.border,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-6 rounded-xl p-5 bg-(--surface) border border-(--border) text-(--text)">
          {activeContent}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // 🔵 DEFAULT VARIANTS (your original)
  // ─────────────────────────────────────────

  return (
    <div className={className}>
      {/* Header */}
      <div
        className={clsx(
          "flex gap-1 overflow-x-auto custom-tabs-scroll",
          variant === "card" && "rounded-xl p-1",
          variant === "pill" && "rounded-full p-1",
          variant === "solid" && "gap-2",
          variant === "underline" && "border-b",
        )}
        style={{
          background:
            variant === "card" || variant === "pill"
              ? tokens.surfaceElevated
              : undefined,
          borderColor: tokens.border,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className="flex shrink-0 flex-1 items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background:
                  variant === "solid"
                    ? isActive
                      ? tokens.text
                      : "transparent"
                    : isActive
                      ? tokens.surface
                      : "transparent",
                color: isActive
                  ? variant === "solid"
                    ? tokens.textOpp
                    : tokens.text
                  : tokens.textMuted,
                borderRadius: variant === "pill" ? "999px" : "8px",
                border:
                  variant === "solid" && !isActive
                    ? `1px solid ${tokens.border}`
                    : "none",
                borderBottom:
                  variant === "underline" && isActive
                    ? `2px solid ${tokens.text}`
                    : "none",
              }}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isPadded ? (
        <div
          className="mt-4 p-5 rounded-xl"
          style={{
            background: tokens.surface,
            color: tokens.text,
            border:
              variant !== "underline" ? `1px solid ${tokens.border}` : "none",
          }}
        >
          {activeContent}
        </div>
      ) : (
        <div
          className="mt-4 rounded-xl"
          style={{
            background: tokens.surface,
            color: tokens.text,
            border:
              variant !== "underline" ? `1px solid ${tokens.border}` : "none",
          }}
        >
          {activeContent}
        </div>
      )}
    </div>
  );
};

export default Tabs;
