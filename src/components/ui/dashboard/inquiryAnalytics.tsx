import { useGetInquiryReportByStatus } from "@/src/hooks/dashboard/useGetInquiryReportByStatus";
import { transformInquiryData } from "@/src/utils/utils";
import { useEffect, useState } from "react";
import Input from "../form/input";
import { Button } from "../button";
import ButtonLoader from "../loader/buttonLoader";
import { Recycle, RefreshCcw } from "lucide-react";
import { InquiryStatusChart } from "./inquiryChart";
import CommonLoader from "../loader/loader";
import Swal from "sweetalert2";

// helper for date formatting (yyyy-mm-dd)
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

export default function InquiryAnalytics() {
  const { data, loading, error, getInquiryReportByStatus } =
    useGetInquiryReportByStatus();
  const [activeFilter, setActiveFilter] = useState("30d");
  // ✅ default dates
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [from, setFrom] = useState(formatDate(oneMonthAgo));
  const [to, setTo] = useState(formatDate(today));

  // ✅ initial API call
  useEffect(() => {
    getInquiryReportByStatus(from, to);
  }, []);

  // ✅ submit handler
  const handleSubmit = async () => {
    if (from > to) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date Range",
        text: "'From' date cannot be later than 'To' date.",
      });
      return;
    }
    await getInquiryReportByStatus(from, to);
  };
  const applyRange = async (type: string) => {
    const { from, to } = getDateRange(type);

    const f = formatDate(from);
    const t = formatDate(to);

    setFrom(f);
    setTo(t);

    await getInquiryReportByStatus(f, t);
  };

  const chartData = data ? transformInquiryData(data) : [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text">Inquiry Status</h3>
      {/* ───── Filters ───── */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeFilter === "7d" ? "primary" : "ghost"}
          onClick={() => {
            setActiveFilter("7d");

            applyRange("7d");
          }}
        >
          Last 7 days
        </Button>

        <Button
          size="sm"
          variant={activeFilter === "30d" ? "primary" : "ghost"}
          onClick={() => {
            setActiveFilter("30d");

            applyRange("30d");
          }}
        >
          Last 30 days
        </Button>

        <Button
          size="sm"
          variant={activeFilter === "thisMonth" ? "primary" : "ghost"}
          onClick={() => {
            setActiveFilter("thisMonth");

            applyRange("thisMonth");
          }}
        >
          This Month
        </Button>

        <Button
          size="sm"
          variant={activeFilter === "lastMonth" ? "primary" : "ghost"}
          onClick={() => {
            setActiveFilter("lastMonth");

            applyRange("lastMonth");
          }}
        >
          Last Month
        </Button>
      </div>
      <div className="grid lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-2">
        <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
          <Input
            label="From"
            inputName="from"
            inputType="date"
            inputValue={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="From date"
            showLabel={false}
          />
        </div>
        <div className="text-text font-semibold text-2xl w-full flex items-center justify-center col-span-1">
          →
        </div>
        <div className="lg:col-span-4 md:col-span-2 sm:col-span-1">
          <Input
            label="To"
            inputName="to"
            inputType="date"
            inputValue={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="To date"
            showLabel={false}
          />
        </div>
        <div className="col-span-1 flex items-end justify-end">
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {/* {loading ? <ButtonLoader/> : <RefreshCcw/>} */}
            <RefreshCcw className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* ───── Error ───── */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* ───── Chart ───── */}
      {loading && chartData.length < 0 ? (
        <CommonLoader fullScreen={false} overlay={true} />
      ) : (
        <InquiryStatusChart data={chartData} loading={loading} />
      )}

      {/* ───── Empty State ───── */}
      {!loading && chartData.length === 0 && (
        <div className="text-sm text-gray-400">
          No data available for selected range
        </div>
      )}
    </div>
  );
}
