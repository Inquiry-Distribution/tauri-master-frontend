import { useTheme } from "@/src/contexts";
import { cn } from "@/src/utils/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: string; // ✅ make optional// make required (since you're always using it)
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  trend,
}: StatCardProps) => {
  const { tokens } = useTheme();

  return (
    <div
      className="p-6 rounded-2xl border transition-all duration-200 hover:shadow-lg lg:w-2xs xl:w-3xs md:w-xs w-sm"
      style={{
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        {/* ICON */}
        <div className={cn("p-3 rounded-xl text-white shadow-lg", color)}>
          <Icon size={24} />
        </div>

        {/* TREND */}
        {/* {trend && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-lg",
              trend.startsWith("+")
                ? "text-green-500 bg-green-500/10"
                : trend.startsWith("-")
                  ? "text-red-500 bg-red-500/10"
                  : "text-gray-500 bg-gray-500/10",
            )}
          >
            {trend}
          </span>
        )} */}
      </div>

      {/* CONTENT */}
      <div>
        <p
          className="text-sm font-medium mb-1"
          style={{ color: tokens.textMuted }}
        >
          {label}
        </p>

        <h3 className="text-2xl font-bold" style={{ color: tokens.text }}>
          {value}
        </h3>
      </div>
    </div>
  );
};
