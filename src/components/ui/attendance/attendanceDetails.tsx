import { useState } from "react";

import { AttendanceSessions } from "@/src/types/attendance";
import AttendanceTimeline from "./attendanceTimeline";
import AttendanceMap from "./attendanceMap";
import Tabs, { TabItem } from "../tabs";
import { Clock, Map } from "lucide-react";

export function AttendanceDetails({
  sessions,
}: {
  sessions: AttendanceSessions[];
}) {
  const tabs: TabItem[] = [
    {
      key: "timeline",
      label: "Timeline",
      icon: <Clock size={16} />,
      content: <AttendanceTimeline sessions={sessions} />,
    },
    {
      key: "map",
      label: "Map",
      icon: <Map size={16} />,
      content: <AttendanceMap sessions={sessions} />,
    },
  ];
  return (
    <Tabs
      tabs={tabs}
      defaultValue="timeline"
      isPadded={false}
      variant="card" // 👈 change to "timeline" if you want step UI
    />
  );
}
