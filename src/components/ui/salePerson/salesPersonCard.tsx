import React from "react";
import { Mail, Phone, MoreVertical } from "lucide-react";
import { SalesPerson } from "@/src/types/users";
import { cn } from "@/src/utils/utils";
import { useTheme } from "@/src/contexts";

interface Props {
  person: SalesPerson;
  onViewReport?: (person: SalesPerson) => void;
  onToggleStatus?: (person: SalesPerson) => void;
}

const defaultStats = {
  status: "active",
  performance: 75,
  totalInquiries: 0,
  closedInquiries: 0,
  avatar: "https://ui-avatars.com/api/?name=User",
};

export default function SalesPersonCard({
  person,
  onViewReport,
  onToggleStatus,
}: Props) {
  const { tokens } = useTheme();

  // ✅ Merge API data with defaults
  const data = {
    ...defaultStats,
    ...person,
    avatar:
      (person as any)?.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`,
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-xl"
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="relative">
            <img
              src={data.avatar}
              alt={data.name}
              className="w-16 h-16 rounded-2xl object-cover border-2"
              style={{ borderColor: tokens.border }}
            />

            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2",
                data.status === "active" ? "bg-green-500" : "bg-red-500",
              )}
              style={{ borderColor: tokens.surface }}
            />
          </div>

          <button
            title="More"
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{
              color: tokens.textMuted,
              backgroundColor: tokens.borderLight,
            }}
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Info */}
        <div className="mb-6">
          <h3 className="text-lg font-bold" style={{ color: tokens.text }}>
            {data.name}
          </h3>

          <p className="text-xs mt-1" style={{ color: tokens.textMuted }}>
            ID: {data.employeeId || "N/A"}
          </p>

          <p className="text-xs" style={{ color: tokens.textMuted }}>
            Area: {data.assignedArea || "Not Assigned"}
          </p>

          <div className="flex flex-col gap-1 mt-2">
            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: tokens.textSec }}
            >
              <Mail size={14} />
              {data.email || "No email"}
            </div>

            <div
              className="flex items-center gap-2 text-xs"
              style={{ color: tokens.textSec }}
            >
              <Phone size={14} />
              {data.phone || "No phone"}
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="space-y-4">
          <div>
            <div
              className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider"
              style={{ color: tokens.textMuted }}
            >
              <span>Performance</span>
              <span
                style={{
                  color: data.performance > 80 ? tokens.success : tokens.danger,
                }}
              >
                {data.performance}%
              </span>
            </div>

            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ backgroundColor: tokens.bg }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${data.performance}%`,
                  backgroundColor:
                    data.performance > 80 ? tokens.success : tokens.danger,
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: tokens.bg }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: tokens.textMuted }}
              >
                Total
              </p>
              <p className="text-lg font-bold" style={{ color: tokens.text }}>
                {data.totalInquiries}
              </p>
            </div>

            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: tokens.bg }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: tokens.textMuted }}
              >
                Closed
              </p>
              <p className="text-lg font-bold" style={{ color: tokens.text }}>
                {data.closedInquiries}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t flex items-center justify-between"
        style={{
          borderColor: tokens.border,
          backgroundColor: tokens.bg + "30",
        }}
      >
        <button
          onClick={() => onViewReport?.(data)}
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          View Full Report
        </button>

        <button
          onClick={() => onToggleStatus?.(data)}
          className={cn(
            "text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
            data.status === "active"
              ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
              : "text-green-500 bg-green-500/10 hover:bg-green-500/20",
          )}
        >
          {data.status === "active" ? "Block Agent" : "Unblock Agent"}
        </button>
      </div>
    </div>
  );
}
