import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  PieChart as PieChartIcon,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import type { SalesPersonId, SalesPersonReport } from "@/src/types/users";
import { useGetSalesPersonById } from "@/src/hooks/salesPerson/useGetSalesPerson";
import { useGetSalesPersonReport } from "@/src/hooks/salesPerson/useGetSalesPersonReport";
import InquiriesTable from "@/src/components/ui/salePerson/inquiryTable.tsx/inquiryTable";
import { Card } from "@/src/components/ui/card";
import CommonLoader from "@/src/components/ui/loader/loader";
import { useTheme } from "@/src/contexts";
import { Button } from "@/src/components/ui/button";
import Input from "@/src/components/ui/form/input";
import Swal from "sweetalert2";
import { useGetAttendanceById } from "@/src/hooks/attendance/useGetAttendanceById";
import { AttendanceResponse } from "@/src/types/attendance";
import { SalespersonLocationHistory } from "@/src/components/ui/salePerson/report/salesPersonLocationHistory";
import UserAuditLogTable from "@/src/components/ui/salePerson/report/auditLogTable";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getDateRange = (type: string) => {
  const today = new Date();

  switch (type) {
    case "7d": {
      const from = new Date();
      from.setDate(today.getDate() - 7);
      return { from, to: today };
    }

    case "30d": {
      const from = new Date();
      from.setDate(today.getDate() - 30);
      return { from, to: today };
    }

    case "thisMonth": {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from, to: today };
    }

    case "lastMonth": {
      const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from, to };
    }

    default:
      return { from: today, to: today };
  }
};

