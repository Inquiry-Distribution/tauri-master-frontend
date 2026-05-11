import { useTheme } from "@/src/contexts";
import { SalesPerson } from "@/src/types/users";

type Props = {
  person: SalesPerson;
  onToggleStatus?: (p: SalesPerson) => void;
  onEdit?: (p: SalesPerson) => void;
  onResetDevice?: (id: string) => void;
  onResetPin?: (id: string) => void;
};

export default function SalesPersonCard({ person, ...actions }: Props) {
  const { tokens } = useTheme();

  const inquiries = person.inquiries || {};
  const attendance = person.attendance || {};

  const performance = parseFloat(
    (inquiries as any)?.conversionRate?.replace("%", "") || "0",
  );

  const avatar =
    person.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`;

  const status = person.isActive ? "active" : "inactive";

  const performanceColor =
    performance >= 70
      ? tokens.success
      : performance >= 40
        ? tokens.warning
        : tokens.danger;

  const presentPct = (attendance as any)?.totalDays
    ? ((attendance as any)?.present / (attendance as any)?.totalDays) * 100
    : 0;

  const halfPct = (attendance as any)?.totalDays
    ? ((attendance as any)?.halfPresent / (attendance as any)?.totalDays) * 100
    : 0;

  const absentPct = (attendance as any)?.totalDays
    ? ((attendance as any)?.absent / (attendance as any)?.totalDays) * 100
    : 0;

  return (
    <div
      className="max-w-full rounded-2xl overflow-hidden border transition-all hover:shadow-xl"
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }}
    >
      {/* Header */}
      <div className="p-5 flex gap-3">
        <img src={avatar} className="w-12 h-12 rounded-full object-cover" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium" style={{ color: tokens.text }}>
              {person.name}
            </p>

            <span
              className="text-[11px] px-2 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  status === "active"
                    ? tokens.successLight
                    : tokens.dangerLight,
                color: status === "active" ? tokens.success : tokens.danger,
              }}
            >
              {status === "active" ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="text-xs mb-1" style={{ color: tokens.textMuted }}>
            {person.employeeId} · Area: {person.assignedArea || "N/A"}
          </p>

          <div className="space-y-1 text-xs" style={{ color: tokens.textSec }}>
            <div>{person.email}</div>
            <div>{person.phone}</div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${tokens.border}` }} />

      {/* Inquiries */}
      <div className="p-5">
        <p
          className="text-[10px] uppercase tracking-wider mb-3"
          style={{ color: tokens.textMuted }}
        >
          Inquiries
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Total", (inquiries as any)?.total],
            ["In Progress", (inquiries as any)?.inProgress],
            ["Follow Up", (inquiries as any)?.followUp],
            ["Closed", (inquiries as any)?.closed],
            ["Converted", (inquiries as any)?.converted],
            ["Assigned", (inquiries as any)?.assigned],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-md p-2"
              style={{ backgroundColor: tokens.bg }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: tokens.text }}
              >
                {value || 0}
              </div>
              <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Rates */}
        <div className="flex gap-2 mt-3 text-center">
          <div
            className="flex-1 rounded-md p-2"
            style={{ backgroundColor: tokens.bg }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: tokens.success }}
            >
              {(inquiries as any)?.closeRate || "0%"}
            </p>
            <p className="text-[10px]" style={{ color: tokens.textMuted }}>
              Close rate
            </p>
          </div>

          <div
            className="flex-1 rounded-md p-2"
            style={{ backgroundColor: tokens.bg }}
          >
            <p className="text-sm font-medium" style={{ color: tokens.accent }}>
              {(inquiries as any)?.conversionRate || "0%"}
            </p>
            <p className="text-[10px]" style={{ color: tokens.textMuted }}>
              Conversion
            </p>
          </div>
        </div>

        {/* Performance bar */}
        <div
          className="h-1.5 rounded mt-3 overflow-hidden"
          style={{ backgroundColor: tokens.bg }}
        >
          <div
            className="h-full"
            style={{
              width: `${performance}%`,
              backgroundColor: performanceColor,
            }}
          />
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${tokens.border}` }} />

      {/* Attendance */}
      <div className="p-5">
        <p
          className="text-[10px] uppercase tracking-wider mb-3"
          style={{ color: tokens.textMuted }}
        >
          Attendance
        </p>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["Present", (attendance as any)?.present, tokens.success],
            ["Half", (attendance as any)?.halfDay, tokens.warning],
            ["Absent", (attendance as any)?.absent, tokens.danger],
            ["Total", (attendance as any)?.totalDays],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-md p-2"
              style={{ backgroundColor: tokens.bg }}
            >
              <div className="text-sm font-medium" style={{ color }}>
                {value || 0}
              </div>
              <div className="text-[10px]" style={{ color: tokens.textMuted }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Attendance bar */}
        <div className="h-1.5 rounded mt-3 overflow-hidden flex">
          <div
            style={{
              width: `${presentPct}%`,
              backgroundColor: tokens.success,
            }}
          />
          <div
            style={{
              width: `${halfPct}%`,
              backgroundColor: tokens.warning,
            }}
          />
          <div
            style={{
              width: `${absentPct}%`,
              backgroundColor: tokens.danger,
            }}
          />
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${tokens.border}` }} />

      {/* Footer */}
      <div
        className="p-4 flex flex-wrap gap-2"
        style={{ backgroundColor: tokens.bg }}
      >
        <button
          onClick={() => actions.onToggleStatus?.(person)}
          className="text-xs px-3 py-1.5 rounded-md border"
          style={{
            backgroundColor:
              status === "active" ? tokens.successLight : tokens.dangerLight,
            color: status === "active" ? tokens.success : tokens.danger,
            borderColor: tokens.border,
          }}
        >
          {status === "active" ? "Active" : "Inactive"}
        </button>

        <button
          onClick={() => actions.onResetPin?.(person.id)}
          className="text-xs px-3 py-1.5 rounded-md border"
          style={{ borderColor: tokens.border, color: tokens.text }}
        >
          Reset PIN
        </button>

        <button
          onClick={() => actions.onEdit?.(person)}
          className="text-xs px-3 py-1.5 rounded-md border"
          style={{ borderColor: tokens.border, color: tokens.text }}
        >
          Edit
        </button>

        <button
          onClick={() => actions.onResetDevice?.(person.id)}
          className="text-xs px-3 py-1.5 rounded-md border"
          style={{
            backgroundColor: tokens.dangerLight,
            color: tokens.danger,
            borderColor: tokens.border,
          }}
        >
          Reset Device
        </button>
      </div>
    </div>
  );
}
