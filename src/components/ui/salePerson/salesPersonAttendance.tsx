import React from "react";
import { useTheme } from "@/src/contexts";
import { SalesPerson } from "@/src/types/users";

interface Props {
  attendance?: SalesPerson["attendance"];
}

export default function SalesPersonAttendance({ attendance }: Props) {
  const { tokens } = useTheme();

  const present = attendance?.present ?? 0;
  const absent = attendance?.absent ?? 0;
  const halfDay = attendance?.halfDay ?? 0;
  const total = attendance?.totalDays ?? 0;

  const items = [
    { label: "Present", value: present },
    { label: "Absent", value: absent },
    { label: "Half", value: halfDay },
    { label: "Total", value: total },
  ];

  return (
    <div
      className="w-full p-3 rounded-xl grid grid-cols-4 gap-2 text-center text-xs"
      style={{ backgroundColor: tokens.bg }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center space-y-1"
        >
          <p
            className="text-[10px] uppercase tracking-wide"
            style={{ color: tokens.textMuted }}
          >
            {item.label}
          </p>

          <p className="font-bold text-sm" style={{ color: tokens.text }}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
