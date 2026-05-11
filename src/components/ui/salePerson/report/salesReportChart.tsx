import { useEffect, useState } from "react";
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
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useGetSalesPersonReport } from "@/src/hooks/salesPerson/useGetSalesPersonReport";
import CommonLoader from "../../loader/loader";

const COLORS = ["#4F7DF3", "#34D399"];

export default function SalesPersonReportCharts({ id }: { id: string }) {
  const { getSalesPersonReport, loading } = useGetSalesPersonReport();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchReport = async () => {
      try {
        const res = await getSalesPersonReport(id, "");
        setReport(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <CommonLoader size={32} fullScreen={false} />;

  if (!report) return <div>No report data</div>;

  const barData = [
    { name: "Closed", value: report.closed || 0 },
    { name: "In Progress", value: report.inProgress || 0 },
    { name: "Follow Up", value: report.followUp || 0 },
  ];

  const pieData = [
    { name: "Converted", value: report.converted || 0 },
    { name: "Remaining", value: report.total - report.converted || 0 },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bar */}
      <div className="p-6 border rounded-2xl">
        <h3 className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} /> Performance
        </h3>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F7DF3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie */}
      <div className="p-6 border rounded-2xl">
        <h3 className="flex items-center gap-2 mb-4">
          <PieChartIcon size={18} /> Conversion
        </h3>

        <ResponsiveContainer width="100%" height={200}>
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
  );
}