export default function SalesPersonReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const chartColors = {
    closed: tokens.success,
    inProgress: tokens.warning,
    followUp: tokens.accent,
    converted: tokens.accentText,
    remaining: tokens.textMuted,
  };
  const { getSalesPersonById, loading: userLoading } = useGetSalesPersonById();
  const { getSalesPersonReport, loading: reportLoading } =
    useGetSalesPersonReport();
  const { getAttendancePerson, loading: attendanceLoading } =
    useGetAttendanceById();

  const [user, setUser] = useState<SalesPersonId | null>(null);
  const [report, setReport] = useState<SalesPersonReport | null>(null);
  const [attendance, setAttendance] = useState<AttendanceResponse | null>(null);

  const [filterMode, setFilterMode] = useState<"range" | "">("range");
  const [page, setPage] = useState(1);
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [from, setFrom] = useState(formatDate(oneMonthAgo));
  const [to, setTo] = useState(formatDate(today));
  const [activeRange, setActiveRange] = useState<string>("30d");
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // const userRes = await getSalesPersonById(id);
        // const reportRes = await getSalesPersonReport(
        //   id,
        //   `from=${from}&to=${to}`,
        // );
        // const attendanceRes = await getAttendancePerson(
        //   id,
        //   `from=${from}&to=${to}`,
        // );
        const [userRes, reportRes, attendanceRes] = await Promise.all([
          getSalesPersonById(id),
          getSalesPersonReport(id, `from=${from}&to=${to}`),
          getAttendancePerson(id, `from=${from}&to=${to}`),
        ]);

        setUser(userRes.data);
        setReport(reportRes.data);
        setAttendance(attendanceRes);
        // setReport({
        //   total: 6,

        //   inProgress: 2,
        //   followUp: 1,
        //   closed: 2,
        //   converted: 1,
        //   conversionRate: "16.67%",
        //   closeRate: "25.00%",
        // });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to load salesperson data.",
        });
      } finally {
        setHasFetched(true);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // const reportRes = await getSalesPersonReport(
        //   id,
        //   `from=${from}&to=${to}`,
        // );
        // const attendanceRes = await getAttendancePerson(
        //   id,
        //   `from=${from}&to=${to}`,
        // );
        const [reportRes, attendanceRes] = await Promise.all([
          getSalesPersonReport(id, `from=${from}&to=${to}`),
          getAttendancePerson(id, `from=${from}&to=${to}`),
        ]);
        setReport(reportRes.data);
        setAttendance(attendanceRes);
        // setReport({
        //   total: 6,

        //   inProgress: 2,
        //   followUp: 1,
        //   closed: 2,
        //   converted: 1,
        //   conversionRate: "16.67%",
        //   closeRate: "25.00%",
        // });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id, from, to]);

  const loading = userLoading || reportLoading;

  const applyRange = (type: string) => {
    const { from, to } = getDateRange(type);

    setFrom(formatDate(from));
    setTo(formatDate(to));

    setActiveRange(type);
    setFilterMode("range");
    setPage(1);
  };

  const attendanceStats = useMemo(() => {
    if (!attendance?.records) return null;

    return {
      total: attendance.total,
      presentDays: attendance.records.filter((r) => r.status === "present")
        .length,
      sessions: attendance.records.reduce(
        (a, r) => a + (r.sessionsCount || 0),
        0,
      ),
      minutes: attendance.records.reduce(
        (a, r) => a + (r.totalMinutes || 0),
        0,
      ),
    };
  }, [attendance]);

  const barData = [
    { name: "Closed", value: report?.closed || 0 },
    { name: "In Progress", value: report?.inProgress || 0 },
    { name: "Follow Up", value: report?.followUp || 0 },
    { name: "Converted", value: report?.converted || 0 },
  ];

  const pieData = [
    { name: "Converted", value: report?.converted || 0 },
    {
      name: "Remaining",
      value: (report?.total || 0) - (report?.converted || 0),
    },
  ];
  if (!id) navigate("/sales-persons");

  if (loading && !hasFetched) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-textSec">
        <CommonLoader size={24} fullScreen={false} overlay={true} />
      </div>
    );
  }

  // if (!user) {
  //   return (
  //     <div className="text-center text-danger">
  //       Failed to load salesperson data.
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/sales-persons"
          className="p-2 rounded-lg bg-borderLight hover:opacity-80"
        >
          <ChevronLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-text">Agent Report</h1>
          <p className="text-sm text-textSec">
            Detailed performance for {user?.name || "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="p-6 rounded-2xl border border-border bg-surface">
            <div className="flex flex-col items-center text-center">
              <img
                src={
                  user?.profileImage ||
                  `https://picsum.photos/seed/${id}/200/200`
                }
                className="w-24 h-24 rounded-2xl object-cover mb-4 border border-border"
              />

              <h2 className="text-xl font-bold text-text">
                {user?.name || "-"}
              </h2>

              {user?.company && (
                <p className="text-xs text-textMuted">
                  {user?.company?.name || "-"}
                </p>
              )}

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  user?.isActive
                    ? "bg-successLight text-success"
                    : "bg-dangerLight text-danger"
                }`}
              >
                {user?.isActive ? "Active" : "Inactive"}
              </span>

              <div className="w-full mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-text">
                  <Mail size={16} />
                  <span>{user?.email || "-"}</span>
                </div>

                <div className="flex items-center gap-2 text-text">
                  <Phone size={16} />
                  <span>{user?.phone || "-"}</span>
                </div>

                <div className="flex items-center gap-2 text-textSec">
                  <Calendar size={16} />
                  {new Date(user?.createdAt || "").toDateString() || "-"}
                </div>

                {user?.assignedArea && (
                  <div className="flex items-center gap-2 text-textSec">
                    <MapPin size={16} />
                    {user?.assignedArea || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="p-6 rounded-2xl border border-border bg-surface">
            <h3 className="font-bold mb-4 text-text">Device Info</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-textSec">Platform</span>
                <span className="text-text">
                  {user?.device?.platform || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">App Version</span>
                <span className="text-text">
                  {user?.device?.appVersion || "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">Last Seen</span>
                <span className="text-text">
                  {user?.device?.lastSeen
                    ? new Date(user?.device?.lastSeen || "").toLocaleString()
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">Status</span>
                <span
                  className={
                    user?.device?.isBlocked ? "text-danger" : "text-success"
                  }
                >
                  {user?.device?.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          {/* <div className="p-6 rounded-2xl border border-border bg-surface">
            <h3 className="font-bold mb-4 text-text">Key Metrics</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-textSec">Conversion Rate</span>
                <span className="text-success font-semibold">
                  {report?.conversionRate || "0%"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">Close Rate</span>
                <span className="text-text">{report?.closeRate || "0%"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">Total Leads</span>
                <span className="text-text">{report?.total || 0}</span>
              </div>
            </div>
          </div> */}

          {/* Attendance */}
          <div className="relative p-6 rounded-2xl border border-border bg-surface">
            <h3 className="font-bold mb-4 text-text">Attendance Summary</h3>

            {/* Loader Overlay */}
            {attendanceLoading && (
              <CommonLoader
                fullScreen={false}
                className="absolute inset-0 z-10"
              />
            )}

            <div className={attendanceLoading ? "opacity-40" : ""}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-textSec">Total Days</span>
                  <span className="text-text">
                    {attendanceStats?.total ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-textSec">Present Days</span>
                  <span className="text-success font-semibold">
                    {attendanceStats?.presentDays ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-textSec">Sessions</span>
                  <span className="text-text">
                    {attendanceStats?.sessions ?? 0}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-textSec">Working Time</span>
                  <span className="text-text">
                    {attendanceStats?.minutes ?? 0} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          <SalespersonLocationHistory salespersonId={id || ""} />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-4 rounded-xl border border-border bg-surface space-y-4">
            {/* Preset Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="text-sm font-medium"
                style={{ color: tokens.textMuted }}
              >
                Date Range:
              </div>

              <Button
                size="sm"
                variant={activeRange === "7d" ? "primary" : "ghost"}
                onClick={() => applyRange("7d")}
              >
                Last 7 days
              </Button>

              <Button
                size="sm"
                variant={activeRange === "30d" ? "primary" : "ghost"}
                onClick={() => applyRange("30d")}
              >
                Last 30 days
              </Button>

              <Button
                size="sm"
                variant={activeRange === "thisMonth" ? "primary" : "ghost"}
                onClick={() => applyRange("thisMonth")}
              >
                This Month
              </Button>

              <Button
                size="sm"
                variant={activeRange === "lastMonth" ? "primary" : "ghost"}
                onClick={() => applyRange("lastMonth")}
              >
                Last Month
              </Button>
              {/* Custom Range */}
              <div className="lg:w-1/3 md:w-1/2 w-full grid lg:grid-cols-10 md:grid-cols-6 grid-cols-4 gap-2">
                <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
                  <Input
                    placeholder="From"
                    label="From"
                    inputName="from"
                    inputType="date"
                    inputValue={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                      setFilterMode("range");
                      setActiveRange("");
                      setPage(1);
                    }}
                    showLabel={false}
                  />
                </div>

                <div className="text-text font-semibold text-2xl flex items-center justify-center col-span-1">
                  →
                </div>

                <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
                  <Input
                    placeholder="To"
                    label="To"
                    inputName="to"
                    inputType="date"
                    inputValue={to}
                    onChange={(e) => {
                      setTo(e.target.value);
                      setFilterMode("range");
                      setActiveRange("");
                      setPage(1);
                    }}
                    showLabel={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surfaceElevated border border-border">
              <p className="text-xs text-textMuted">Converted</p>
              {reportLoading ? (
                <div className="h-6 w-10 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-xl font-bold text-success">
                  {report?.converted}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-surfaceElevated border border-border">
              <p className="text-xs text-textMuted">In Progress</p>
              {reportLoading ? (
                <div className="h-6 w-10 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-xl font-bold text-warning">
                  {report?.inProgress}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-surfaceElevated border border-border">
              <p className="text-xs text-textMuted">Closed</p>
              {reportLoading ? (
                <div className="h-6 w-10 bg-muted rounded animate-pulse" />
              ) : (
                <p className="text-xl font-bold text-accent">
                  {report?.closed}
                </p>
              )}
            </div>
          </div>
          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6 relative">
            {reportLoading && (
              <CommonLoader
                fullScreen={false}
                className="absolute inset-0 z-10"
              />
            )}
            {/* Bar Chart */}
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-text">
                <TrendingUp size={18} /> Performance
              </h3>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid stroke={tokens.chartGrid} vertical={false} />

                    <XAxis
                      dataKey="name"
                      tick={{ fill: tokens.textSec, fontSize: 12 }}
                      axisLine={{ stroke: tokens.border }}
                    />

                    <YAxis
                      tick={{ fill: tokens.textSec, fontSize: 12 }}
                      axisLine={{ stroke: tokens.border }}
                    />

                    <Tooltip
                      contentStyle={{
                        background: tokens.tooltipBg,
                        border: `1px solid ${tokens.border}`,
                        borderRadius: 12,
                        color: tokens.textOpp,
                      }}
                    />

                    {/* 🔥 Legend */}
                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    <Bar dataKey="value" radius={[10, 10, 0, 0]} name="Leads">
                      {barData.map((entry, index) => {
                        const map: any = {
                          Closed: chartColors.closed,
                          "In Progress": chartColors.inProgress,
                          "Follow Up": chartColors.followUp,
                          Converted: chartColors.converted,
                        };
                        return <Cell key={index} fill={map[entry.name]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-text">
                <PieChartIcon size={18} />
                Conversion Split
              </h3>

              <div className="h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      stroke={tokens.border}
                      cornerRadius={6}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            entry.name === "Converted"
                              ? chartColors.converted
                              : chartColors.remaining
                          }
                        />
                      ))}
                    </Pie>

                    {/* Tooltip */}
                    <Tooltip
                      contentStyle={{
                        background: tokens.tooltipBg,
                        border: `1px solid ${tokens.border}`,
                        borderRadius: 12,
                        color: tokens.textOpp,
                      }}
                    />

                    {/* Legend */}
                    <Legend />

                    {/* 🔥 Center Label */}
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fill: tokens.text,
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {report?.conversionRate || "0%"}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <Card>
            <InquiriesTable personId={id || ""} />
          </Card>
          <Card>
            <UserAuditLogTable userId={id || ""} />
          </Card>
        </div>
      </div>
    </div>
  );
}
