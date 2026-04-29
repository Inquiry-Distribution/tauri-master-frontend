import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "recharts";

import type { SalesPersonId, SalesPersonReport } from "@/src/types/users";
import { useGetSalesPersonById } from "@/src/hooks/salesPerson/useGetSalesPerson";
import { useGetSalesPersonReport } from "@/src/hooks/salesPerson/useGetSalesPersonReport";
import InquiriesTable from "@/src/components/ui/salePerson/inquiryTable.tsx/inquiryTable";
import { Card } from "@/src/components/ui/card";

const COLORS = ["#4F7DF3", "#34D399", "#FB923C"];

export default function SalesPersonReportPage() {
  const { id } = useParams();

  const { getSalesPersonById, loading: userLoading } = useGetSalesPersonById();
  const { getSalesPersonReport, loading: reportLoading } =
    useGetSalesPersonReport();

  const [user, setUser] = useState<SalesPersonId | null>(null);
  const [report, setReport] = useState<SalesPersonReport | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userRes = await getSalesPersonById(id);
        const reportRes = await getSalesPersonReport(id, "");

        setUser(userRes.data);
        setReport(reportRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const loading = userLoading || reportLoading;

  const barData = [
    { name: "Closed", value: report?.closed || 0 },
    { name: "In Progress", value: report?.inProgress || 0 },
    { name: "Follow Up", value: report?.followUp || 0 },
  ];

  const pieData = [
    { name: "Converted", value: report?.converted || 0 },
    {
      name: "Remaining",
      value: (report?.total || 0) - (report?.converted || 0),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-textSec">
        Loading report...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-danger">
        Failed to load salesperson data.
      </div>
    );
  }

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
            Detailed performance for {user.name}
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
                  user.profileImage ||
                  `https://picsum.photos/seed/${id}/200/200`
                }
                className="w-24 h-24 rounded-2xl object-cover mb-4 border border-border"
              />

              <h2 className="text-xl font-bold text-text">{user.name}</h2>

              {user.company && (
                <p className="text-xs text-textMuted">{user.company.name}</p>
              )}

              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  user.isActive
                    ? "bg-successLight text-success"
                    : "bg-dangerLight text-danger"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>

              <div className="w-full mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-text">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2 text-text">
                  <Phone size={16} />
                  <span>{user.phone || "N/A"}</span>
                </div>

                <div className="flex items-center gap-2 text-textSec">
                  <Calendar size={16} />
                  {new Date(user.createdAt).toDateString()}
                </div>

                {user.assignedArea && (
                  <div className="flex items-center gap-2 text-textSec">
                    <MapPin size={16} />
                    {user.assignedArea}
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
                  {user.device?.platform || "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">App Version</span>
                <span className="text-text">
                  {user.device?.appVersion || "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">Last Seen</span>
                <span className="text-text">
                  {user.device?.lastSeen
                    ? new Date(user.device.lastSeen).toLocaleString()
                    : "—"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-textSec">Status</span>
                <span
                  className={
                    user.device?.isBlocked ? "text-danger" : "text-success"
                  }
                >
                  {user.device?.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="p-6 rounded-2xl border border-border bg-surface">
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
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-text">
                <TrendingUp size={18} /> Performance
              </h3>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid stroke="var(--chartGrid)" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--accent)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="p-6 rounded-2xl border border-border bg-surface">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-text">
                <PieChartIcon size={18} /> Conversion Split
              </h3>

              <div className="h-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <Card>
            <InquiriesTable personId={id || ""} />
          </Card>
        </div>
      </div>
    </div>
  );
}
