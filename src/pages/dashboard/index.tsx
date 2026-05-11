import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts";
import {
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Contact2,
  Smartphone,
  NotepadText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "../../utils/utils";
import { useGetDashboardSummary } from "@/src/hooks/dashboard/useGetDashBoardSummary";
import { StatCard } from "@/src/components/ui/dashboard/statCard";
import CommonLoader from "@/src/components/ui/loader/loader";
import { useNavigate } from "react-router-dom";
import { BroadcastForm } from "@/src/components/ui/notification/broadcastForm";
import { Modal } from "@/src/components/ui/modal";
import { Card } from "@/src/components/ui/card";
import InquiryAnalytics from "@/src/components/ui/dashboard/inquiryAnalytics";
import RecentActivity from "@/src/components/ui/dashboard/recentActivity";
import { Live } from "@google/genai";
import { LiveLocationsCard } from "../devices/deviceComponents";

// const stats = [
//   {
//     label: "Total Inquiries",
//     value: "1,284",
//     icon: FileText,
//     color: "bg-blue-500",
//     trend: "+12.5%",
//   },
//   {
//     label: "Assigned",
//     value: "1,102",
//     icon: CheckCircle,
//     color: "bg-green-500",
//     trend: "+8.2%",
//   },
//   {
//     label: "Unassigned",
//     value: "182",
//     icon: AlertCircle,
//     color: "bg-amber-500",
//     trend: "-4.1%",
//   },
//   {
//     label: "Active Agents",
//     value: "24",
//     icon: Users,
//     color: "bg-purple-500",
//     trend: "0%",
//   },
// ];

const chartData = [
  { name: "Mon", inquiries: 45, assigned: 38 },
  { name: "Tue", inquiries: 52, assigned: 48 },
  { name: "Wed", inquiries: 48, assigned: 42 },
  { name: "Thu", inquiries: 61, assigned: 55 },
  { name: "Fri", inquiries: 55, assigned: 50 },
  { name: "Sat", inquiries: 32, assigned: 28 },
  { name: "Sun", inquiries: 28, assigned: 25 },
];

export default function DashboardPage() {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isSuperUser = userData?.role === "superuser";
  const { data, loading, error, getDashboardSummary } =
    useGetDashboardSummary();

  useEffect(() => {
    getDashboardSummary();
  }, []);

  const trends = ["+12.5%", "-4.1%", "+8.2%", "0%"];

  const statsData = (
    data
      ? [
          {
            label: "Total Inquiries",
            value: data.totalInquiries,
            icon: FileText,
            color: "bg-blue-500",
            trend: "+12.5%",
            link: "/inquiries",
          },
          {
            label: "Unassigned",
            value: data.unassigned,
            icon: AlertCircle,
            color: "bg-amber-500",
            trend: "-4.1%",
            link: "/inquiries?tab=unassigned",
          },
          {
            label: "In Progress",
            value: data.inProgress,
            icon: CheckCircle,
            color: "bg-green-500",
            trend: "+8.2%",
            link: "/inquiries?tab=in_progress",
          },
          {
            label: "Closed",
            value: data.closed,
            icon: CheckCircle,
            color: "bg-emerald-500",
            trend: "+5.6%",
            link: "/inquiries?tab=closed",
          },
          {
            label: "Total Sales Person",
            value: `${data.totalSales}`,
            icon: Users,
            color: "bg-indigo-500",
            trend: "+10.3%",
            link: "/sales-persons",
          },
          {
            label: "Total Devices",
            value: data.totalDevices,
            icon: Smartphone,
            color: "bg-purple-500",
            trend: "+2.1%",
            link: "/devices",
          },
          {
            label: "Blocked Devices",
            value: data.blockedDevices,
            icon: AlertCircle,
            color: "bg-red-500",
            trend: "-1.2%",
            link: "/devices",
          },
          {
            label: "Today's Inquiries",
            value: data.todayInquiries,
            icon: NotepadText,
            color: "bg-cyan-500",
            trend: "+12.5%",
            link: "/inquiries",
          },
        ]
      : [
          // fallback dummy data
          {
            label: "Total Inquiries",
            value: "-",
            icon: FileText,
            color: "bg-blue-500",
            trend: "-",
            link: "/inquiries",
          },
          {
            label: "Unassigned",
            value: "-",
            icon: AlertCircle,
            color: "bg-amber-500",
            trend: "-",
            link: "/inquiries?tab=unassigned",
          },
          {
            label: "In Progress",
            value: "-",
            icon: CheckCircle,
            color: "bg-green-500",
            trend: "-",
            link: "/inquiries?tab=in_progress",
          },
          {
            label: "Closed",
            value: "-",
            icon: CheckCircle,
            color: "bg-emerald-500",
            trend: "-",
            link: "/inquiries?tab=closed",
          },
          {
            label: "Total Sales Person",
            value: "-",
            icon: Users,
            color: "bg-indigo-500",
            trend: "-",
            link: "/sales-persons",
          },
          {
            label: "Total Devices",
            value: "-",
            icon: Smartphone,
            color: "bg-purple-500",
            trend: "-",
            link: "/devices",
          },
          {
            label: "Blocked Devices",
            value: "-",
            icon: AlertCircle,
            color: "bg-red-500",
            trend: "-",
            link: "/devices",
          },
          {
            label: "Today's Inquiries",
            value: "-",
            icon: NotepadText,
            color: "bg-cyan-500",
            trend: "-",
            link: "/inquiries",
          },
        ]
  ).map((item, index) => ({
    ...item,
    trend: trends[index],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Dashboard Overview
          </h1>
          <p className="text-sm" style={{ color: tokens.textSec }}>
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            className="px-4 py-2 rounded-xl font-medium text-sm transition-all"
            style={{
              backgroundColor: tokens.surface,
              color: tokens.text,
              border: `1px solid ${tokens.border}`,
            }}
          >
            Download Report
          </button> */}
          <button
            type="button"
            onClick={() => navigate("/inquiries/create")}
            className="px-4 py-2 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            Upload Inquiry
          </button>
          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2 rounded-xl font-medium text-sm text-white bg-accent hover:bg-accentText transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            Broadcast
          </button>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:grid-cols-7"> */}
      <div className="flex flex-wrap gap-6 w-full justify-start items-start">
        {loading ? (
          <CommonLoader fullScreen={true} overlay={true} />
        ) : (
          <>
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <InquiryAnalytics />
        </Card>
        {/* <div
            className="lg:col-span-3 md:col-span-3 sm:col-span-3 grid p-6 rounded-2xl border"
            style={{
              backgroundColor: tokens.surface,
              borderColor: tokens.border,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: tokens.text }}>
                Inquiry Distribution
              </h3>
              <select
                name="timeRange"
                aria-label="Select time range for inquiry distribution"
                className="bg-transparent text-sm outline-none border-none cursor-pointer"
                style={{ color: tokens.textSec }}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>

            <div className="h-[90%] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={tokens.accent}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={tokens.accent}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={tokens.chartGrid}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: tokens.textMuted, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: tokens.textMuted, fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tokens.tooltipBg,
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inquiries"
                    stroke={tokens.accent}
                    fillOpacity={1}
                    fill="url(#colorInq)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="assigned"
                    stroke={tokens.success}
                    fillOpacity={0}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div> */}

        {isSuperUser && <RecentActivity />}
        {/* {isSuperUser && <LiveLocationsCard />} */}
      </div>
      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <Modal
          title="Broadcast Notification"
          onClose={() => setShowBroadcastModal(false)}
        >
          <BroadcastForm onClose={() => setShowBroadcastModal(false)} />
        </Modal>
      )}
    </div>
  );
}
